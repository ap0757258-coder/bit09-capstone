
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
            System.out.println("Download request: " + requestId);

            Optional<DocumentRequest> optionalRequest =
                    documentRequestService.getRequestById(requestId);

            if (optionalRequest.isEmpty()) {
                System.out.println("Request not found: " + requestId);
                return ResponseEntity.notFound().build();
            }

            DocumentRequest doc = optionalRequest.get();

            String status = doc.getStatus() == null
                    ? ""
                    : doc.getStatus().trim();

            // Allow downloading after admin approval/upload.
            if (!status.equalsIgnoreCase("approved")
                    && !status.equalsIgnoreCase("uploaded")) {

                System.out.println("Document is not approved/uploaded. Status: " + status);
                return ResponseEntity.badRequest().build();
            }

            // Read the exact filename saved in the database.
            String fileName = doc.getFileName();

            if (fileName == null || fileName.trim().isEmpty()) {
                System.out.println("No filename saved for request: " + requestId);
                return ResponseEntity.notFound().build();
            }

            Path uploadPath = Paths.get(
                    System.getProperty("java.io.tmpdir"),
                    "bit09-uploads"
            ).toAbsolutePath().normalize();

            // Prevent a filename from pointing outside the upload directory.
            Path filePath = uploadPath.resolve(fileName).normalize();

            if (!filePath.startsWith(uploadPath)
                    || !Files.isRegularFile(filePath)) {

                System.out.println("Uploaded file not found: " + filePath);
                return ResponseEntity.notFound().build();
            }

            byte[] fileBytes = Files.readAllBytes(filePath);

            String downloadName = filePath.getFileName().toString();

            MediaType mediaType = downloadName.toLowerCase().endsWith(".pdf")
                    ? MediaType.APPLICATION_PDF
                    : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + downloadName.replace("\"", "") + "\""
                    )
                    .contentLength(fileBytes.length)
                    .body(fileBytes);

        } catch (Exception e) {
            System.err.println("Download error: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.internalServerError().build();
        }
    }
}

