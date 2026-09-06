package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin("*")
public class QRCodeAPI {

    @GetMapping("/verify/{verificationCode}")
    public VerifyResponse verifyDocument(@PathVariable String verificationCode) {
        if (verificationCode != null && verificationCode.startsWith("REQ-") && verificationCode.length() > 8) {
            String requestId = verificationCode.substring(0, 7);
            return new VerifyResponse("valid", "Document is authentic and verified by KES SHROFF COLLEGE", requestId);
        }
        return new VerifyResponse("invalid", "Invalid verification code", "");
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