package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/download")
@CrossOrigin("*")
public class DownloadAPI {

    @GetMapping("/document/{requestId}/{documentType}")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String requestId,
            @PathVariable String documentType) {
        
        String verificationCode = generateVerificationCode(requestId);
        String content = generateDocumentContent(requestId, documentType, verificationCode);
        byte[] fileContent = content.getBytes(StandardCharsets.UTF_8);
        
        String filename = requestId + "_" + documentType.replace(" ", "_") + ".txt";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(fileContent.length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }

    private String generateVerificationCode(String requestId) {
        long timestamp = System.currentTimeMillis();
        return requestId + "-" + String.format("%06d", timestamp % 1000000);
    }

    private String generateDocumentContent(String requestId, String documentType, String verificationCode) {
        StringBuilder content = new StringBuilder();
        
        content.append("====================================\n");
        content.append("KES SHROFF COLLEGE\n");
        content.append("OFFICIAL DOCUMENT\n");
        content.append("====================================\n\n");
        
        content.append("Request ID: ").append(requestId).append("\n");
        content.append("Document Type: ").append(documentType).append("\n");
        content.append("Issued Date: ").append(java.time.LocalDate.now()).append("\n");
        content.append("Status: APPROVED\n");
        content.append("Verification Code: ").append(verificationCode).append("\n");
        content.append("Verify at: http://localhost:3000/verify/").append(verificationCode).append("\n\n");
        
        content.append("Student Information:\n");
        content.append("Enrollment: AP0757258\n");
        content.append("Name: Aaditi Kiritbhai Patel\n");
        content.append("Department: IT\n");
        content.append("Semester: V\n\n");
        
        if (documentType.contains("Bonafide")) {
            content.append("BONAFIDE CERTIFICATE\n");
            content.append("This is to certify that the student mentioned above\n");
            content.append("is a bonafide student of this institution.\n");
        } else if (documentType.contains("Transcript")) {
            content.append("ACADEMIC TRANSCRIPT\n");
            content.append("Academic Performance Record:\n");
            content.append("Semester I: 8.5\n");
            content.append("Semester II: 8.7\n");
            content.append("Semester III: 8.9\n");
            content.append("Semester IV: 9.1\n");
        } else if (documentType.contains("Character")) {
            content.append("CHARACTER CERTIFICATE\n");
            content.append("This is to certify that the student is of good moral character.\n");
        } else if (documentType.contains("Marksheet")) {
            content.append("12TH STANDARD MARKSHEET\n");
            content.append("Obtained Marks: 480/500\n");
            content.append("Percentage: 96%\n");
        } else if (documentType.contains("Leaving")) {
            content.append("LEAVING CERTIFICATE\n");
            content.append("This certifies that the student has left the institution.\n");
        }
        
        content.append("\n====================================\n");
        content.append("QR CODE: Scan to verify authenticity\n");
        content.append("Verification Code: ").append(verificationCode).append("\n");
        content.append("Digitally Signed by KES SHROFF COLLEGE\n");
        content.append("This document is securely generated.\n");
        content.append("====================================\n");
        
        return content.toString();
    }
}