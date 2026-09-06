package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RequestCreateAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @GetMapping("/requests/{studentId}")
    public List<DocumentRequest> getRequests(@PathVariable String studentId) {
        List<DocumentRequest> studentRequests = documentRequestService.getRequestsByStudentId(studentId);
        if (studentRequests.isEmpty()) {
            return documentRequestService.getAllRequests();
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

        DocumentRequest newRequest = documentRequestService.createRequest(
            payload.studentId,
            payload.documentType,
            payload.purpose
        );

        return new CreateResponse("success", "Request created successfully! Request ID: " + newRequest.getRequestId());
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