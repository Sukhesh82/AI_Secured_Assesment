package com.examguard.controller;

import com.examguard.dto.MalpracticeEventDto;
import com.examguard.service.ProctoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketMalpracticeController {

    @Autowired
    private ProctoringService proctoringService;

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/malpractice")
    public void handleMalpracticeEvent(@Payload MalpracticeEventDto eventDto) {
        if (eventDto != null && eventDto.getAttemptId() != null) {
            proctoringService.recordMalpracticeEvent(eventDto);
        }
    }

    @MessageMapping("/video-frame")
    public void handleVideoFrame(@Payload com.examguard.dto.VideoFrameDto frameDto) {
        if (frameDto != null && frameDto.getExamId() != null) {
            System.out.println("Received video frame for attemptId: " + frameDto.getAttemptId());
            // Broadcast to the video topic so admins can watch
            messagingTemplate.convertAndSend("/topic/exam-video", frameDto);
        } else {
            System.out.println("Received invalid video frame");
        }
    }
}
