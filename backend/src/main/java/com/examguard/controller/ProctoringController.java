package com.examguard.controller;

import com.examguard.dto.ExamAttemptDto;
import com.examguard.dto.MalpracticeEventDto;
import com.examguard.entity.ExamAttempt;
import com.examguard.entity.enums.AttemptStatus;
import com.examguard.repository.ExamAttemptRepository;
import com.examguard.repository.ExamRepository;
import com.examguard.repository.UserRepository;
import com.examguard.service.ProctoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping
public class ProctoringController {

    @Autowired
    private ProctoringService proctoringService;

    @Autowired
    private ExamAttemptRepository examAttemptRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/monitoring/events")
    public ResponseEntity<MalpracticeEventDto> recordEvent(@RequestBody MalpracticeEventDto dto) {
        MalpracticeEventDto result = proctoringService.recordMalpracticeEvent(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/admin/monitoring/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MalpracticeEventDto>> getAllEvents() {
        return ResponseEntity.ok(proctoringService.getAllEvents());
    }

    @GetMapping("/api/admin/monitoring/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExamAttemptDto>> getActiveAttempts() {
        List<ExamAttempt> active = examAttemptRepository.findByStatusIn(List.of(AttemptStatus.IN_PROGRESS));

        List<ExamAttemptDto> dtos = active.stream().map(attempt -> {
            var exam = examRepository.findById(attempt.getExamId()).orElse(null);
            var student = userRepository.findById(attempt.getStudentId()).orElse(null);

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
                    .maxViolations(exam != null ? exam.getMaxViolations() : 15)
                    .riskScore(attempt.getRiskScore())
                    .riskLevel(riskLevel)
                    .remainingTimeSeconds(remainingSec)
                    .autoSubmittedReason(attempt.getAutoSubmittedReason())
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
