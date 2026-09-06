package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class DocumentUploadAPI {

    private static List<Document> documents = new ArrayList<>();

    static {
        documents.add(new Document(1, "REQ-001", "TDIT065A", "Bonafide Letter", "uploaded", "2026-09-05", "admin"));
        documents.add(new Document(2, "REQ-002", "TDIT069A", "Transcript", "uploaded", "2026-09-04", "admin"));
        documents.add(new Document(3, "REQ-003", "TDMMC0050", "Character Certificate", "pending", "2026-09-03", ""));
    }

    @GetMapping("/documents")
    public List<Document> getDocuments() {
        return documents;
    }

    @PostMapping("/upload")
    public UploadResponse uploadDocument(@RequestBody DocumentPayload payload) {
        if (payload.requestId == null || payload.requestId.isEmpty()) {
            return new UploadResponse("error", "Request ID required");
        }
        if (payload.studentId == null || payload.studentId.isEmpty()) {
            return new UploadResponse("error", "Student ID required");
        }
        if (payload.documentName == null || payload.documentName.isEmpty()) {
            return new UploadResponse("error", "Document name required");
        }

        Document doc = new Document(
            documents.size() + 1,
            payload.requestId,
            payload.studentId,
            payload.documentName,
            "uploaded",
            java.time.LocalDate.now().toString(),
            "admin"
        );
        documents.add(doc);
        return new UploadResponse("success", "Document uploaded successfully");
    }

    @PostMapping("/sign/{documentId}")
    public SignResponse signDocument(@PathVariable int documentId, @RequestBody SignPayload payload) {
        for (Document doc : documents) {
            if (doc.id == documentId) {
                doc.status = "signed";
                return new SignResponse("success", "Document signed", payload.adminComment);
            }
        }
        return new SignResponse("error", "Document not found", "");
    }

    public static class Document {
        public int id;
        public String requestId;
        public String studentId;
        public String documentName;
        public String status;
        public String uploadedDate;
        public String uploadedBy;

        public Document(int id, String requestId, String studentId, String documentName, String status, String uploadedDate, String uploadedBy) {
            this.id = id;
            this.requestId = requestId;
            this.studentId = studentId;
            this.documentName = documentName;
            this.status = status;
            this.uploadedDate = uploadedDate;
            this.uploadedBy = uploadedBy;
        }
    }

    public static class DocumentPayload {
        public String requestId;
        public String studentId;
        public String documentName;
        public String documentFile;
    }

    public static class UploadResponse {
        public String status;
        public String message;

        public UploadResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }

    public static class SignPayload {
        public String adminComment;
    }

    public static class SignResponse {
        public String status;
        public String message;
        public String comment;

        public SignResponse(String status, String message, String comment) {
            this.status = status;
            this.message = message;
            this.comment = comment;
        }
    }
}