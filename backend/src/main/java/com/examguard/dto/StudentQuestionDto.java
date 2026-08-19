package com.examguard.dto;



import java.util.Map;

public class StudentQuestionDto {
    private Long id;
    private Integer questionIndex; // 1-based index in student's randomized sequence
    private String questionText;
    private Map<String, String> options; // Key: "A", "B", "C", "D" -> Value: Option Text
    private Double marks;
    private String selectedAnswer; // Previously saved answer by student if any
    private boolean markedForReview;

    public StudentQuestionDto() {}

    public StudentQuestionDto(Long id, Integer questionIndex, String questionText, Map<String, String> options, Double marks, String selectedAnswer, boolean markedForReview) {
        this.id = id;
        this.questionIndex = questionIndex;
        this.questionText = questionText;
        this.options = options;
        this.marks = marks;
        this.selectedAnswer = selectedAnswer;
        this.markedForReview = markedForReview;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuestionIndex() { return questionIndex; }
    public void setQuestionIndex(Integer questionIndex) { this.questionIndex = questionIndex; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public Map<String, String> getOptions() { return options; }
    public void setOptions(Map<String, String> options) { this.options = options; }
    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
    public String getSelectedAnswer() { return selectedAnswer; }
    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }
    public boolean isMarkedForReview() { return markedForReview; }
    public void setMarkedForReview(boolean markedForReview) { this.markedForReview = markedForReview; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Integer questionIndex;
        private String questionText;
        private Map<String, String> options;
        private Double marks;
        private String selectedAnswer;
        private boolean markedForReview;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder questionIndex(Integer questionIndex) { this.questionIndex = questionIndex; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder options(Map<String, String> options) { this.options = options; return this; }
        public Builder marks(Double marks) { this.marks = marks; return this; }
        public Builder selectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; return this; }
        public Builder markedForReview(boolean markedForReview) { this.markedForReview = markedForReview; return this; }

        public StudentQuestionDto build() {
            return new StudentQuestionDto(id, questionIndex, questionText, options, marks, selectedAnswer, markedForReview);
        }
    }
}
