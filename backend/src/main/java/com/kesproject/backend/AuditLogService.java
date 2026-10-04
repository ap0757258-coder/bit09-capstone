
package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(
            String requestId,
            String action,
            String comments,
            String adminName) {

        AuditLog log = new AuditLog();

        log.setRequestId(requestId);
        log.setAction(action);
        log.setComments(comments);
        log.setAdminName(adminName);
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}

