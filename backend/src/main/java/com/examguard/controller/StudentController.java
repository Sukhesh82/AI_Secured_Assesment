package com.examguard.controller;

import com.examguard.dto.*;
import com.examguard.security.UserPrincipal;
import com.examguard.service.StudentExamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private StudentExamService studentExamService;

    @GetMapping("/exams")
    public ResponseEntity<List<ExamDto>> getAvailableExams(@AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.getAvailableExamsForStudent(student.getId()));
    }

    @PostMapping("/exams/{examId}/start")
    public ResponseEntity<ExamAttemptDto> startExam(@PathVariable Long examId, @AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.startExam(student.getId(), examId));
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<ExamAttemptDto> getAttempt(@PathVariable Long attemptId, @AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.getAttempt(student.getId(), attemptId));
    }

    @GetMapping("/attempts/{attemptId}/questions")
    public ResponseEntity<List<StudentQuestionDto>> getAttemptQuestions(@PathVariable Long attemptId, @AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.getAttemptQuestions(student.getId(), attemptId));
    }

    @PostMapping("/attempts/{attemptId}/answer")
    public ResponseEntity<Map<String, String>> saveAnswer(@PathVariable Long attemptId, @Valid @RequestBody SubmitAnswerRequest request, @AuthenticationPrincipal UserPrincipal student) {
        studentExamService.saveAnswer(student.getId(), attemptId, request);
        return ResponseEntity.ok(Map.of("message", "Answer saved successfully"));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<ResultDto> submitExam(@PathVariable Long attemptId, @RequestBody(required = false) Map<String, String> payload, @AuthenticationPrincipal UserPrincipal student) {
        String reason = payload != null ? payload.get("reason") : null;
        return ResponseEntity.ok(studentExamService.submitExam(student.getId(), attemptId, reason));
    }

    @GetMapping("/attempts/{attemptId}/result")
    public ResponseEntity<ResultDto> getResult(@PathVariable Long attemptId, @AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.getStudentResult(student.getId(), attemptId));
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<List<ExamAttemptDto>> getMyAttempts(@AuthenticationPrincipal UserPrincipal student) {
        return ResponseEntity.ok(studentExamService.getStudentAttempts(student.getId()));
    }
}
