package com.examguard.dto;

import com.examguard.entity.enums.AttemptStatus;


import java.time.LocalDateTime;

public class ExamAttemptDto {
    private Long id;
    private Long examId;
    private String examTitle;
    private String subject;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime submittedTime;
    private AttemptStatus status;
    private Integer violationCount;
    private Integer maxViolations;
    private Integer riskScore;
    private String riskLevel;
    private Double score;
    private Double totalMarks;
    private Double percentage;
    private Long remainingTimeSeconds;
    private String autoSubmittedReason;

    public ExamAttemptDto() {}

    public ExamAttemptDto(Long id, Long examId, String examTitle, String subject, Long studentId, String studentName, String studentEmail, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime submittedTime, AttemptStatus status, Integer violationCount, Integer maxViolations, Integer riskScore, String riskLevel, Double score, Double totalMarks, Double percentage, Long remainingTimeSeconds, String autoSubmittedReason) {
        this.id = id;
        this.examId = examId;
        this.examTitle = examTitle;
        this.subject = subject;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.startTime = startTime;
        this.endTime = endTime;
        this.submittedTime = submittedTime;
        this.status = status;
        this.violationCount = violationCount;
        this.maxViolations = maxViolations;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.remainingTimeSeconds = remainingTimeSeconds;
        this.autoSubmittedReason = autoSubmittedReason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }
    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
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
    public Integer getMaxViolations() { return maxViolations; }
    public void setMaxViolations(Integer maxViolations) { this.maxViolations = maxViolations; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    public Long getRemainingTimeSeconds() { return remainingTimeSeconds; }
    public void setRemainingTimeSeconds(Long remainingTimeSeconds) { this.remainingTimeSeconds = remainingTimeSeconds; }
    public String getAutoSubmittedReason() { return autoSubmittedReason; }
    public void setAutoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long examId;
        private String examTitle;
        private String subject;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private LocalDateTime submittedTime;
        private AttemptStatus status;
        private Integer violationCount;
        private Integer maxViolations;
        private Integer riskScore;
        private String riskLevel;
        private Double score;
        private Double totalMarks;
        private Double percentage;
        private Long remainingTimeSeconds;
        private String autoSubmittedReason;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder examId(Long examId) { this.examId = examId; return this; }
        public Builder examTitle(String examTitle) { this.examTitle = examTitle; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public Builder submittedTime(LocalDateTime submittedTime) { this.submittedTime = submittedTime; return this; }
        public Builder status(AttemptStatus status) { this.status = status; return this; }
        public Builder violationCount(Integer violationCount) { this.violationCount = violationCount; return this; }
        public Builder maxViolations(Integer maxViolations) { this.maxViolations = maxViolations; return this; }
        public Builder riskScore(Integer riskScore) { this.riskScore = riskScore; return this; }
        public Builder riskLevel(String riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder score(Double score) { this.score = score; return this; }
        public Builder totalMarks(Double totalMarks) { this.totalMarks = totalMarks; return this; }
        public Builder percentage(Double percentage) { this.percentage = percentage; return this; }
        public Builder remainingTimeSeconds(Long remainingTimeSeconds) { this.remainingTimeSeconds = remainingTimeSeconds; return this; }
        public Builder autoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; return this; }

        public ExamAttemptDto build() {
            return new ExamAttemptDto(id, examId, examTitle, subject, studentId, studentName, studentEmail, startTime, endTime, submittedTime, status, violationCount, maxViolations, riskScore, riskLevel, score, totalMarks, percentage, remainingTimeSeconds, autoSubmittedReason);
        }
    }
}
