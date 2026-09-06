package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class DocumentRequestService {
    
    @Autowired
    private DocumentRequestRepository documentRequestRepository;
    
    public List<DocumentRequest> getAllRequests() {
        return documentRequestRepository.findAll();
    }
    
    public List<DocumentRequest> getRequestsByStudentId(String studentId) {
        return documentRequestRepository.findByStudentId(studentId);
    }
    
    public List<DocumentRequest> getRequestsByStatus(String status) {
        return documentRequestRepository.findByStatus(status);
    }
    
    public Optional<DocumentRequest> getRequestById(String requestId) {
        return documentRequestRepository.findByRequestId(requestId);
    }
    
    public DocumentRequest createRequest(String studentId, String documentType, String purpose) {
        // Generate request ID
        List<DocumentRequest> allRequests = documentRequestRepository.findAll();
        String requestId = "REQ-" + String.format("%03d", allRequests.size() + 1);
        
        DocumentRequest request = new DocumentRequest(requestId, studentId, documentType, "pending", purpose);
        return documentRequestRepository.save(request);
    }
    
    public DocumentRequest approveRequest(String requestId, String adminComment) {
        Optional<DocumentRequest> request = documentRequestRepository.findByRequestId(requestId);
        if (request.isPresent()) {
            DocumentRequest doc = request.get();
            doc.setStatus("approved");
            doc.setAdminComment(adminComment);
            doc.setApprovedDate(LocalDateTime.now());
            return documentRequestRepository.save(doc);
        }
        return null;
    }
    
    public DocumentRequest rejectRequest(String requestId, String adminComment) {
        Optional<DocumentRequest> request = documentRequestRepository.findByRequestId(requestId);
        if (request.isPresent()) {
            DocumentRequest doc = request.get();
            doc.setStatus("rejected");
            doc.setAdminComment(adminComment);
            return documentRequestRepository.save(doc);
        }
        return null;
    }
}