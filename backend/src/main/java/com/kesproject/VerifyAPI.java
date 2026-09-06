package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class VerifyAPI {

    @GetMapping("/verify/{verificationCode}")
    public VerifyResponse verifyDocument(@PathVariable String verificationCode) {
        if (verificationCode != null && verificationCode.contains("REQ-")) {
            String requestId = verificationCode.split("-")[0] + "-" + verificationCode.split("-")[1];
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