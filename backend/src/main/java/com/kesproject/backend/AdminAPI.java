package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminAPI {

    @GetMapping("/requests")
    public List<SharedRequestData.RequestItem> getRequests() {
        return SharedRequestData.getAllRequests();
    }

    @PostMapping("/approve/{requestId}")
    public ApprovalResponse approveRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        SharedRequestData.RequestItem req = SharedRequestData.getRequest(requestId);
        if (req != null) {
            SharedRequestData.updateRequest(requestId, "approved");
            return new ApprovalResponse("success", "Request approved");
        }
        return new ApprovalResponse("error", "Request not found");
    }

    @PostMapping("/reject/{requestId}")
    public ApprovalResponse rejectRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        SharedRequestData.RequestItem req = SharedRequestData.getRequest(requestId);
        if (req != null) {
            SharedRequestData.updateRequest(requestId, "rejected");
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