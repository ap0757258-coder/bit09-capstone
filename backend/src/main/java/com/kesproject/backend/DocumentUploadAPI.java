package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/upload")
@CrossOrigin("*")
public class DocumentUploadAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @Autowired
    private DocumentFileRepository documentFileRepository;

    @Autowired
    private FileToPdfService fileToPdfService;

    @PostMapping("/{requestId}")
    public UploadResponse uploadDocument(
            @PathVariable String requestId,
            @RequestParam("file") MultipartFile file) {

        try {
            Optional<DocumentRequest> request =
                    documentRequestService.getRequestById(requestId);

            if (request.isEmpty()) {
                return new UploadResponse("error", "Request not found");
            }

            DocumentRequest doc = request.get();

            if (!"approved".equals(doc.getStatus())) {
                return new UploadResponse("error", "Only approved requests can be uploaded");
            }

            if (file.isEmpty()) {
                return new UploadResponse("error", "Please select a file");
            }

            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                return new UploadResponse("error", "Invalid file name");
            }

            // Koi bhi supported file PDF mein badal jati hai
            byte[] pdfBytes = fileToPdfService.convertToPdf(file);

            // Naam: <requestId>_<original naam bina extension>.pdf
            int dot = originalFileName.lastIndexOf('.');
            String baseName = dot > 0 ? originalFileName.substring(0, dot) : originalFileName;
            String safeBase = baseName.replaceAll("[^a-zA-Z0-9_-]", "_");
            String fileName = requestId + "_" + safeBase + ".pdf";

            DocumentFile stored = documentFileRepository
                    .findByRequestId(requestId)
                    .orElse(new DocumentFile());

            stored.setRequestId(requestId);
            stored.setFileName(fileName);
            stored.setData(pdfBytes);
            documentFileRepository.save(stored);

            doc.setFileName(fileName);
            documentRequestService.updateRequest(doc);

            System.out.println("Document uploaded and saved as PDF: " + fileName);

            return new UploadResponse(
                    "success",
                    "Document uploaded and saved as PDF! File: " + fileName
            );

        } catch (IllegalArgumentException e) {
            return new UploadResponse("error", e.getMessage());

        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            e.printStackTrace();

            return new UploadResponse(
                    "error",
                    "Upload failed: " + e.getMessage()
            );
        }
    }

    public static class UploadResponse {

        public String status;
        public String message;

        public UploadResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}