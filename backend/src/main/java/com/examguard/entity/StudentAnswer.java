package com.examguard.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_answers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"attempt_id", "question_id"})
})
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_id", nullable = false)
    private Long attemptId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "selected_answer", length = 5)
    private String selectedAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "marks_obtained")
    private Double marksObtained = 0.0;

    @Column(name = "marked_for_review")
    private boolean markedForReview = false;

    @CreationTimestamp
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    public StudentAnswer() {}

    public StudentAnswer(Long id, Long attemptId, Long questionId, String selectedAnswer, Boolean isCorrect, Double marksObtained, boolean markedForReview, LocalDateTime answeredAt) {
        this.id = id;
        this.attemptId = attemptId;
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
        this.isCorrect = isCorrect;
        this.marksObtained = marksObtained != null ? marksObtained : 0.0;
        this.markedForReview = markedForReview;
        this.answeredAt = answeredAt;
    }

    public static StudentAnswerBuilder builder() { return new StudentAnswerBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getSelectedAnswer() { return selectedAnswer; }
    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public boolean isMarkedForReview() { return markedForReview; }
    public void setMarkedForReview(boolean markedForReview) { this.markedForReview = markedForReview; }

    public LocalDateTime getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }

    public static class StudentAnswerBuilder {
        private Long id;
        private Long attemptId;
        private Long questionId;
        private String selectedAnswer;
        private Boolean isCorrect;
        private Double marksObtained = 0.0;
        private boolean markedForReview = false;
        private LocalDateTime answeredAt;

        public StudentAnswerBuilder id(Long id) { this.id = id; return this; }
        public StudentAnswerBuilder attemptId(Long attemptId) { this.attemptId = attemptId; return this; }
        public StudentAnswerBuilder questionId(Long questionId) { this.questionId = questionId; return this; }
        public StudentAnswerBuilder selectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; return this; }
        public StudentAnswerBuilder isCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; return this; }
        public StudentAnswerBuilder marksObtained(Double marksObtained) { this.marksObtained = marksObtained; return this; }
        public StudentAnswerBuilder markedForReview(boolean markedForReview) { this.markedForReview = markedForReview; return this; }
        public StudentAnswerBuilder answeredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; return this; }

        public StudentAnswer build() {
            return new StudentAnswer(id, attemptId, questionId, selectedAnswer, isCorrect, marksObtained, markedForReview, answeredAt);
        }
    }
}
