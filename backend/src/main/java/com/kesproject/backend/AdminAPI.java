package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminAPI {

    @GetMapping("/requests")
    public List<AdminRequest> getAllRequests() {
        List<AdminRequest> requests = new ArrayList<>();
        requests.add(new AdminRequest(1, "REQ-001", "AP0757258", "Aaditi Patel", "Bonafide Letter", "For scholarship", "pending", "2026-08-28"));
        requests.add(new AdminRequest(2, "REQ-002", "AP0757259", "Raj Kumar", "Transcript", "For job", "approved", "2026-08-27"));
        requests.add(new AdminRequest(3, "REQ-003", "AP0757260", "Priya Singh", "Character Certificate", "For Visa", "rejected", "2026-08-26"));
        requests.add(new AdminRequest(4, "REQ-004", "AP0757258", "Aaditi Patel", "12th Marksheet", "For admission", "pending", "2026-08-29"));
        requests.add(new AdminRequest(5, "REQ-005", "AP0757259", "Raj Kumar", "Leaving Certificate", "For transfer", "pending", "2026-08-29"));
        return requests;
    }

    @PostMapping("/approve/{requestId}")
    public Response approveRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        return new Response("success", "Request " + requestId + " approved");
    }

    @PostMapping("/reject/{requestId}")
    public Response rejectRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        return new Response("success", "Request " + requestId + " rejected");
    }

    public static class AdminRequest {
        public int id;
        public String requestId;
        public String studentId;
        public String studentName;
        public String documentType;
        public String purpose;
        public String status;
        public String createdDate;

        public AdminRequest(int id, String requestId, String studentId, String studentName, String documentType, String purpose, String status, String createdDate) {
            this.id = id;
            this.requestId = requestId;
            this.studentId = studentId;
            this.studentName = studentName;
            this.documentType = documentType;
            this.purpose = purpose;
            this.status = status;
            this.createdDate = createdDate;
        }
    }

    public static class ApprovalPayload {
        public String comment;
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