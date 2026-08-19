package com.examguard.dto;

public class VideoFrameDto {
    private Long examId;
    private Long attemptId;
    private String studentName;
    private String studentEmail;
    private String frameData;
    private String status;
    private String timestamp;

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }
    
    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    
    public String getFrameData() { return frameData; }
    public void setFrameData(String frameData) { this.frameData = frameData; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
