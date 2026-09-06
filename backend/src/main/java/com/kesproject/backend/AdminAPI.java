package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminAPI {

    @Autowired
    private DocumentRequestService documentRequestService;
    
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/requests")
    public List<DocumentRequest> getRequests() {
        return documentRequestService.getAllRequests();
    }

    @PostMapping("/approve/{requestId}")
    public ApprovalResponse approveRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        DocumentRequest approvedRequest = documentRequestService.approveRequest(requestId, payload.comment);
        
        if (approvedRequest != null) {
            auditLogService.addLog(requestId, "admin", "approved", payload.comment);
            return new ApprovalResponse("success", "Request approved");
        }
        return new ApprovalResponse("error", "Request not found");
    }

    @PostMapping("/reject/{requestId}")
    public ApprovalResponse rejectRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        DocumentRequest rejectedRequest = documentRequestService.rejectRequest(requestId, payload.comment);
        
        if (rejectedRequest != null) {
            auditLogService.addLog(requestId, "admin", "rejected", payload.comment);
            return new ApprovalResponse("success", "Request rejected");
        }
        return new ApprovalResponse("error", "Request not found");
    }

    public static class ApprovalPayload {
        public String comment;
    }

    public static class ApprovalResponse {
        public String status;
        public String message;

        public ApprovalResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}