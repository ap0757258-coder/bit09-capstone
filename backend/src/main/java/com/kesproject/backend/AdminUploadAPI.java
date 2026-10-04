package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class AdminUploadAPI {

    @Autowired
    private DocumentRequestRepository documentRequestRepository;

    @Autowired
    private DocumentFileRepository documentFileRepository;

    // Student: sirf apni request ka PDF download kar sakta hai
    @GetMapping("/api/documents/download/{requestId}")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String requestId,
            @RequestParam(value = "studentId", required = false) String studentId) {
        try {
            Optional<DocumentRequest> req = documentRequestRepository.findByRequestId(requestId);

            if (req.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Access check: request kisi aur student ki ho to block
            if (studentId == null || !studentId.equals(req.get().getStudentId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Sirf approved request ka document milega
            if (!"approved".equals(req.get().getStatus())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Optional<DocumentFile> stored = documentFileRepository.findByRequestId(requestId);

            if (stored.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + stored.get().getFileName() + "\"")
                    .body(stored.get().getData());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Student: apni saari requests
    @GetMapping("/api/documents/student/{studentId}")
    public List<DocumentRequest> getStudentRequests(@PathVariable String studentId) {
        return documentRequestRepository.findAll().stream()
                .filter(r -> studentId.equals(r.getStudentId()))
                .collect(Collectors.toList());
    }
}