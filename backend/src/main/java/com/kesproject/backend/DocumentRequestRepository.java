package com.kesproject.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Long> {
    Optional<DocumentRequest> findByRequestId(String requestId);
    List<DocumentRequest> findByStudentId(String studentId);
    List<DocumentRequest> findByStatus(String status);
}