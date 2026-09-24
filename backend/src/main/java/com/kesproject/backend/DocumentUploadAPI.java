package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/upload")
@CrossOrigin("*")
public class DocumentUploadAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @PostMapping("/{requestId}")
    public UploadResponse uploadDocument(
            @PathVariable String requestId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            System.out.println("📤 Upload request for: " + requestId);
            System.out.println("📄 File: " + file.getOriginalFilename());
            
            Optional<DocumentRequest> request = documentRequestService.getRequestById(requestId);
            
            if (request.isEmpty()) {
                System.out.println("❌ Request not found: " + requestId);
                return new UploadResponse("error", "Request not found");
            }
            
            DocumentRequest doc = request.get();
            
            // Use system temp directory
            String uploadDir = System.getProperty("java.io.tmpdir") + "bit09-uploads/";
            Path uploadPath = Paths.get(uploadDir);
            
            // Create directory if not exists
            Files.createDirectories(uploadPath);
            System.out.println("📁 Upload directory: " + uploadDir);
            
            // Save file
            String fileName = requestId + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());
            
            System.out.println("✅ Document uploaded successfully: " + fileName);
            System.out.println("📍 Location: " + filePath.toString());
            
            return new UploadResponse("success", "Document uploaded successfully! File: " + fileName);
            
        } catch (Exception e) {
            System.out.println("❌ Upload error: " + e.getMessage());
            e.printStackTrace();
            return new UploadResponse("error", "Upload failed: " + e.getMessage());
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