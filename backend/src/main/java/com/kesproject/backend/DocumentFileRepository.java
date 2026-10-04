package com.kesproject.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentFileRepository extends JpaRepository<DocumentFile, Long> {
    Optional<DocumentFile> findByRequestId(String requestId);
}
