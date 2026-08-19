package com.examguard.entity;

import com.examguard.entity.enums.AttemptStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_attempts")
public class ExamAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "submitted_time")
    private LocalDateTime submittedTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status = AttemptStatus.NOT_STARTED;

    @Column(name = "violation_count", nullable = false)
    private Integer violationCount = 0;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore = 0;

    @Column(name = "score")
    private Double score = 0.0;

    @Column(name = "percentage")
    private Double percentage = 0.0;

    @Column(name = "question_sequence", columnDefinition = "TEXT")
    private String questionSequence;

    @Column(name = "auto_submitted_reason")
    private String autoSubmittedReason;

    public ExamAttempt() {}

    public ExamAttempt(Long id, Long examId, Long studentId, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime submittedTime, AttemptStatus status, Integer violationCount, Integer riskScore, Double score, Double percentage, String questionSequence, String autoSubmittedReason) {
        this.id = id;
        this.examId = examId;
        this.studentId = studentId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.submittedTime = submittedTime;
        this.status = status != null ? status : AttemptStatus.NOT_STARTED;
        this.violationCount = violationCount != null ? violationCount : 0;
        this.riskScore = riskScore != null ? riskScore : 0;
        this.score = score != null ? score : 0.0;
        this.percentage = percentage != null ? percentage : 0.0;
        this.questionSequence = questionSequence;
        this.autoSubmittedReason = autoSubmittedReason;
    }

    public static ExamAttemptBuilder builder() { return new ExamAttemptBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDateTime getSubmittedTime() { return submittedTime; }
    public void setSubmittedTime(LocalDateTime submittedTime) { this.submittedTime = submittedTime; }

    public AttemptStatus getStatus() { return status; }
    public void setStatus(AttemptStatus status) { this.status = status; }

    public Integer getViolationCount() { return violationCount; }
    public void setViolationCount(Integer violationCount) { this.violationCount = violationCount; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public String getQuestionSequence() { return questionSequence; }
    public void setQuestionSequence(String questionSequence) { this.questionSequence = questionSequence; }

    public String getAutoSubmittedReason() { return autoSubmittedReason; }
    public void setAutoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; }

    public static class ExamAttemptBuilder {
        private Long id;
        private Long examId;
        private Long studentId;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private LocalDateTime submittedTime;
        private AttemptStatus status = AttemptStatus.NOT_STARTED;
        private Integer violationCount = 0;
        private Integer riskScore = 0;
        private Double score = 0.0;
        private Double percentage = 0.0;
        private String questionSequence;
        private String autoSubmittedReason;

        public ExamAttemptBuilder id(Long id) { this.id = id; return this; }
        public ExamAttemptBuilder examId(Long examId) { this.examId = examId; return this; }
        public ExamAttemptBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public ExamAttemptBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public ExamAttemptBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public ExamAttemptBuilder submittedTime(LocalDateTime submittedTime) { this.submittedTime = submittedTime; return this; }
        public ExamAttemptBuilder status(AttemptStatus status) { this.status = status; return this; }
        public ExamAttemptBuilder violationCount(Integer violationCount) { this.violationCount = violationCount; return this; }
        public ExamAttemptBuilder riskScore(Integer riskScore) { this.riskScore = riskScore; return this; }
        public ExamAttemptBuilder score(Double score) { this.score = score; return this; }
        public ExamAttemptBuilder percentage(Double percentage) { this.percentage = percentage; return this; }
        public ExamAttemptBuilder questionSequence(String questionSequence) { this.questionSequence = questionSequence; return this; }
        public ExamAttemptBuilder autoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; return this; }

        public ExamAttempt build() {
            return new ExamAttempt(id, examId, studentId, startTime, endTime, submittedTime, status, violationCount, riskScore, score, percentage, questionSequence, autoSubmittedReason);
        }
    }
}
