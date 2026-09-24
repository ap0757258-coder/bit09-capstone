package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class VerifyAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @GetMapping("/verify/{verificationCode}")
    public VerifyResponse verifyDocument(@PathVariable String verificationCode) {
        System.out.println("Verifying code: " + verificationCode);
        
        if (verificationCode == null || verificationCode.isEmpty()) {
            return new VerifyResponse("invalid", "Invalid verification code", "");
        }
        
        // Check if format is correct (REQ-XXX-XXXXXX)
        if (!verificationCode.contains("REQ-")) {
            return new VerifyResponse("invalid", "Invalid verification code format", "");
        }
        
        // Extract request ID from verification code
        String[] parts = verificationCode.split("-");
        if (parts.length < 3) {
            return new VerifyResponse("invalid", "Invalid verification code", "");
        }
        
        String requestId = parts[0] + "-" + parts[1]; // REQ-001
        
        // Check if request exists in database
        try {
            java.util.Optional<DocumentRequest> request = documentRequestService.getRequestById(requestId);
            
            if (request.isPresent()) {
                DocumentRequest doc = request.get();
                
                // Check if approved
                if ("approved".equals(doc.getStatus())) {
                    return new VerifyResponse("valid", "✅ Document is authentic and verified by KES SHROFF COLLEGE", requestId);
                } else if ("rejected".equals(doc.getStatus())) {
                    return new VerifyResponse("invalid", "❌ Document has been rejected", requestId);
                } else {
                    return new VerifyResponse("invalid", "⏳ Document is still pending approval", requestId);
                }
            } else {
                return new VerifyResponse("invalid", "Document not found in database", "");
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return new VerifyResponse("error", "Verification error: " + e.getMessage(), "");
        }
    }

    public static class VerifyResponse {
        public String status;
        public String message;
        public String requestId;

        public VerifyResponse(String status, String message, String requestId) {
            this.status = status;
            this.message = message;
            this.requestId = requestId;
        }
    }
}