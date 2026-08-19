package com.examguard.dto;

import jakarta.validation.constraints.NotNull;


public class SubmitAnswerRequest {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String selectedAnswer; // "A", "B", "C", "D" or null if cleared
    private boolean markedForReview;

    public SubmitAnswerRequest() {}

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getSelectedAnswer() { return selectedAnswer; }
    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }
    public boolean isMarkedForReview() { return markedForReview; }
    public void setMarkedForReview(boolean markedForReview) { this.markedForReview = markedForReview; }
}
