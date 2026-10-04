package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RequestCreateAPI {
    
    @Autowired
    private DocumentRequestRepository documentRequestRepository;
    
    @Autowired
    private DocumentRequestService documentRequestService;
    
    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/create-request")
    public Map<String, Object> createRequest(@RequestBody DocumentRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            request.setStatus("pending");
            request.setCreatedDate(LocalDate.now().toString());
            
            DocumentRequest saved = documentRequestRepository.save(request);
            
            response.put("status", "success");
            response.put("message", "Request created successfully");
            response.put("requestId", saved.getRequestId());
            
            return response;
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return response;
        }
    }

    @GetMapping("/requests/{studentId}")
    public List<Map<String, Object>> getStudentRequests(@PathVariable String studentId) {
        List<DocumentRequest> requests = documentRequestRepository.findByStudentId(studentId);
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (DocumentRequest req : requests) {
            Map<String, Object> reqMap = new HashMap<>();
            reqMap.put("requestId", req.getRequestId());
            reqMap.put("studentId", req.getStudentId());
            reqMap.put("documentType", req.getDocumentType());
            reqMap.put("purpose", req.getPurpose());
            reqMap.put("status", req.getStatus());
            reqMap.put("createdDate", req.getCreatedDate());
            response.add(reqMap);
        }
        
        return response;
    }

    @GetMapping("/admin/requests")
    public List<Map<String, Object>> getAllRequests() {
        List<DocumentRequest> requests = documentRequestRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (DocumentRequest req : requests) {
            Optional<Student> student = studentRepository.findByEnrollment(req.getStudentId());
            
            Map<String, Object> reqMap = new HashMap<>();
            reqMap.put("requestId", req.getRequestId());
            reqMap.put("studentId", req.getStudentId());
            reqMap.put("documentType", req.getDocumentType());
            reqMap.put("purpose", req.getPurpose());
            reqMap.put("status", req.getStatus());
            reqMap.put("createdDate", req.getCreatedDate());
            
            if (student.isPresent()) {
                Student s = student.get();
                reqMap.put("studentName", s.getName());
                reqMap.put("studentEmail", s.getEmail());
                reqMap.put("studentDepartment", s.getDepartment());
                reqMap.put("studentStatus", s.getStatus());
            }
            
            response.add(reqMap);
        }
        
        return response;
    }
}