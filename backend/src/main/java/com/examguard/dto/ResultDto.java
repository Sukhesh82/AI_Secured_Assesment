package com.examguard.dto;

import com.examguard.entity.enums.AttemptStatus;


import java.time.LocalDateTime;
import java.util.List;

public class ResultDto {
    private Long attemptId;
    private Long examId;
    private String examTitle;
    private String subject;
    private String studentName;
    private String studentEmail;
    private Double score;
    private Double totalMarks;
    private Double percentage;
    private Integer correctCount;
    private Integer wrongCount;
    private Integer unansweredCount;
    private Double positiveMarks;
    private Double negativeMarks;
    private Integer violationCount;
    private Integer riskScore;
    private String riskLevel;
    private AttemptStatus status;
    private String resultStatus;
    private String autoSubmittedReason;
    private LocalDateTime submittedTime;
    private List<QuestionResultDetail> questionDetails;

    public ResultDto() {}

    public ResultDto(Long attemptId, Long examId, String examTitle, String subject, String studentName, String studentEmail, Double score, Double totalMarks, Double percentage, Integer correctCount, Integer wrongCount, Integer unansweredCount, Double positiveMarks, Double negativeMarks, Integer violationCount, Integer riskScore, String riskLevel, AttemptStatus status, String resultStatus, String autoSubmittedReason, LocalDateTime submittedTime, List<QuestionResultDetail> questionDetails) {
        this.attemptId = attemptId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.subject = subject;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.correctCount = correctCount;
        this.wrongCount = wrongCount;
        this.unansweredCount = unansweredCount;
        this.positiveMarks = positiveMarks;
        this.negativeMarks = negativeMarks;
        this.violationCount = violationCount;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.status = status;
        this.resultStatus = resultStatus;
        this.autoSubmittedReason = autoSubmittedReason;
        this.submittedTime = submittedTime;
        this.questionDetails = questionDetails;
    }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }
    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }
    public Integer getWrongCount() { return wrongCount; }
    public void setWrongCount(Integer wrongCount) { this.wrongCount = wrongCount; }
    public Integer getUnansweredCount() { return unansweredCount; }
    public void setUnansweredCount(Integer unansweredCount) { this.unansweredCount = unansweredCount; }
    public Double getPositiveMarks() { return positiveMarks; }
    public void setPositiveMarks(Double positiveMarks) { this.positiveMarks = positiveMarks; }
    public Double getNegativeMarks() { return negativeMarks; }
    public void setNegativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; }
    public Integer getViolationCount() { return violationCount; }
    public void setViolationCount(Integer violationCount) { this.violationCount = violationCount; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public AttemptStatus getStatus() { return status; }
    public void setStatus(AttemptStatus status) { this.status = status; }
    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }
    public String getAutoSubmittedReason() { return autoSubmittedReason; }
    public void setAutoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; }
    public LocalDateTime getSubmittedTime() { return submittedTime; }
    public void setSubmittedTime(LocalDateTime submittedTime) { this.submittedTime = submittedTime; }
    public List<QuestionResultDetail> getQuestionDetails() { return questionDetails; }
    public void setQuestionDetails(List<QuestionResultDetail> questionDetails) { this.questionDetails = questionDetails; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long attemptId;
        private Long examId;
        private String examTitle;
        private String subject;
        private String studentName;
        private String studentEmail;
        private Double score;
        private Double totalMarks;
        private Double percentage;
        private Integer correctCount;
        private Integer wrongCount;
        private Integer unansweredCount;
        private Double positiveMarks;
        private Double negativeMarks;
        private Integer violationCount;
        private Integer riskScore;
        private String riskLevel;
        private AttemptStatus status;
        private String resultStatus;
        private String autoSubmittedReason;
        private LocalDateTime submittedTime;
        private List<QuestionResultDetail> questionDetails;

        public Builder attemptId(Long attemptId) { this.attemptId = attemptId; return this; }
        public Builder examId(Long examId) { this.examId = examId; return this; }
        public Builder examTitle(String examTitle) { this.examTitle = examTitle; return this; }
        public Builder subject(String subject) { this.subject = subject; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder score(Double score) { this.score = score; return this; }
        public Builder totalMarks(Double totalMarks) { this.totalMarks = totalMarks; return this; }
        public Builder percentage(Double percentage) { this.percentage = percentage; return this; }
        public Builder correctCount(Integer correctCount) { this.correctCount = correctCount; return this; }
        public Builder wrongCount(Integer wrongCount) { this.wrongCount = wrongCount; return this; }
        public Builder unansweredCount(Integer unansweredCount) { this.unansweredCount = unansweredCount; return this; }
        public Builder positiveMarks(Double positiveMarks) { this.positiveMarks = positiveMarks; return this; }
        public Builder negativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; return this; }
        public Builder violationCount(Integer violationCount) { this.violationCount = violationCount; return this; }
        public Builder riskScore(Integer riskScore) { this.riskScore = riskScore; return this; }
        public Builder riskLevel(String riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder status(AttemptStatus status) { this.status = status; return this; }
        public Builder resultStatus(String resultStatus) { this.resultStatus = resultStatus; return this; }
        public Builder autoSubmittedReason(String autoSubmittedReason) { this.autoSubmittedReason = autoSubmittedReason; return this; }
        public Builder submittedTime(LocalDateTime submittedTime) { this.submittedTime = submittedTime; return this; }
        public Builder questionDetails(List<QuestionResultDetail> questionDetails) { this.questionDetails = questionDetails; return this; }

        public ResultDto build() {
            return new ResultDto(attemptId, examId, examTitle, subject, studentName, studentEmail, score, totalMarks, percentage, correctCount, wrongCount, unansweredCount, positiveMarks, negativeMarks, violationCount, riskScore, riskLevel, status, resultStatus, autoSubmittedReason, submittedTime, questionDetails);
        }
    }

    public static class QuestionResultDetail {
        private Long questionId;
        private String questionText;
        private String selectedAnswer;
        private String selectedAnswerText;
        private String correctAnswer;
        private String correctAnswerText;
        private Boolean isCorrect;
        private Double marksObtained;
        private Double maxMarks;

        public QuestionResultDetail() {}

        public QuestionResultDetail(Long questionId, String questionText, String selectedAnswer, String selectedAnswerText, String correctAnswer, String correctAnswerText, Boolean isCorrect, Double marksObtained, Double maxMarks) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.selectedAnswer = selectedAnswer;
            this.selectedAnswerText = selectedAnswerText;
            this.correctAnswer = correctAnswer;
            this.correctAnswerText = correctAnswerText;
            this.isCorrect = isCorrect;
            this.marksObtained = marksObtained;
            this.maxMarks = maxMarks;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public String getSelectedAnswer() { return selectedAnswer; }
        public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }
        public String getSelectedAnswerText() { return selectedAnswerText; }
        public void setSelectedAnswerText(String selectedAnswerText) { this.selectedAnswerText = selectedAnswerText; }
        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
        public String getCorrectAnswerText() { return correctAnswerText; }
        public void setCorrectAnswerText(String correctAnswerText) { this.correctAnswerText = correctAnswerText; }
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        public Double getMarksObtained() { return marksObtained; }
        public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }
        public Double getMaxMarks() { return maxMarks; }
        public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long questionId;
            private String questionText;
            private String selectedAnswer;
            private String selectedAnswerText;
            private String correctAnswer;
            private String correctAnswerText;
            private Boolean isCorrect;
            private Double marksObtained;
            private Double maxMarks;

            public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
            public Builder questionText(String questionText) { this.questionText = questionText; return this; }
            public Builder selectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; return this; }
            public Builder selectedAnswerText(String selectedAnswerText) { this.selectedAnswerText = selectedAnswerText; return this; }
            public Builder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
            public Builder correctAnswerText(String correctAnswerText) { this.correctAnswerText = correctAnswerText; return this; }
            public Builder isCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; return this; }
            public Builder marksObtained(Double marksObtained) { this.marksObtained = marksObtained; return this; }
            public Builder maxMarks(Double maxMarks) { this.maxMarks = maxMarks; return this; }

            public QuestionResultDetail build() {
                return new QuestionResultDetail(questionId, questionText, selectedAnswer, selectedAnswerText, correctAnswer, correctAnswerText, isCorrect, marksObtained, maxMarks);
            }
        }
    }
}
