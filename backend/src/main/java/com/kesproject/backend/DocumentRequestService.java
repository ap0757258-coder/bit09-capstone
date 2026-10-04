package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentRequestService {

    @Autowired
    private DocumentRequestRepository documentRequestRepository;

    public DocumentRequest saveRequest(DocumentRequest request) {

        // Generate request ID if it is missing
        if (request.getRequestId() == null
                || request.getRequestId().trim().isEmpty()) {
            request.setRequestId(
                "REQ-" + UUID.randomUUID().toString()
            );
        }

        return documentRequestRepository.save(request);
    }

    public Optional<DocumentRequest> getRequestById(String requestId) {
        return documentRequestRepository.findByRequestId(requestId);
    }

    public List<DocumentRequest> getRequestsByStudentId(String studentId) {
        return documentRequestRepository.findByStudentId(studentId);
    }

    public List<DocumentRequest> getAllRequests() {
        return documentRequestRepository.findAll();
    }

    public void updateRequest(DocumentRequest request) {
        documentRequestRepository.save(request);
    }

    public void approveRequest(String requestId) {
        Optional<DocumentRequest> req =
                documentRequestRepository.findByRequestId(requestId);

        if (req.isPresent()) {
            DocumentRequest request = req.get();
            request.setStatus("approved");
            documentRequestRepository.save(request);
        }
    }

    public void rejectRequest(String requestId) {
        Optional<DocumentRequest> req =
                documentRequestRepository.findByRequestId(requestId);

        if (req.isPresent()) {
            DocumentRequest request = req.get();
            request.setStatus("rejected");
            documentRequestRepository.save(request);
        }
    }
}