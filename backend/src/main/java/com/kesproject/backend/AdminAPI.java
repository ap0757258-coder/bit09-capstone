package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminAPI {

    @GetMapping("/requests")
    public List<RequestAPI.DocRequest> getAllRequests() {
        return RequestAPI.allRequests;
    }

    @PostMapping("/approve/{requestId}")
    public Response approveRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        for (RequestAPI.DocRequest r : RequestAPI.allRequests) {
            if (r.requestId.equals(requestId)) {
                r.status = "approved";
                r.comment = payload.comment;
                System.out.println(">>> APPROVED: " + requestId);
                return new Response("success", "Request " + requestId + " approved");
            }
        }
        return new Response("error", "Request not found");
    }

    @PostMapping("/reject/{requestId}")
    public Response rejectRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        for (RequestAPI.DocRequest r : RequestAPI.allRequests) {
            if (r.requestId.equals(requestId)) {
                r.status = "rejected";
                r.comment = payload.comment;
                System.out.println(">>> REJECTED: " + requestId);
                return new Response("success", "Request " + requestId + " rejected");
            }
        }
        return new Response("error", "Request not found");
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