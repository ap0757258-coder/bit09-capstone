package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin("*")
public class AuditAPI {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/logs")
    public List<AuditLog> getAuditLogs() {
        return auditLogService.getAllLogs();
    }

    @PostMapping("/log")
    public LogResponse logAction(@RequestBody AuditLogPayload payload) {
        if (payload.requestId == null || payload.requestId.isEmpty()) {
            return new LogResponse("error", "Request ID required");
        }

        auditLogService.addLog(
            payload.requestId,
            payload.adminName,
            payload.action,
            payload.comment
        );
        
        return new LogResponse("success", "Action logged");
    }

    public static class AuditLogPayload {
        public String requestId;
        public String adminName;
        public String action;
        public String comment;
    }

    public static class LogResponse {
        public String status;
        public String message;

        public LogResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}