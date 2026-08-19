package com.examguard.dto;

import com.examguard.entity.enums.Difficulty;

public class QuestionDto {
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    private Double marks;
    private Difficulty difficulty;
    private String subject;

    public QuestionDto() {}

    public QuestionDto(Long id, String questionText, String optionA, String optionB, String optionC, String optionD, String correctAnswer, Double marks, Difficulty difficulty, String subject) {
        this.id = id;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.marks = marks;
        this.difficulty = difficulty;
        this.subject = subject;
    }

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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private Double marks;
        private Difficulty difficulty;
        private String subject;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder optionA(String optionA) { this.optionA = optionA; return this; }
        public Builder optionB(String optionB) { this.optionB = optionB; return this; }
        public Builder optionC(String optionC) { this.optionC = optionC; return this; }
        public Builder optionD(String optionD) { this.optionD = optionD; return this; }
        public Builder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
        public Builder marks(Double marks) { this.marks = marks; return this; }
        public Builder difficulty(Difficulty difficulty) { this.difficulty = difficulty; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }

        public QuestionDto build() {
            return new QuestionDto(id, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, difficulty, subject);
        }
    }
}
