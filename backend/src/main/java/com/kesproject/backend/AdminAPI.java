package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminAPI {

    @Autowired
    private DocumentRequestService documentRequestService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private StudentService studentService;

    @GetMapping("/requests")
    public List<AdminRequestDTO> getRequests() {
        List<DocumentRequest> allRequests = documentRequestService.getAllRequests();
        List<AdminRequestDTO> dtos = new ArrayList<>();
        
        for (DocumentRequest req : allRequests) {
            // Get student details from database
            Optional<Student> student = studentService.getStudentByEnrollment(req.getStudentId());
            
            String studentName = "Unknown Student";
            String studentDept = "Unknown";
            
            if (student.isPresent()) {
                studentName = student.get().getName();
                studentDept = student.get().getDepartment();
            }
            
            AdminRequestDTO dto = new AdminRequestDTO(
                req.getId(),
                req.getRequestId(),
                req.getStudentId(),
                studentName,
                studentDept,
                req.getDocumentType(),
                req.getStatus(),
                req.getCreatedDate().toString(),
                req.getPurpose()
            );
            dtos.add(dto);
        }
        
        return dtos;
    }

    @PostMapping("/approve/{requestId}")
    public ApprovalResponse approveRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        DocumentRequest approvedRequest = documentRequestService.approveRequest(requestId, payload.comment);
        
        if (approvedRequest != null) {
            auditLogService.addLog(requestId, "admin", "approved", payload.comment);
            return new ApprovalResponse("success", "Request approved");
        }
        return new ApprovalResponse("error", "Request not found");
    }

    @PostMapping("/reject/{requestId}")
    public ApprovalResponse rejectRequest(@PathVariable String requestId, @RequestBody ApprovalPayload payload) {
        DocumentRequest rejectedRequest = documentRequestService.rejectRequest(requestId, payload.comment);
        
        if (rejectedRequest != null) {
            auditLogService.addLog(requestId, "admin", "rejected", payload.comment);
            return new ApprovalResponse("success", "Request rejected");
        }
        return new ApprovalResponse("error", "Request not found");
    }

    public static class AdminRequestDTO {
        public Long id;
        public String requestId;
        public String studentId;
        public String studentName;
        public String studentDept;
        public String documentType;
        public String status;
        public String createdDate;
        public String purpose;

        public AdminRequestDTO(Long id, String requestId, String studentId, String studentName, String studentDept, 
                              String documentType, String status, String createdDate, String purpose) {
            this.id = id;
            this.requestId = requestId;
            this.studentId = studentId;
            this.studentName = studentName;
            this.studentDept = studentDept;
            this.documentType = documentType;
            this.status = status;
            this.createdDate = createdDate;
            this.purpose = purpose;
        }
    }

    public static class ApprovalPayload {
        public String comment;
    }

    public static class ApprovalResponse {
        public String status;
        public String message;

        public ApprovalResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}