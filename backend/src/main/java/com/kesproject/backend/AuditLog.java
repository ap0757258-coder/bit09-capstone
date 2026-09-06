package com.kesproject.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String requestId;
    
    @Column(nullable = false)
    private String adminName;
    
    @Column(nullable = false)
    private String action; // approved, rejected
    
    @Column
    private String comment;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    // Constructors
    public AuditLog() {}
    
    public AuditLog(String requestId, String adminName, String action, String comment) {
        this.requestId = requestId;
        this.adminName = adminName;
        this.action = action;
        this.comment = comment;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    
    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}