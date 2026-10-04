
package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminApproveAPI {

    @Autowired
    private DocumentRequestService documentRequestService;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/approve/{requestId}")
    public Map<String, String> approveRequest(
            @PathVariable String requestId) {

        Map<String, String> response = new HashMap<>();

        try {
            Optional<DocumentRequest> req =
                    documentRequestService.getRequestById(requestId);

            if (req.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Request not found");
                return response;
            }

            DocumentRequest request = req.get();
            request.setStatus("approved");
            documentRequestService.updateRequest(request);

            auditLogService.logAction(
                    requestId,
                    "APPROVED",
                    "Admin approved request",
                    "Admin"
            );

            System.out.println(
                    "Request " + requestId + " APPROVED!"
            );

            response.put("status", "success");
            response.put("message", "Request approved successfully");
            response.put("requestId", requestId);

        } catch (Exception e) {
            System.err.println("Approval error: " + e.getMessage());
            e.printStackTrace();

            response.put("status", "error");
            response.put("message", "Approval failed: " + e.getMessage());
        }

        return response;
    }

    @PostMapping("/reject/{requestId}")
    public Map<String, String> rejectRequest(
            @PathVariable String requestId) {

        Map<String, String> response = new HashMap<>();

        try {
            Optional<DocumentRequest> req =
                    documentRequestService.getRequestById(requestId);

            if (req.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Request not found");
                return response;
            }

            DocumentRequest request = req.get();
            request.setStatus("rejected");
            documentRequestService.updateRequest(request);

            auditLogService.logAction(
                    requestId,
                    "REJECTED",
                    "Admin rejected request",
                    "Admin"
            );

            System.out.println(
                    "Request " + requestId + " REJECTED!"
            );

            response.put("status", "success");
            response.put("message", "Request rejected successfully");
            response.put("requestId", requestId);

        } catch (Exception e) {
            System.err.println("Rejection error: " + e.getMessage());
            e.printStackTrace();

            response.put("status", "error");
            response.put("message", "Rejection failed: " + e.getMessage());
        }

        return response;
    }
}

