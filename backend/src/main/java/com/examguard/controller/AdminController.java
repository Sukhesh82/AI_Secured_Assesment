package com.examguard.controller;

import com.examguard.dto.AnalyticsDto;
import com.examguard.dto.ExamDto;
import com.examguard.dto.QuestionDto;
import com.examguard.entity.AuditLog;
import com.examguard.repository.AuditLogRepository;
import com.examguard.security.UserPrincipal;
import com.examguard.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    // --- Exams ---

    @GetMapping("/exams")
    public ResponseEntity<List<ExamDto>> getAllExams() {
        return ResponseEntity.ok(adminService.getAllExams());
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<ExamDto> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getExamById(id));
    }

    @PostMapping("/exams")
    public ResponseEntity<ExamDto> createExam(@Valid @RequestBody ExamDto dto, @AuthenticationPrincipal UserPrincipal admin) {
        return ResponseEntity.ok(adminService.createExam(dto, admin.getId()));
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<ExamDto> updateExam(@PathVariable Long id, @Valid @RequestBody ExamDto dto, @AuthenticationPrincipal UserPrincipal admin) {
        return ResponseEntity.ok(adminService.updateExam(id, dto, admin.getId()));
    }

    @PutMapping("/exams/{id}/publish")
    public ResponseEntity<ExamDto> togglePublish(@PathVariable Long id, @RequestBody Map<String, Boolean> payload, @AuthenticationPrincipal UserPrincipal admin) {
        boolean published = payload.getOrDefault("published", true);
        return ResponseEntity.ok(adminService.togglePublishExam(id, published, admin.getId()));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Map<String, String>> deleteExam(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal admin) {
        adminService.deleteExam(id, admin.getId());
        return ResponseEntity.ok(Map.of("message", "Exam deleted successfully"));
    }

    // --- Question Bank ---

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {
        return ResponseEntity.ok(adminService.getAllQuestions());
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionDto> createQuestion(@Valid @RequestBody QuestionDto dto, @AuthenticationPrincipal UserPrincipal admin) {
        return ResponseEntity.ok(adminService.createQuestion(dto, admin.getId()));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionDto dto, @AuthenticationPrincipal UserPrincipal admin) {
        return ResponseEntity.ok(adminService.updateQuestion(id, dto, admin.getId()));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Map<String, String>> deleteQuestion(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal admin) {
        adminService.deleteQuestion(id, admin.getId());
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }

    // --- Exam Question Assignment ---

    @GetMapping("/exams/{id}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsForExam(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getQuestionsForExam(id));
    }

    @PostMapping("/exams/{id}/questions")
    public ResponseEntity<Map<String, String>> assignQuestionsToExam(@PathVariable Long id, @RequestBody Map<String, List<Long>> payload, @AuthenticationPrincipal UserPrincipal admin) {
        List<Long> questionIds = payload.get("questionIds");
        adminService.assignQuestionsToExam(id, questionIds != null ? questionIds : List.of(), admin.getId());
        return ResponseEntity.ok(Map.of("message", "Exam questions assigned successfully"));
    }

    // --- Analytics & Audit ---

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @Autowired
    private com.examguard.repository.UserRepository userRepository;

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        logs.forEach(log -> {
            userRepository.findById(log.getUserId()).ifPresent(user -> log.setUsername(user.getName()));
        });
        return ResponseEntity.ok(logs);
    }
}
