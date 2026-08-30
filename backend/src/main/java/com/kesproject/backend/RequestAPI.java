package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RequestAPI {

    @PostMapping("/create-request")
    public Response createRequest(@RequestBody RequestPayload payload) {
        if (payload.documentType == null || payload.documentType.isEmpty()) {
            return new Response("error", "Document type required");
        }
        if (payload.purpose == null || payload.purpose.isEmpty()) {
            return new Response("error", "Purpose required");
        }
        
        return new Response("success", "Request created successfully. ID: REQ-" + System.currentTimeMillis());
    }

    public static class RequestPayload {
        public String documentType;
        public String purpose;
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