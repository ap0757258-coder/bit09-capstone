package com.kesproject.backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public")
@CrossOrigin("*")
public class PublicVerificationAPI {

    @Autowired
    private DocumentRequestRepository documentRequestRepository;

    @PersistenceContext
    private EntityManager em;

    @GetMapping("/verify/{code}")
    public Map<String, Object> verify(@PathVariable String code) {
        Map<String, Object> res = new LinkedHashMap<>();

        Optional<DocumentRequest> found =
                documentRequestRepository.findByVerificationCode(code.trim());

        if (found.isEmpty() || !"approved".equals(found.get().getStatus())) {
            res.put("status", "invalid");
            res.put("message", "This code is not found in KES SHROFF COLLEGE records. The document may be fake.");
            return res;
        }

        DocumentRequest doc = found.get();

        res.put("status", "valid");
        res.put("message", "This document is genuine and issued by KES SHROFF COLLEGE.");
        res.put("requestId", doc.getRequestId());
        res.put("documentType", doc.getDocumentType());
        res.put("enrollment", doc.getStudentId());
        res.put("requestDate", doc.getCreatedDate());
        res.put("documentOnRecord", doc.getFileName() != null);
        res.put("verifiedAt", LocalDateTime.now().toString());

        // Student ka naam (nahi mila to skip)
        try {
            List<String> names = em.createQuery(
                            "select s.name from Student s where s.enrollment = :e", String.class)
                    .setParameter("e", doc.getStudentId())
                    .setMaxResults(1)
                    .getResultList();
            if (!names.isEmpty()) {
                res.put("studentName", names.get(0));
            }
        } catch (Exception ignored) {
        }

        return res;
    }
}