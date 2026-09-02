package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:3000")
public class AuditAPI {

    private static final List<AuditLogEntry> logs = new ArrayList<>();

    @PostMapping("/log")
    public Response addLog(@RequestBody AuditLogRequest req) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        logs.add(new AuditLogEntry(req.requestId, req.adminName, req.action, req.comment, timestamp));
        System.out.println(">>> AUDIT LOGGED: " + req.requestId + " - " + req.action);
        return new Response("success", "Audit log saved");
    }

    @GetMapping("/logs")
    public List<AuditLogEntry> getLogs() {
        return logs;
    }

    public static class AuditLogRequest {
        public String requestId;
        public String adminName;
        public String action;
        public String comment;
    }

    public static class AuditLogEntry {
        public String requestId;
        public String adminName;
        public String action;
        public String comment;
        public String timestamp;

        public AuditLogEntry(String requestId, String adminName, String action, String comment, String timestamp) {
            this.requestId = requestId;
            this.adminName = adminName;
            this.action = action;
            this.comment = comment;
            this.timestamp = timestamp;
        }
    }

    public static class Response {
        public String status;
        public String message;

        public Response(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}