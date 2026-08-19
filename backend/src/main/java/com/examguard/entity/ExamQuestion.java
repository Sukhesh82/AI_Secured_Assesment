package com.examguard.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_questions")
public class ExamQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "question_order")
    private Integer questionOrder;

    public ExamQuestion() {}

    public ExamQuestion(Long id, Long examId, Long questionId, Integer questionOrder) {
        this.id = id;
        this.examId = examId;
        this.questionId = questionId;
        this.questionOrder = questionOrder;
    }

    public static ExamQuestionBuilder builder() { return new ExamQuestionBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

    public static class ExamQuestionBuilder {
        private Long id;
        private Long examId;
        private Long questionId;
        private Integer questionOrder;

        public ExamQuestionBuilder id(Long id) { this.id = id; return this; }
        public ExamQuestionBuilder examId(Long examId) { this.examId = examId; return this; }
        public ExamQuestionBuilder questionId(Long questionId) { this.questionId = questionId; return this; }
        public ExamQuestionBuilder questionOrder(Integer questionOrder) { this.questionOrder = questionOrder; return this; }

        public ExamQuestion build() {
            return new ExamQuestion(id, examId, questionId, questionOrder);
        }
    }
}
