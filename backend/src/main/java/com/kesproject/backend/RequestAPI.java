package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RequestAPI {

    // Temporary in-memory storage (shared across student + admin)
    static List<DocRequest> allRequests = new ArrayList<>();

    @PostMapping("/create-request")
    public Response createRequest(@RequestBody RequestPayload payload) {
        if (payload.documentType == null || payload.documentType.isEmpty()) {
            return new Response("error", "Document type required");
        }
        if (payload.purpose == null || payload.purpose.isEmpty()) {
            return new Response("error", "Purpose required");
        }

        String requestId = "REQ-" + System.currentTimeMillis();

        DocRequest newReq = new DocRequest();
        newReq.requestId = requestId;
        newReq.documentType = payload.documentType;
        newReq.purpose = payload.purpose;
        newReq.status = "pending";
        newReq.createdDate = LocalDate.now().toString();
        newReq.studentId = "test123";
        newReq.studentName = "Aaditi Kiritbhai Patel";

        allRequests.add(newReq);

        return new Response("success", "Request created successfully. ID: " + requestId);
    }

    @GetMapping("/requests/{studentId}")
    public List<DocRequest> getStudentRequests(@PathVariable String studentId) {
        List<DocRequest> result = new ArrayList<>();
        for (DocRequest r : allRequests) {
            if (r.studentId.equals(studentId)) {
                result.add(r);
            }
        }
        return result;
    }

    public static class RequestPayload {
        public String documentType;
        public String purpose;
    }

    public static class DocRequest {
        public String requestId;
        public String documentType;
        public String purpose;
        public String status;
        public String createdDate;
        public String studentId;
        public String studentName;
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