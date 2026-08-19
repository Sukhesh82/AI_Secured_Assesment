package com.examguard.service;

import com.examguard.dto.MalpracticeEventDto;
import com.examguard.entity.Exam;
import com.examguard.entity.ExamAttempt;
import com.examguard.entity.MalpracticeEvent;
import com.examguard.entity.User;
import com.examguard.entity.enums.AttemptStatus;
import com.examguard.entity.enums.MalpracticeEventType;
import com.examguard.entity.enums.Severity;
import com.examguard.exception.ResourceNotFoundException;
import com.examguard.repository.ExamAttemptRepository;
import com.examguard.repository.ExamRepository;
import com.examguard.repository.MalpracticeEventRepository;
import com.examguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProctoringService {

    @Autowired
    private MalpracticeEventRepository malpracticeEventRepository;

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentExamService studentExamService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AuditService auditService;

    @Transactional
    public MalpracticeEventDto recordMalpracticeEvent(MalpracticeEventDto dto) {
        ExamAttempt attempt = examAttemptRepository.findById(dto.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + dto.getAttemptId()));

        if (attempt.getStatus() == AttemptStatus.SUBMITTED || attempt.getStatus() == AttemptStatus.AUTO_SUBMITTED) {
            // Attempt already closed
            return dto;
        }

        User student = userRepository.findById(attempt.getStudentId()).orElse(null);
        Exam exam = examRepository.findById(attempt.getExamId()).orElse(null);

        // Determine severity and risk delta
        int riskDelta = getRiskDelta(dto.getEventType());
        Severity severity = dto.getSeverity() != null ? dto.getSeverity() : getSeverityForType(dto.getEventType());

        // Increment violation count for serious violations
        boolean countAsViolation = isCountableViolation(dto.getEventType());
        if (countAsViolation) {
            attempt.setViolationCount(attempt.getViolationCount() + 1);
        }

        attempt.setRiskScore(attempt.getRiskScore() + riskDelta);

        // Check violation threshold auto-submit rule
        int maxViolations = exam != null && exam.getMaxViolations() != null ? exam.getMaxViolations() : 15;
        boolean thresholdReached = attempt.getViolationCount() >= maxViolations;


        examAttemptRepository.save(attempt);

        // Save Malpractice Event
        MalpracticeEvent event = MalpracticeEvent.builder()
                .attemptId(attempt.getId())
                .studentId(attempt.getStudentId())
                .eventType(dto.getEventType())
                .severity(severity)
                .description(dto.getDescription() != null ? dto.getDescription() : "Recorded malpractice event: " + dto.getEventType())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .metadata(dto.getMetadata())
                .build();

        MalpracticeEvent savedEvent = malpracticeEventRepository.save(event);

        auditService.logAction(attempt.getStudentId(), "MALPRACTICE_EVENT_" + dto.getEventType(),
                "Event: " + dto.getEventType() + " recorded (Violation Count: " + attempt.getViolationCount() + "/" + maxViolations + ", Risk Score: " + attempt.getRiskScore() + ")", null, null);

        // Trigger auto submit evaluation if threshold reached
        if (thresholdReached) {
            studentExamService.submitExam(null, attempt.getId(), "AUTOMATIC SUBMISSION: Configured violation threshold of " + maxViolations + " reached.");
        }

        String currentRiskLevel = attempt.getRiskScore() <= 20 ? "LOW" : (attempt.getRiskScore() <= 50 ? "MEDIUM" : "HIGH");

        MalpracticeEventDto responseDto = MalpracticeEventDto.builder()
                .id(savedEvent.getId())
                .attemptId(attempt.getId())
                .examId(attempt.getExamId())
                .studentId(attempt.getStudentId())
                .studentName(student != null ? student.getName() : "Student #" + attempt.getStudentId())
                .studentEmail(student != null ? student.getEmail() : "N/A")
                .examTitle(exam != null ? exam.getTitle() : "N/A")
                .eventType(savedEvent.getEventType())
                .severity(savedEvent.getSeverity())
                .description(savedEvent.getDescription())
                .timestamp(savedEvent.getTimestamp())
                .metadata(savedEvent.getMetadata())
                .currentViolationCount(attempt.getViolationCount())
                .currentRiskScore(attempt.getRiskScore())
                .currentRiskLevel(currentRiskLevel)
                .build();

        // Broadcast to WebSocket subscribers for live admin monitoring
        try {
            messagingTemplate.convertAndSend("/topic/exam-monitoring", responseDto);
            messagingTemplate.convertAndSend("/topic/exam/" + attempt.getId(), responseDto);
        } catch (Exception e) {
            // Silently swallow WebSocket send errors if client disconnected
        }

        return responseDto;
    }

    public List<MalpracticeEventDto> getAllEvents() {
        return malpracticeEventRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MalpracticeEventDto> getEventsByAttempt(Long attemptId) {
        return malpracticeEventRepository.findByAttemptIdOrderByTimestampDesc(attemptId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private int getRiskDelta(MalpracticeEventType type) {
        if (type == null) return 5;
        return switch (type) {
            case TAB_SWITCH -> 10;
            case FULLSCREEN_EXIT -> 10;
            case WINDOW_BLUR -> 5;
            case COPY_ATTEMPT -> 10;
            case PASTE_ATTEMPT -> 10;
            case MULTIPLE_LOGIN -> 30;
            case FACE_NOT_DETECTED -> 20;
            case MULTIPLE_FACES -> 30;
            case RIGHT_CLICK -> 5;
            default -> 5;
        };
    }

    private Severity getSeverityForType(MalpracticeEventType type) {
        if (type == null) return Severity.LOW;
        return switch (type) {
            case MULTIPLE_LOGIN, MULTIPLE_FACES -> Severity.HIGH;
            case TAB_SWITCH, FULLSCREEN_EXIT, COPY_ATTEMPT, PASTE_ATTEMPT, FACE_NOT_DETECTED -> Severity.MEDIUM;
            default -> Severity.LOW;
        };
    }

    private boolean isCountableViolation(MalpracticeEventType type) {
        if (type == null) return false;
        return type == MalpracticeEventType.TAB_SWITCH ||
               type == MalpracticeEventType.FULLSCREEN_EXIT ||
               type == MalpracticeEventType.COPY_ATTEMPT ||
               type == MalpracticeEventType.PASTE_ATTEMPT ||
               type == MalpracticeEventType.MULTIPLE_LOGIN ||
               type == MalpracticeEventType.FACE_NOT_DETECTED ||
               type == MalpracticeEventType.MULTIPLE_FACES;
    }

    private MalpracticeEventDto mapToDto(MalpracticeEvent event) {
        ExamAttempt attempt = examAttemptRepository.findById(event.getAttemptId()).orElse(null);
        User student = userRepository.findById(event.getStudentId()).orElse(null);
        Exam exam = attempt != null ? examRepository.findById(attempt.getExamId()).orElse(null) : null;

        String riskLevel = attempt != null ? (attempt.getRiskScore() <= 20 ? "LOW" : (attempt.getRiskScore() <= 50 ? "MEDIUM" : "HIGH")) : "LOW";

        return MalpracticeEventDto.builder()
                .id(event.getId())
                .attemptId(event.getAttemptId())
                .studentId(event.getStudentId())
                .studentName(student != null ? student.getName() : "Student #" + event.getStudentId())
                .studentEmail(student != null ? student.getEmail() : "N/A")
                .examTitle(exam != null ? exam.getTitle() : "N/A")
                .eventType(event.getEventType())
                .severity(event.getSeverity())
                .description(event.getDescription())
                .timestamp(event.getTimestamp())
                .metadata(event.getMetadata())
                .currentViolationCount(attempt != null ? attempt.getViolationCount() : 0)
                .currentRiskScore(attempt != null ? attempt.getRiskScore() : 0)
                .currentRiskLevel(riskLevel)
                .build();
    }
}
