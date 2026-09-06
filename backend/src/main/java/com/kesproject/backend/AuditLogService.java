package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
    
    public List<AuditLog> getLogsByRequestId(String requestId) {
        return auditLogRepository.findByRequestId(requestId);
    }
    
    public List<AuditLog> getLogsByAdminName(String adminName) {
        return auditLogRepository.findByAdminName(adminName);
    }
    
    public AuditLog addLog(String requestId, String adminName, String action, String comment) {
        AuditLog log = new AuditLog(requestId, adminName, action, comment);
        return auditLogRepository.save(log);
    }
}