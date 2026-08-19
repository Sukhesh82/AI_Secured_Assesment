package com.examguard.dto;

public class AnalyticsDto {
    private Long totalExams;
    private Long publishedExams;
    private Long totalStudents;
    private Long activeAttempts;
    private Long completedAttempts;
    private Double averageScore;
    private Double passPercentage;
    private Long totalMalpracticeEvents;
    private Long highRiskAttemptsCount;
    private Long mediumRiskAttemptsCount;
    private Long lowRiskAttemptsCount;

    public AnalyticsDto() {}

    public AnalyticsDto(Long totalExams, Long publishedExams, Long totalStudents, Long activeAttempts, Long completedAttempts, Double averageScore, Double passPercentage, Long totalMalpracticeEvents, Long highRiskAttemptsCount, Long mediumRiskAttemptsCount, Long lowRiskAttemptsCount) {
        this.totalExams = totalExams;
        this.publishedExams = publishedExams;
        this.totalStudents = totalStudents;
        this.activeAttempts = activeAttempts;
        this.completedAttempts = completedAttempts;
        this.averageScore = averageScore;
        this.passPercentage = passPercentage;
        this.totalMalpracticeEvents = totalMalpracticeEvents;
        this.highRiskAttemptsCount = highRiskAttemptsCount;
        this.mediumRiskAttemptsCount = mediumRiskAttemptsCount;
        this.lowRiskAttemptsCount = lowRiskAttemptsCount;
    }

    public static AnalyticsDtoBuilder builder() { return new AnalyticsDtoBuilder(); }

    public Long getTotalExams() { return totalExams; }
    public void setTotalExams(Long totalExams) { this.totalExams = totalExams; }

    public Long getPublishedExams() { return publishedExams; }
    public void setPublishedExams(Long publishedExams) { this.publishedExams = publishedExams; }

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getActiveAttempts() { return activeAttempts; }
    public void setActiveAttempts(Long activeAttempts) { this.activeAttempts = activeAttempts; }

    public Long getCompletedAttempts() { return completedAttempts; }
    public void setCompletedAttempts(Long completedAttempts) { this.completedAttempts = completedAttempts; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Double getPassPercentage() { return passPercentage; }
    public void setPassPercentage(Double passPercentage) { this.passPercentage = passPercentage; }

    public Long getTotalMalpracticeEvents() { return totalMalpracticeEvents; }
    public void setTotalMalpracticeEvents(Long totalMalpracticeEvents) { this.totalMalpracticeEvents = totalMalpracticeEvents; }

    public Long getHighRiskAttemptsCount() { return highRiskAttemptsCount; }
    public void setHighRiskAttemptsCount(Long highRiskAttemptsCount) { this.highRiskAttemptsCount = highRiskAttemptsCount; }

    public Long getMediumRiskAttemptsCount() { return mediumRiskAttemptsCount; }
    public void setMediumRiskAttemptsCount(Long mediumRiskAttemptsCount) { this.mediumRiskAttemptsCount = mediumRiskAttemptsCount; }

    public Long getLowRiskAttemptsCount() { return lowRiskAttemptsCount; }
    public void setLowRiskAttemptsCount(Long lowRiskAttemptsCount) { this.lowRiskAttemptsCount = lowRiskAttemptsCount; }

    public static class AnalyticsDtoBuilder {
        private Long totalExams;
        private Long publishedExams;
        private Long totalStudents;
        private Long activeAttempts;
        private Long completedAttempts;
        private Double averageScore;
        private Double passPercentage;
        private Long totalMalpracticeEvents;
        private Long highRiskAttemptsCount;
        private Long mediumRiskAttemptsCount;
        private Long lowRiskAttemptsCount;

        public AnalyticsDtoBuilder totalExams(Long totalExams) { this.totalExams = totalExams; return this; }
        public AnalyticsDtoBuilder publishedExams(Long publishedExams) { this.publishedExams = publishedExams; return this; }
        public AnalyticsDtoBuilder totalStudents(Long totalStudents) { this.totalStudents = totalStudents; return this; }
        public AnalyticsDtoBuilder activeAttempts(Long activeAttempts) { this.activeAttempts = activeAttempts; return this; }
        public AnalyticsDtoBuilder completedAttempts(Long completedAttempts) { this.completedAttempts = completedAttempts; return this; }
        public AnalyticsDtoBuilder averageScore(Double averageScore) { this.averageScore = averageScore; return this; }
        public AnalyticsDtoBuilder passPercentage(Double passPercentage) { this.passPercentage = passPercentage; return this; }
        public AnalyticsDtoBuilder totalMalpracticeEvents(Long totalMalpracticeEvents) { this.totalMalpracticeEvents = totalMalpracticeEvents; return this; }
        public AnalyticsDtoBuilder highRiskAttemptsCount(Long highRiskAttemptsCount) { this.highRiskAttemptsCount = highRiskAttemptsCount; return this; }
        public AnalyticsDtoBuilder mediumRiskAttemptsCount(Long mediumRiskAttemptsCount) { this.mediumRiskAttemptsCount = mediumRiskAttemptsCount; return this; }
        public AnalyticsDtoBuilder lowRiskAttemptsCount(Long lowRiskAttemptsCount) { this.lowRiskAttemptsCount = lowRiskAttemptsCount; return this; }

        public AnalyticsDto build() {
            return new AnalyticsDto(totalExams, publishedExams, totalStudents, activeAttempts, completedAttempts, averageScore, passPercentage, totalMalpracticeEvents, highRiskAttemptsCount, mediumRiskAttemptsCount, lowRiskAttemptsCount);
        }
    }
}
