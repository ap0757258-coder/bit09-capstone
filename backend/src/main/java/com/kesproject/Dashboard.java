package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class Dashboard {

    @GetMapping("/requests/{studentId}")
    public List<RequestData> getRequests(@PathVariable String studentId) {
        List<RequestData> requests = new ArrayList<>();
        requests.add(new RequestData(1, "REQ-001", "Bonafide Letter", "pending", "2026-08-28"));
        requests.add(new RequestData(2, "REQ-002", "Transcript", "approved", "2026-08-27"));
        requests.add(new RequestData(3, "REQ-003", "Character Certificate", "rejected", "2026-08-26"));
        requests.add(new RequestData(4, "REQ-004", "12th Marksheet", "pending", "2026-08-29"));
        requests.add(new RequestData(5, "REQ-005", "Leaving Certificate", "approved", "2026-08-29"));
        return requests;
    }

    public static class RequestData {
        public int id;
        public String requestId;
        public String documentType;
        public String status;
        public String createdDate;

        public RequestData(int id, String requestId, String documentType, String status, String createdDate) {
            this.id = id;
            this.requestId = requestId;
            this.documentType = documentType;
            this.status = status;
            this.createdDate = createdDate;
        }
    }
}