package com.examguard.service;

import com.examguard.entity.AuditLog;
import com.examguard.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String action, String description, String ipAddress, String deviceInfo) {
        try {
            AuditLog log = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .description(description)
                    .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                    .deviceInfo(deviceInfo != null ? deviceInfo : "Browser Client")
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Silently catch audit log failures so core user actions complete smoothly
        }
    }
}
