package com.examguard.service;

import com.examguard.dto.*;
import com.examguard.entity.*;
import com.examguard.entity.enums.AttemptStatus;
import com.examguard.exception.BadRequestException;
import com.examguard.exception.ResourceNotFoundException;
import com.examguard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class StudentExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<ExamDto> getAvailableExamsForStudent(Long studentId) {
        List<Exam> published = examRepository.findByPublishedTrue();
        LocalDateTime now = LocalDateTime.now();
        
        // Find all exams the student has already submitted
        List<ExamAttempt> attempts = examAttemptRepository.findByStudentId(studentId);
        List<Long> completedExamIds = attempts.stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED || a.getStatus() == AttemptStatus.AUTO_SUBMITTED || a.getStatus() == AttemptStatus.FLAGGED)
                .map(ExamAttempt::getExamId)
                .toList();

        return published.stream()
                .filter(exam -> (exam.getStartTime() == null || !now.isBefore(exam.getStartTime())) &&
                                (exam.getEndTime() == null || !now.isAfter(exam.getEndTime())))
                .filter(exam -> !completedExamIds.contains(exam.getId()))
                .map(exam -> {
                    int qCount = examQuestionRepository.findByExamIdOrderByQuestionOrderAsc(exam.getId()).size();
                    return ExamDto.builder()
                            .id(exam.getId())
                            .title(exam.getTitle())
                            .description(exam.getDescription())
                            .subject(exam.getSubject())
                            .durationMinutes(exam.getDurationMinutes())
                            .totalMarks(exam.getTotalMarks())
                            .negativeMarks(exam.getNegativeMarks())
                            .startTime(exam.getStartTime())
                            .endTime(exam.getEndTime())
                            .published(exam.isPublished())
                            .randomizeQuestions(exam.isRandomizeQuestions())
                            .randomizeOptions(exam.isRandomizeOptions())
                            .maxViolations(exam.getMaxViolations())
                            .questionCount(qCount)
                            .createdAt(exam.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ExamAttemptDto startExam(Long studentId, Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        if (!exam.isPublished()) {
            throw new BadRequestException("This exam is not published yet.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (exam.getStartTime() != null && now.isBefore(exam.getStartTime())) {
            throw new BadRequestException("Exam has not started yet. Starts at: " + exam.getStartTime());
        }
        if (exam.getEndTime() != null && now.isAfter(exam.getEndTime())) {
            throw new BadRequestException("Exam has expired. Ended at: " + exam.getEndTime());
        }

        Optional<ExamAttempt> existingOpt = examAttemptRepository.findByExamIdAndStudentId(examId, studentId);
        if (existingOpt.isPresent()) {
            ExamAttempt existing = existingOpt.get();
            if (existing.getStatus() == AttemptStatus.SUBMITTED || existing.getStatus() == AttemptStatus.AUTO_SUBMITTED) {
                throw new BadRequestException("You have already submitted this exam.");
            }
            return mapToAttemptDto(existing, exam);
        }

        // Build question sequence
        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamIdOrderByQuestionOrderAsc(examId);
        if (examQuestions.isEmpty()) {
            throw new BadRequestException("Exam has no questions assigned yet.");
        }

        List<Long> qIds = examQuestions.stream().map(ExamQuestion::getQuestionId).collect(Collectors.toList());
        if (exam.isRandomizeQuestions()) {
            Collections.shuffle(qIds, new Random(studentId * 31 + examId)); // Deterministic per student attempt
        }

        String sequenceStr = qIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        ExamAttempt attempt = ExamAttempt.builder()
                .examId(examId)
                .studentId(studentId)
                .startTime(now)
                .status(AttemptStatus.IN_PROGRESS)
                .violationCount(0)
                .riskScore(0)
                .score(0.0)
                .percentage(0.0)
                .questionSequence(sequenceStr)
                .build();

        ExamAttempt saved = examAttemptRepository.save(attempt);
        auditService.logAction(studentId, "START_EXAM", "Started exam: " + exam.getTitle() + " (Attempt ID: " + saved.getId() + ")", null, null);

        return mapToAttemptDto(saved, exam);
    }

    public ExamAttemptDto getAttempt(Long studentId, Long attemptId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        if (!attempt.getStudentId().equals(studentId)) {
            throw new BadRequestException("Unauthorized access to exam attempt.");
        }
        Exam exam = examRepository.findById(attempt.getExamId()).orElse(null);
        return mapToAttemptDto(attempt, exam);
    }

    public List<StudentQuestionDto> getAttemptQuestions(Long studentId, Long attemptId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        if (!attempt.getStudentId().equals(studentId)) {
            throw new BadRequestException("Unauthorized access to exam attempt.");
        }

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found."));

        checkAndUpdateTimerExpired(attempt, exam);

        List<Long> qIds = Arrays.stream(attempt.getQuestionSequence().split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        List<StudentAnswer> savedAnswers = studentAnswerRepository.findByAttemptId(attemptId);
        Map<Long, StudentAnswer> answerMap = savedAnswers.stream()
                .collect(Collectors.toMap(StudentAnswer::getQuestionId, a -> a, (k1, k2) -> k1));

        List<StudentQuestionDto> result = new ArrayList<>();
        int index = 1;
        for (Long qId : qIds) {
            Question q = questionRepository.findById(qId).orElse(null);
            if (q == null) continue;

            StudentAnswer savedAns = answerMap.get(qId);

            // Options map
            Map<String, String> options = new LinkedHashMap<>();
            options.put("A", q.getOptionA());
            options.put("B", q.getOptionB());
            options.put("C", q.getOptionC());
            options.put("D", q.getOptionD());

            // Build StudentQuestionDto WITHOUT correctAnswer field
            StudentQuestionDto dto = StudentQuestionDto.builder()
                    .id(q.getId())
                    .questionIndex(index++)
                    .questionText(q.getQuestionText())
                    .options(options)
                    .marks(q.getMarks())
                    .selectedAnswer(savedAns != null ? savedAns.getSelectedAnswer() : null)
                    .markedForReview(savedAns != null && savedAns.isMarkedForReview())
                    .build();

            result.add(dto);
        }

        return result;
    }

    @Transactional
    public void saveAnswer(Long studentId, Long attemptId, SubmitAnswerRequest request) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        if (!attempt.getStudentId().equals(studentId)) {
            throw new BadRequestException("Unauthorized access to exam attempt.");
        }

        if (attempt.getStatus() == AttemptStatus.SUBMITTED || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {
            throw new BadRequestException("Cannot modify answer. Exam is already submitted.");
        }

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found."));

        if (checkAndUpdateTimerExpired(attempt, exam)) {
            throw new BadRequestException("Time expired! Your exam has been automatically submitted.");
        }

        Optional<StudentAnswer> existingOpt = studentAnswerRepository.findByAttemptIdAndQuestionId(attemptId, request.getQuestionId());
        StudentAnswer answer = existingOpt.orElseGet(() -> StudentAnswer.builder()
                .attemptId(attemptId)
                .questionId(request.getQuestionId())
                .build());

        answer.setSelectedAnswer(request.getSelectedAnswer());
        answer.setMarkedForReview(request.isMarkedForReview());
        studentAnswerRepository.save(answer);
    }

    @Transactional
    public ResultDto submitExam(Long studentId, Long attemptId, String autoSubmitReason) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        if (studentId != null && !attempt.getStudentId().equals(studentId)) {
            throw new BadRequestException("Unauthorized access to exam attempt.");
        }

        // Idempotency: if already submitted, return calculated result directly
        if (attempt.getStatus() == AttemptStatus.SUBMITTED || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {
            return getStudentResult(attempt.getStudentId(), attemptId);
        }

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found."));

        LocalDateTime now = LocalDateTime.now();
        attempt.setSubmittedTime(now);

        if (autoSubmitReason != null && !autoSubmitReason.isEmpty()) {
            attempt.setStatus(AttemptStatus.AUTO_SUBMITTED);
            attempt.setAutoSubmittedReason(autoSubmitReason);
        } else {
            attempt.setStatus(AttemptStatus.SUBMITTED);
        }

        // Broadcast submission event to live monitoring
        try {
            MalpracticeEventDto submitEvent = new MalpracticeEventDto();
            submitEvent.setAttemptId(attemptId);
            submitEvent.setExamId(attempt.getExamId());
            submitEvent.setEventType(com.examguard.entity.enums.MalpracticeEventType.EXAM_SUBMITTED);
            submitEvent.setSeverity(com.examguard.entity.enums.Severity.LOW);
            submitEvent.setDescription("Student submitted the exam.");
            submitEvent.setTimestamp(LocalDateTime.now());
            messagingTemplate.convertAndSend("/topic/exam-monitoring", submitEvent);
        } catch (Exception e) {
            System.err.println("Failed to broadcast exam submit event: " + e.getMessage());
        }

        // Calculate Marks
        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByAttemptId(attemptId);
        Map<Long, StudentAnswer> answerMap = studentAnswers.stream()
                .collect(Collectors.toMap(StudentAnswer::getQuestionId, a -> a, (k1, k2) -> k1));

        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamIdOrderByQuestionOrderAsc(exam.getId());

        double totalScore = 0.0;
        double positiveMarks = 0.0;
        double negativeMarksTotal = 0.0;
        int correctCount = 0;
        int wrongCount = 0;
        int unansweredCount = 0;

        for (ExamQuestion eq : examQuestions) {
            Question q = questionRepository.findById(eq.getQuestionId()).orElse(null);
            if (q == null) continue;

            StudentAnswer ans = answerMap.get(q.getId());
            if (ans != null && ans.getSelectedAnswer() != null && !ans.getSelectedAnswer().trim().isEmpty()) {
                boolean isCorrect = q.getCorrectAnswer() != null && q.getCorrectAnswer().equalsIgnoreCase(ans.getSelectedAnswer().trim());
                ans.setIsCorrect(isCorrect);
                if (isCorrect) {
                    correctCount++;
                    double marks = q.getMarks() != null ? q.getMarks() : 1.0;
                    positiveMarks += marks;
                    ans.setMarksObtained(marks);
                    totalScore += marks;
                } else {
                    wrongCount++;
                    double neg = exam.getNegativeMarks() != null ? exam.getNegativeMarks() : 0.0;
                    negativeMarksTotal += neg;
                    ans.setMarksObtained(-neg);
                    totalScore -= neg;
                }
                studentAnswerRepository.save(ans);
            } else {
                unansweredCount++;
                if (ans != null) {
                    ans.setIsCorrect(false);
                    ans.setMarksObtained(0.0);
                    studentAnswerRepository.save(ans);
                }
            }
        }

        totalScore = Math.max(0.0, totalScore); // Avoid negative overall scores
        double totalExamMarks = exam.getTotalMarks() != null && exam.getTotalMarks() > 0 ? exam.getTotalMarks() : 1.0;
        double percentage = (totalScore / totalExamMarks) * 100.0;

        attempt.setScore(Math.round(totalScore * 100.0) / 100.0);
        attempt.setPercentage(Math.round(percentage * 100.0) / 100.0);

        if (attempt.getRiskScore() >= 50) {
            attempt.setStatus(AttemptStatus.FLAGGED);
        }

        examAttemptRepository.save(attempt);

        auditService.logAction(attempt.getStudentId(), "SUBMIT_EXAM", 
                "Exam submitted (Status: " + attempt.getStatus() + ", Score: " + attempt.getScore() + "/" + totalExamMarks + ")", null, null);

        return getStudentResult(attempt.getStudentId(), attemptId);
    }

    public ResultDto getStudentResult(Long studentId, Long attemptId) {
        ExamAttempt attempt = examAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        User student = userRepository.findById(attempt.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found."));

        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByAttemptId(attemptId);
        Map<Long, StudentAnswer> answerMap = studentAnswers.stream()
                .collect(Collectors.toMap(StudentAnswer::getQuestionId, a -> a, (k1, k2) -> k1));

        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamIdOrderByQuestionOrderAsc(exam.getId());

        int correctCount = 0;
        int wrongCount = 0;
        int unansweredCount = 0;
        double positiveMarks = 0.0;
        double negativeMarksTotal = 0.0;

        List<ResultDto.QuestionResultDetail> questionDetails = new ArrayList<>();

        for (ExamQuestion eq : examQuestions) {
            Question q = questionRepository.findById(eq.getQuestionId()).orElse(null);
            if (q == null) continue;

            StudentAnswer ans = answerMap.get(q.getId());
            String selected = ans != null ? ans.getSelectedAnswer() : null;
            Boolean isCorrect = ans != null ? (ans.getIsCorrect() != null ? ans.getIsCorrect() : false) : false;
            Double marksObtained = ans != null ? ans.getMarksObtained() : 0.0;

            if (selected != null && !selected.trim().isEmpty()) {
                if (Boolean.TRUE.equals(isCorrect)) {
                    correctCount++;
                    positiveMarks += (q.getMarks() != null ? q.getMarks() : 1.0);
                } else {
                    wrongCount++;
                    negativeMarksTotal += (exam.getNegativeMarks() != null ? exam.getNegativeMarks() : 0.0);
                }
            } else {
                unansweredCount++;
            }

            String selectedText = null;
            if (selected != null) {
                switch (selected) {
                    case "A": selectedText = q.getOptionA(); break;
                    case "B": selectedText = q.getOptionB(); break;
                    case "C": selectedText = q.getOptionC(); break;
                    case "D": selectedText = q.getOptionD(); break;
                }
            }
            
            String correctText = null;
            if (q.getCorrectAnswer() != null) {
                switch (q.getCorrectAnswer()) {
                    case "A": correctText = q.getOptionA(); break;
                    case "B": correctText = q.getOptionB(); break;
                    case "C": correctText = q.getOptionC(); break;
                    case "D": correctText = q.getOptionD(); break;
                }
            }

            questionDetails.add(ResultDto.QuestionResultDetail.builder()
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .selectedAnswer(selected)
                    .selectedAnswerText(selectedText)
                    .correctAnswer(q.getCorrectAnswer())
                    .correctAnswerText(correctText)
                    .isCorrect(isCorrect)
                    .marksObtained(marksObtained)
                    .maxMarks(q.getMarks())
                    .build());
        }

        String riskLevel = attempt.getRiskScore() <= 20 ? "LOW" : (attempt.getRiskScore() <= 50 ? "MEDIUM" : "HIGH");
        String resultStatus = attempt.getStatus() == AttemptStatus.FLAGGED ? "FLAGGED FOR REVIEW" : (attempt.getPercentage() >= 50.0 ? "PASS" : "FAIL");

        return ResultDto.builder()
                .attemptId(attempt.getId())
                .examId(exam.getId())
                .examTitle(exam.getTitle())
                .subject(exam.getSubject())
                .studentName(student.getName())
                .studentEmail(student.getEmail())
                .score(attempt.getScore())
                .totalMarks(exam.getTotalMarks())
                .percentage(attempt.getPercentage())
                .correctCount(correctCount)
                .wrongCount(wrongCount)
                .unansweredCount(unansweredCount)
                .positiveMarks(Math.round(positiveMarks * 100.0) / 100.0)
                .negativeMarks(Math.round(negativeMarksTotal * 100.0) / 100.0)
                .violationCount(attempt.getViolationCount())
                .riskScore(attempt.getRiskScore())
                .riskLevel(riskLevel)
                .status(attempt.getStatus())
                .resultStatus(resultStatus)
                .autoSubmittedReason(attempt.getAutoSubmittedReason())
                .submittedTime(attempt.getSubmittedTime())
                .questionDetails(questionDetails)
                .build();
    }

    public List<ExamAttemptDto> getStudentAttempts(Long studentId) {
        return examAttemptRepository.findByStudentId(studentId).stream()
                .map(attempt -> {
                    Exam exam = examRepository.findById(attempt.getExamId()).orElse(null);
                    return mapToAttemptDto(attempt, exam);
                })
                .collect(Collectors.toList());
    }

    // --- Private Helper Methods ---

    private boolean checkAndUpdateTimerExpired(ExamAttempt attempt, Exam exam) {
        if (attempt.getStatus() == AttemptStatus.SUBMITTED || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {
            return false;
        }

        long durationSec = (long) exam.getDurationMinutes() * 60;
        long elapsedSec = Duration.between(attempt.getStartTime(), LocalDateTime.now()).getSeconds();

        if (elapsedSec >= durationSec) {
            submitExam(null, attempt.getId(), "AUTOMATIC SUBMISSION: Server examination timer expired.");
            return true;
        }
        return false;
    }

    private ExamAttemptDto mapToAttemptDto(ExamAttempt attempt, Exam exam) {
        User student = userRepository.findById(attempt.getStudentId()).orElse(null);

        long durationSec = exam != null ? (long) exam.getDurationMinutes() * 60 : 0;
        long elapsedSec = Duration.between(attempt.getStartTime(), LocalDateTime.now()).getSeconds();
        long remainingSec = Math.max(0, durationSec - elapsedSec);

        String riskLevel = attempt.getRiskScore() <= 20 ? "LOW" : (attempt.getRiskScore() <= 50 ? "MEDIUM" : "HIGH");

        return ExamAttemptDto.builder()
                .id(attempt.getId())
                .examId(attempt.getExamId())
                .examTitle(exam != null ? exam.getTitle() : "N/A")
                .subject(exam != null ? exam.getSubject() : "N/A")
                .studentId(attempt.getStudentId())
                .studentName(student != null ? student.getName() : "N/A")
                .studentEmail(student != null ? student.getEmail() : "N/A")
                .startTime(attempt.getStartTime())
                .endTime(attempt.getEndTime())
                .submittedTime(attempt.getSubmittedTime())
                .status(attempt.getStatus())
                .violationCount(attempt.getViolationCount())
                .maxViolations(exam != null && exam.getMaxViolations() != null ? exam.getMaxViolations() : 15)
                .riskScore(attempt.getRiskScore())
                .riskLevel(riskLevel)
                .score(attempt.getScore())
                .totalMarks(exam != null ? exam.getTotalMarks() : 0.0)
                .percentage(attempt.getPercentage())
                .remainingTimeSeconds(remainingSec)
                .autoSubmittedReason(attempt.getAutoSubmittedReason())
                .build();
    }
}
