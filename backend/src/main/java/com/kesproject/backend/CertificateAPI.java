package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificate")
@CrossOrigin("*")
public class CertificateAPI {
    
    @Autowired
    private DocumentRequestService documentRequestService;
    
    @Autowired
    private CertificateService certificateService;
    
    @GetMapping("/download/{requestId}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String requestId) {
        try {
            Optional<DocumentRequest> request = documentRequestService.getRequestById(requestId);
            
            if (request.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            DocumentRequest doc = request.get();
            
            if (!doc.getStatus().equals("approved")) {
                return ResponseEntity.badRequest().build();
            }
            
            String verificationCode = doc.getVerificationCode();
            if (verificationCode == null || verificationCode.isEmpty()) {
                long timestamp = System.currentTimeMillis();
                verificationCode = requestId + "-" + String.format("%06d", timestamp % 1000000);
                doc.setVerificationCode(verificationCode);
            }
            
            byte[] certificateBytes = certificateService.generateCertificatePDF(doc, verificationCode);
            
            HttpHeaders headers = new HttpHeaders();
           headers.setContentType(MediaType.APPLICATION_PDF);
headers.setContentDispositionFormData("attachment", requestId + "_Certificate.pdf");
            headers.setContentLength(certificateBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(certificateBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}