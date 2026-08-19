package com.examguard.entity;

import com.examguard.entity.enums.Difficulty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "option_a", nullable = false, columnDefinition = "TEXT")
    private String optionA;

    @Column(name = "option_b", nullable = false, columnDefinition = "TEXT")
    private String optionB;

    @Column(name = "option_c", nullable = false, columnDefinition = "TEXT")
    private String optionC;

    @Column(name = "option_d", nullable = false, columnDefinition = "TEXT")
    private String optionD;

    @Column(name = "correct_answer", nullable = false, length = 5)
    private String correctAnswer;

    @Column(nullable = false)
    private Double marks = 1.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Column(nullable = false)
    private String subject;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Question() {}

    public Question(Long id, String questionText, String optionA, String optionB, String optionC, String optionD, String correctAnswer, Double marks, Difficulty difficulty, String subject, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.marks = marks != null ? marks : 1.0;
        this.difficulty = difficulty != null ? difficulty : Difficulty.MEDIUM;
        this.subject = subject;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static QuestionBuilder builder() { return new QuestionBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class QuestionBuilder {
        private Long id;
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private Double marks = 1.0;
        private Difficulty difficulty = Difficulty.MEDIUM;
        private String subject;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public QuestionBuilder id(Long id) { this.id = id; return this; }
        public QuestionBuilder questionText(String questionText) { this.questionText = questionText; return this; }
        public QuestionBuilder optionA(String optionA) { this.optionA = optionA; return this; }
        public QuestionBuilder optionB(String optionB) { this.optionB = optionB; return this; }
        public QuestionBuilder optionC(String optionC) { this.optionC = optionC; return this; }
        public QuestionBuilder optionD(String optionD) { this.optionD = optionD; return this; }
        public QuestionBuilder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
        public QuestionBuilder marks(Double marks) { this.marks = marks; return this; }
        public QuestionBuilder difficulty(Difficulty difficulty) { this.difficulty = difficulty; return this; }
        public QuestionBuilder subject(String subject) { this.subject = subject; return this; }
        public QuestionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public QuestionBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Question build() {
            return new Question(id, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, difficulty, subject, createdAt, updatedAt);
        }
    }
}
