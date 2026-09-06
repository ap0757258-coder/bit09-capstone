package com.kesproject.backend;

import java.util.*;

public class SharedRequestData {
    
    private static final List<RequestItem> allRequests = new ArrayList<>();

    static {
        allRequests.add(new RequestItem(1, "REQ-001", "test123", "Bonafide Letter", "pending", "2026-08-28", "For admission"));
        allRequests.add(new RequestItem(2, "REQ-002", "TDIT069A", "Transcript", "approved", "2026-08-27", "For job"));
        allRequests.add(new RequestItem(3, "REQ-003", "TDMMC0050", "Character Certificate", "rejected", "2026-08-26", "For scholarship"));
        allRequests.add(new RequestItem(4, "REQ-004", "TDIT055A", "12th Marksheet", "pending", "2026-08-29", "For visa"));
        allRequests.add(new RequestItem(5, "REQ-005", "TDIT049A", "Leaving Certificate", "approved", "2026-08-29", "For transfer"));
    }

    public static List<RequestItem> getAllRequests() {
        return allRequests;
    }

    public static void addRequest(RequestItem request) {
        allRequests.add(request);
    }

    public static RequestItem getRequest(String requestId) {
        for (RequestItem req : allRequests) {
            if (req.requestId.equals(requestId)) {
                return req;
            }
        }
        return null;
    }

    public static void updateRequest(String requestId, String status) {
        for (RequestItem req : allRequests) {
            if (req.requestId.equals(requestId)) {
                req.status = status;
                break;
            }
        }
    }

    public static class RequestItem {
        public int id;
        public String requestId;
        public String studentId;
        public String documentType;
        public String status;
        public String createdDate;
        public String purpose;
        public String studentName;

        public RequestItem(int id, String requestId, String studentId, String documentType, String status, String createdDate, String purpose) {
            this.id = id;
            this.requestId = requestId;
            this.studentId = studentId;
            this.documentType = documentType;
            this.status = status;
            this.createdDate = createdDate;
            this.purpose = purpose;
            this.studentName = "Student " + studentId;
        }
    }
}