package com.examguard.dto;



import java.time.LocalDateTime;

public class ExamDto {
    private Long id;
    private String title;
    private String description;
    private String subject;
    private Integer durationMinutes;
    private Double totalMarks;
    private Double negativeMarks;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean published;
    private boolean randomizeQuestions;
    private boolean randomizeOptions;
    private Integer maxViolations;
    private Integer questionCount;
    private LocalDateTime createdAt;

    public ExamDto() {}

    public ExamDto(Long id, String title, String description, String subject, Integer durationMinutes, Double totalMarks, Double negativeMarks, LocalDateTime startTime, LocalDateTime endTime, boolean published, boolean randomizeQuestions, boolean randomizeOptions, Integer maxViolations, Integer questionCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.negativeMarks = negativeMarks;
        this.startTime = startTime;
        this.endTime = endTime;
        this.published = published;
        this.randomizeQuestions = randomizeQuestions;
        this.randomizeOptions = randomizeOptions;
        this.maxViolations = maxViolations;
        this.questionCount = questionCount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Double getNegativeMarks() { return negativeMarks; }
    public void setNegativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public boolean isRandomizeQuestions() { return randomizeQuestions; }
    public void setRandomizeQuestions(boolean randomizeQuestions) { this.randomizeQuestions = randomizeQuestions; }

    public boolean isRandomizeOptions() { return randomizeOptions; }
    public void setRandomizeOptions(boolean randomizeOptions) { this.randomizeOptions = randomizeOptions; }

    public Integer getMaxViolations() { return maxViolations; }
    public void setMaxViolations(Integer maxViolations) { this.maxViolations = maxViolations; }

    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private String subject;
        private Integer durationMinutes;
        private Double totalMarks;
        private Double negativeMarks;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private boolean published;
        private boolean randomizeQuestions;
        private boolean randomizeOptions;
        private Integer maxViolations;
        private Integer questionCount;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder totalMarks(Double totalMarks) { this.totalMarks = totalMarks; return this; }
        public Builder negativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; return this; }
        public Builder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public Builder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public Builder published(boolean published) { this.published = published; return this; }
        public Builder randomizeQuestions(boolean randomizeQuestions) { this.randomizeQuestions = randomizeQuestions; return this; }
        public Builder randomizeOptions(boolean randomizeOptions) { this.randomizeOptions = randomizeOptions; return this; }
        public Builder maxViolations(Integer maxViolations) { this.maxViolations = maxViolations; return this; }
        public Builder questionCount(Integer questionCount) { this.questionCount = questionCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ExamDto build() {
            return new ExamDto(id, title, description, subject, durationMinutes, totalMarks, negativeMarks, startTime, endTime, published, randomizeQuestions, randomizeOptions, maxViolations, questionCount, createdAt);
        }
    }
}
