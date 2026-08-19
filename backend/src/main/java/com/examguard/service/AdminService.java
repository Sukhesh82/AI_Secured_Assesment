package com.examguard.service;

import com.examguard.dto.AnalyticsDto;
import com.examguard.dto.ExamDto;
import com.examguard.dto.QuestionDto;
import com.examguard.entity.Exam;
import com.examguard.entity.ExamQuestion;
import com.examguard.entity.Question;
import com.examguard.entity.enums.AttemptStatus;
import com.examguard.entity.enums.Role;
import com.examguard.exception.ResourceNotFoundException;
import com.examguard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MalpracticeEventRepository malpracticeEventRepository;

    @Autowired
    private AuditService auditService;

    // --- Exam Management ---

    public List<ExamDto> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::mapToExamDto)
                .collect(Collectors.toList());
    }

    public ExamDto getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        return mapToExamDto(exam);
    }

    @Transactional
    public ExamDto createExam(ExamDto dto, Long adminId) {
        Exam exam = Exam.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .subject(dto.getSubject())
                .durationMinutes(dto.getDurationMinutes())
                .totalMarks(dto.getTotalMarks())
                .negativeMarks(dto.getNegativeMarks() != null ? dto.getNegativeMarks() : 0.0)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .published(dto.isPublished())
                .randomizeQuestions(dto.isRandomizeQuestions())
                .randomizeOptions(dto.isRandomizeOptions())
                .maxViolations(dto.getMaxViolations() != null ? dto.getMaxViolations() : 15)
                .build();

        Exam savedExam = examRepository.save(exam);
        auditService.logAction(adminId, "CREATE_EXAM", "Created exam: " + savedExam.getTitle(), null, null);
        return mapToExamDto(savedExam);
    }

    @Transactional
    public ExamDto updateExam(Long id, ExamDto dto, Long adminId) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));

        exam.setTitle(dto.getTitle());
        exam.setDescription(dto.getDescription());
        exam.setSubject(dto.getSubject());
        exam.setDurationMinutes(dto.getDurationMinutes());
        exam.setTotalMarks(dto.getTotalMarks());
        exam.setNegativeMarks(dto.getNegativeMarks() != null ? dto.getNegativeMarks() : 0.0);
        exam.setStartTime(dto.getStartTime());
        exam.setEndTime(dto.getEndTime());
        exam.setPublished(dto.isPublished());
        exam.setRandomizeQuestions(dto.isRandomizeQuestions());
        exam.setRandomizeOptions(dto.isRandomizeOptions());
        if (dto.getMaxViolations() != null) {
            exam.setMaxViolations(dto.getMaxViolations());
        }

        Exam updatedExam = examRepository.save(exam);
        auditService.logAction(adminId, "UPDATE_EXAM", "Updated exam ID: " + id, null, null);
        return mapToExamDto(updatedExam);
    }

    @Transactional
    public ExamDto togglePublishExam(Long id, boolean published, Long adminId) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        exam.setPublished(published);
        Exam updatedExam = examRepository.save(exam);
        auditService.logAction(adminId, published ? "PUBLISH_EXAM" : "UNPUBLISH_EXAM", "Toggled published to " + published + " for exam ID: " + id, null, null);
        return mapToExamDto(updatedExam);
    }

    @Transactional
    public void deleteExam(Long id, Long adminId) {
        if (!examRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exam not found with id: " + id);
        }
        examQuestionRepository.deleteByExamId(id);
        examRepository.deleteById(id);
        auditService.logAction(adminId, "DELETE_EXAM", "Deleted exam ID: " + id, null, null);
    }

    // --- Question Management ---

    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToQuestionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionDto createQuestion(QuestionDto dto, Long adminId) {
        Question question = Question.builder()
                .questionText(dto.getQuestionText())
                .optionA(dto.getOptionA())
                .optionB(dto.getOptionB())
                .optionC(dto.getOptionC())
                .optionD(dto.getOptionD())
                .correctAnswer(dto.getCorrectAnswer().toUpperCase().trim())
                .marks(dto.getMarks() != null ? dto.getMarks() : 1.0)
                .difficulty(dto.getDifficulty())
                .subject(dto.getSubject())
                .build();

        Question saved = questionRepository.save(question);
        auditService.logAction(adminId, "CREATE_QUESTION", "Created question ID: " + saved.getId(), null, null);
        return mapToQuestionDto(saved);
    }

    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionDto dto, Long adminId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        question.setQuestionText(dto.getQuestionText());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectAnswer(dto.getCorrectAnswer().toUpperCase().trim());
        question.setMarks(dto.getMarks());
        question.setDifficulty(dto.getDifficulty());
        question.setSubject(dto.getSubject());

        Question updated = questionRepository.save(question);
        auditService.logAction(adminId, "UPDATE_QUESTION", "Updated question ID: " + id, null, null);
        return mapToQuestionDto(updated);
    }

    @Transactional
    public void deleteQuestion(Long id, Long adminId) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
        auditService.logAction(adminId, "DELETE_QUESTION", "Deleted question ID: " + id, null, null);
    }

    // --- Exam Question Mapping ---

    public List<QuestionDto> getQuestionsForExam(Long examId) {
        List<ExamQuestion> mappings = examQuestionRepository.findByExamIdOrderByQuestionOrderAsc(examId);
        return mappings.stream()
                .map(eq -> questionRepository.findById(eq.getQuestionId()).orElse(null))
                .filter(q -> q != null)
                .map(this::mapToQuestionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void assignQuestionsToExam(Long examId, List<Long> questionIds, Long adminId) {
        if (!examRepository.existsById(examId)) {
            throw new ResourceNotFoundException("Exam not found with id: " + examId);
        }

        examQuestionRepository.deleteByExamId(examId);

        int order = 1;
        for (Long qId : questionIds) {
            if (questionRepository.existsById(qId)) {
                ExamQuestion eq = ExamQuestion.builder()
                        .examId(examId)
                        .questionId(qId)
                        .questionOrder(order++)
                        .build();
                examQuestionRepository.save(eq);
            }
        }
        auditService.logAction(adminId, "ASSIGN_EXAM_QUESTIONS", "Assigned " + questionIds.size() + " questions to exam ID: " + examId, null, null);
    }

    // --- Analytics ---

    public AnalyticsDto getAnalytics() {
        long totalExams = examRepository.count();
        long publishedExams = examRepository.findByPublishedTrue().size();
        long totalStudents = userRepository.findByRole(Role.STUDENT).size();

        var attempts = examAttemptRepository.findAll();
        long activeAttempts = attempts.stream().filter(a -> a.getStatus() == AttemptStatus.IN_PROGRESS).count();
        long completedAttempts = attempts.stream().filter(a -> a.getStatus() == AttemptStatus.SUBMITTED || a.getStatus() == AttemptStatus.AUTO_SUBMITTED).count();

        double avgScore = attempts.stream()
                .filter(a -> a.getScore() != null)
                .mapToDouble(a -> a.getScore())
                .average()
                .orElse(0.0);

        long passedCount = attempts.stream()
                .filter(a -> a.getPercentage() != null && a.getPercentage() >= 50.0)
                .count();

        double passPercentage = completedAttempts > 0 ? (double) passedCount / completedAttempts * 100.0 : 0.0;

        long totalEvents = malpracticeEventRepository.count();

        long highRiskCount = attempts.stream().filter(a -> a.getRiskScore() != null && a.getRiskScore() >= 51).count();
        long medRiskCount = attempts.stream().filter(a -> a.getRiskScore() != null && a.getRiskScore() >= 21 && a.getRiskScore() <= 50).count();
        long lowRiskCount = attempts.stream().filter(a -> a.getRiskScore() != null && a.getRiskScore() <= 20).count();

        return AnalyticsDto.builder()
                .totalExams(totalExams)
                .publishedExams(publishedExams)
                .totalStudents(totalStudents)
                .activeAttempts(activeAttempts)
                .completedAttempts(completedAttempts)
                .averageScore(Math.round(avgScore * 100.0) / 100.0)
                .passPercentage(Math.round(passPercentage * 100.0) / 100.0)
                .totalMalpracticeEvents(totalEvents)
                .highRiskAttemptsCount(highRiskCount)
                .mediumRiskAttemptsCount(medRiskCount)
                .lowRiskAttemptsCount(lowRiskCount)
                .build();
    }

    // --- Helper Mappers ---

    private ExamDto mapToExamDto(Exam exam) {
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
    }

    private QuestionDto mapToQuestionDto(Question q) {
        return QuestionDto.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .correctAnswer(q.getCorrectAnswer())
                .marks(q.getMarks())
                .difficulty(q.getDifficulty())
                .subject(q.getSubject())
                .build();
    }
}
