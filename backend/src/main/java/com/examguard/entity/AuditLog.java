package com.examguard.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String action;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "device_info")
    private String deviceInfo;

    @Column(columnDefinition = "TEXT")
    private String description;

    public AuditLog() {}

    public AuditLog(Long id, Long userId, String action, LocalDateTime timestamp, String ipAddress, String deviceInfo, String description) {
        this.id = id;
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
        this.deviceInfo = deviceInfo;
        this.description = description;
    }

    public static AuditLogBuilder builder() { return new AuditLogBuilder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("username")
    private String username;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public static class AuditLogBuilder {
        private Long id;
        private Long userId;
        private String action;
        private LocalDateTime timestamp;
        private String ipAddress;
        private String deviceInfo;
        private String description;

        public AuditLogBuilder id(Long id) { this.id = id; return this; }
        public AuditLogBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuditLogBuilder action(String action) { this.action = action; return this; }
        public AuditLogBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public AuditLogBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public AuditLogBuilder deviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; return this; }
        public AuditLogBuilder description(String description) { this.description = description; return this; }

        public AuditLog build() {
            return new AuditLog(id, userId, action, timestamp, ipAddress, deviceInfo, description);
        }
    }
}
