package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificate")
@CrossOrigin("*")
public class CertificateAPI {

    @Autowired
    private DocumentRequestRepository documentRequestRepository;

    @Autowired
    private CertificateService certificateService;

    // Code sirf ek baar banta hai aur DB mein save hota hai
    private String getOrCreateCode(DocumentRequest doc) {
        if (doc.getVerificationCode() == null || doc.getVerificationCode().isBlank()) {
            String random = UUID.randomUUID().toString().replace("-", "")
                    .substring(0, 10).toUpperCase();
            doc.setVerificationCode(doc.getRequestId() + "-" + random);
            documentRequestRepository.save(doc);
        }
        return doc.getVerificationCode();
    }

    @GetMapping("/download/{requestId}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String requestId) {
        try {
            Optional<DocumentRequest> request = documentRequestRepository.findByRequestId(requestId);

            if (request.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            DocumentRequest doc = request.get();

            if (!"approved".equals(doc.getStatus())) {
                return ResponseEntity.badRequest().build();
            }

            String verificationCode = getOrCreateCode(doc);
            byte[] pdfBytes = certificateService.generateCertificatePDF(doc, verificationCode);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header("Content-Disposition", "attachment; filename=certificate_" + requestId + ".pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            System.out.println("❌ Certificate error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Dashboard ka QR isi code se banega (sirf us request ka student le sakta hai)
    @GetMapping("/code/{requestId}")
    public ResponseEntity<Map<String, String>> getVerificationCode(
            @PathVariable String requestId,
            @RequestParam(value = "studentId", required = false) String studentId) {

        Optional<DocumentRequest> request = documentRequestRepository.findByRequestId(requestId);

        if (request.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        DocumentRequest doc = request.get();

        if (studentId == null || !studentId.equals(doc.getStudentId())
                || !"approved".equals(doc.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, String> res = new HashMap<>();
        res.put("verificationCode", getOrCreateCode(doc));
        return ResponseEntity.ok(res);
    }
}