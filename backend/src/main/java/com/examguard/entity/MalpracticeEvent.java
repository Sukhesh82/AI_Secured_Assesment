package com.examguard.entity;

import com.examguard.entity.enums.MalpracticeEventType;
import com.examguard.entity.enums.Severity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "malpractice_events")
public class MalpracticeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_id", nullable = false)
    private Long attemptId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private MalpracticeEventType eventType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    public MalpracticeEvent() {}

    public MalpracticeEvent(Long id, Long attemptId, Long studentId, MalpracticeEventType eventType, Severity severity, String description, LocalDateTime timestamp, String metadata) {
        this.id = id;
        this.attemptId = attemptId;
        this.studentId = studentId;
        this.eventType = eventType;
        this.severity = severity;
        this.description = description;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }

    public static MalpracticeEventBuilder builder() { return new MalpracticeEventBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

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

    public static class MalpracticeEventBuilder {
        private Long id;
        private Long attemptId;
        private Long studentId;
        private MalpracticeEventType eventType;
        private Severity severity;
        private String description;
        private LocalDateTime timestamp;
        private String metadata;

        public MalpracticeEventBuilder id(Long id) { this.id = id; return this; }
        public MalpracticeEventBuilder attemptId(Long attemptId) { this.attemptId = attemptId; return this; }
        public MalpracticeEventBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public MalpracticeEventBuilder eventType(MalpracticeEventType eventType) { this.eventType = eventType; return this; }
        public MalpracticeEventBuilder severity(Severity severity) { this.severity = severity; return this; }
        public MalpracticeEventBuilder description(String description) { this.description = description; return this; }
        public MalpracticeEventBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public MalpracticeEventBuilder metadata(String metadata) { this.metadata = metadata; return this; }

        public MalpracticeEvent build() {
            return new MalpracticeEvent(id, attemptId, studentId, eventType, severity, description, timestamp, metadata);
        }
    }
}
