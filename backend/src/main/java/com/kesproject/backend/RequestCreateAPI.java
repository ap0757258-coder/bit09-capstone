package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RequestCreateAPI {

    @GetMapping("/requests/{studentId}")
    public List<SharedRequestData.RequestItem> getRequests(@PathVariable String studentId) {
        List<SharedRequestData.RequestItem> allRequests = SharedRequestData.getAllRequests();
        List<SharedRequestData.RequestItem> studentRequests = new ArrayList<>();
        
        for (SharedRequestData.RequestItem req : allRequests) {
            if (req.studentId.equals(studentId)) {
                studentRequests.add(req);
            }
        }
        
        if (studentRequests.isEmpty()) {
            return allRequests;
        }
        return studentRequests;
    }

    @PostMapping("/create-request")
    public CreateResponse createRequest(@RequestBody CreateRequestPayload payload) {
        if (payload.studentId == null || payload.studentId.isEmpty()) {
            return new CreateResponse("error", "Student ID required");
        }
        if (payload.documentType == null || payload.documentType.isEmpty()) {
            return new CreateResponse("error", "Document type required");
        }
        if (payload.purpose == null || payload.purpose.isEmpty()) {
            return new CreateResponse("error", "Purpose required");
        }

        List<SharedRequestData.RequestItem> allRequests = SharedRequestData.getAllRequests();
        int newId = allRequests.size() + 1;
        String requestId = "REQ-" + String.format("%03d", newId);
        
        SharedRequestData.RequestItem newRequest = new SharedRequestData.RequestItem(
            newId,
            requestId,
            payload.studentId,
            payload.documentType,
            "pending",
            java.time.LocalDate.now().toString(),
            payload.purpose
        );
        
        SharedRequestData.addRequest(newRequest);
        return new CreateResponse("success", "Request created successfully! Request ID: " + requestId);
    }

    public static class CreateRequestPayload {
        public String studentId;
        public String documentType;
        public String purpose;
    }

    public static class CreateResponse {
        public String status;
        public String message;

        public CreateResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}