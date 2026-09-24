package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.io.File;

@RestController
@RequestMapping("/api/download")
@CrossOrigin("*")
public class DownloadAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @GetMapping("/document/{requestId}/{documentType}")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String requestId,
            @PathVariable String documentType) {
        
        try {
            System.out.println("📥 Download request: " + requestId);
            
            Optional<DocumentRequest> request = documentRequestService.getRequestById(requestId);
            
            if (request.isEmpty()) {
                System.out.println("❌ Request not found");
                return ResponseEntity.notFound().build();
            }
            
            DocumentRequest doc = request.get();
            
            // Only approved documents can be downloaded
            if (!doc.getStatus().equals("approved")) {
                System.out.println("❌ Document not approved");
                return ResponseEntity.badRequest().build();
            }
            
            // Get upload directory
            String uploadDir = System.getProperty("java.io.tmpdir") + "bit09-uploads/";
            System.out.println("📁 Looking in: " + uploadDir);
            
            File uploadFolder = new File(uploadDir);
            
            if (!uploadFolder.exists()) {
                System.out.println("❌ Upload folder doesn't exist");
                return ResponseEntity.notFound().build();
            }
            
            // Find the uploaded file
            File[] files = uploadFolder.listFiles();
            File targetFile = null;
            
            if (files != null) {
                System.out.println("📂 Files in folder: " + files.length);
                
                for (File file : files) {
                    System.out.println("   - " + file.getName());
                    
                    if (file.getName().startsWith(requestId) && !file.isDirectory()) {
                        targetFile = file;
                        System.out.println("✅ Found file: " + file.getName());
                        break;
                    }
                }
            }
            
            if (targetFile == null) {
                System.out.println("❌ No uploaded file found for: " + requestId);
                return ResponseEntity.notFound().build();
            }
            
            // Read file bytes
            byte[] fileBytes = Files.readAllBytes(targetFile.toPath());
            System.out.println("✅ File size: " + fileBytes.length + " bytes");
            
            // Determine content type
            String fileName = targetFile.getName();
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            
            if (fileName.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if (fileName.endsWith(".txt")) {
                mediaType = MediaType.TEXT_PLAIN;
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (fileName.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
            
            System.out.println("📄 Content-Type: " + mediaType);
            
            // Send file
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(fileBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileBytes);
            
        } catch (Exception e) {
            System.out.println("❌ Download error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}