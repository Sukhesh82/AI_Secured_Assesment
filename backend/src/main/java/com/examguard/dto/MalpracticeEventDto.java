package com.examguard.dto;

import com.examguard.entity.enums.MalpracticeEventType;
import com.examguard.entity.enums.Severity;


import java.time.LocalDateTime;

public class MalpracticeEventDto {
    private Long id;
    private Long attemptId;
    private Long examId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String examTitle;
    private MalpracticeEventType eventType;
    private Severity severity;
    private String description;
    private LocalDateTime timestamp;
    private String metadata;
    private Integer currentViolationCount;
    private Integer currentRiskScore;
    private String currentRiskLevel;

    public MalpracticeEventDto() {}

    public MalpracticeEventDto(Long id, Long attemptId, Long examId, Long studentId, String studentName, String studentEmail, String examTitle, MalpracticeEventType eventType, Severity severity, String description, LocalDateTime timestamp, String metadata, Integer currentViolationCount, Integer currentRiskScore, String currentRiskLevel) {
        this.id = id;
        this.attemptId = attemptId;
        this.examId = examId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.examTitle = examTitle;
        this.eventType = eventType;
        this.severity = severity;
        this.description = description;
        this.timestamp = timestamp;
        this.metadata = metadata;
        this.currentViolationCount = currentViolationCount;
        this.currentRiskScore = currentRiskScore;
        this.currentRiskLevel = currentRiskLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }
    public MalpracticeEventType getEventType() { return eventType; }
    public void setEventType(MalpracticeEventType eventType) { this.eventType = eventType; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public Integer getCurrentViolationCount() { return currentViolationCount; }
    public void setCurrentViolationCount(Integer currentViolationCount) { this.currentViolationCount = currentViolationCount; }
    public Integer getCurrentRiskScore() { return currentRiskScore; }
    public void setCurrentRiskScore(Integer currentRiskScore) { this.currentRiskScore = currentRiskScore; }
    public String getCurrentRiskLevel() { return currentRiskLevel; }
    public void setCurrentRiskLevel(String currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long attemptId;
        private Long examId;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String examTitle;
        private MalpracticeEventType eventType;
        private Severity severity;
        private String description;
        private LocalDateTime timestamp;
        private String metadata;
        private Integer currentViolationCount;
        private Integer currentRiskScore;
        private String currentRiskLevel;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder attemptId(Long attemptId) { this.attemptId = attemptId; return this; }
        public Builder examId(Long examId) { this.examId = examId; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder examTitle(String examTitle) { this.examTitle = examTitle; return this; }
        public Builder eventType(MalpracticeEventType eventType) { this.eventType = eventType; return this; }
        public Builder severity(Severity severity) { this.severity = severity; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public Builder metadata(String metadata) { this.metadata = metadata; return this; }
        public Builder currentViolationCount(Integer currentViolationCount) { this.currentViolationCount = currentViolationCount; return this; }
        public Builder currentRiskScore(Integer currentRiskScore) { this.currentRiskScore = currentRiskScore; return this; }
        public Builder currentRiskLevel(String currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; return this; }

        public MalpracticeEventDto build() {
            return new MalpracticeEventDto(id, attemptId, examId, studentId, studentName, studentEmail, examTitle, eventType, severity, description, timestamp, metadata, currentViolationCount, currentRiskScore, currentRiskLevel);
        }
    }
}
