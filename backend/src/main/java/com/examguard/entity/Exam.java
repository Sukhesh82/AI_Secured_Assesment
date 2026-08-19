package com.examguard.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String subject;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks;

    @Column(name = "negative_marks", nullable = false)
    private Double negativeMarks = 0.0;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(nullable = false)
    private boolean published = false;

    @Column(name = "randomize_questions", nullable = false)
    private boolean randomizeQuestions = true;

    @Column(name = "randomize_options", nullable = false)
    private boolean randomizeOptions = true;

    @Column(name = "max_violations", nullable = false)
    private Integer maxViolations = 15;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Exam() {}

    public Exam(Long id, String title, String description, String subject, Integer durationMinutes, Double totalMarks, Double negativeMarks, LocalDateTime startTime, LocalDateTime endTime, boolean published, boolean randomizeQuestions, boolean randomizeOptions, Integer maxViolations, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.negativeMarks = negativeMarks != null ? negativeMarks : 0.0;
        this.startTime = startTime;
        this.endTime = endTime;
        this.published = published;
        this.randomizeQuestions = randomizeQuestions;
        this.randomizeOptions = randomizeOptions;
        this.maxViolations = maxViolations != null ? maxViolations : 15;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ExamBuilder builder() { return new ExamBuilder(); }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class ExamBuilder {
        private Long id;
        private String title;
        private String description;
        private String subject;
        private Integer durationMinutes;
        private Double totalMarks;
        private Double negativeMarks = 0.0;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private boolean published = false;
        private boolean randomizeQuestions = true;
        private boolean randomizeOptions = true;
        private Integer maxViolations = 15;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ExamBuilder id(Long id) { this.id = id; return this; }
        public ExamBuilder title(String title) { this.title = title; return this; }
        public ExamBuilder description(String description) { this.description = description; return this; }
        public ExamBuilder subject(String subject) { this.subject = subject; return this; }
        public ExamBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public ExamBuilder totalMarks(Double totalMarks) { this.totalMarks = totalMarks; return this; }
        public ExamBuilder negativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; return this; }
        public ExamBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public ExamBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public ExamBuilder published(boolean published) { this.published = published; return this; }
        public ExamBuilder randomizeQuestions(boolean randomizeQuestions) { this.randomizeQuestions = randomizeQuestions; return this; }
        public ExamBuilder randomizeOptions(boolean randomizeOptions) { this.randomizeOptions = randomizeOptions; return this; }
        public ExamBuilder maxViolations(Integer maxViolations) { this.maxViolations = maxViolations; return this; }
        public ExamBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ExamBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Exam build() {
            return new Exam(id, title, description, subject, durationMinutes, totalMarks, negativeMarks, startTime, endTime, published, randomizeQuestions, randomizeOptions, maxViolations, createdAt, updatedAt);
        }
    }
}
