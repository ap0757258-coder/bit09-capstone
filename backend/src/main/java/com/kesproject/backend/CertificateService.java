package com.kesproject.backend;

import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;

@Service
public class CertificateService {
    
    public byte[] generateCertificatePDF(DocumentRequest request, String verificationCode) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        String certificateContent = "=====================================\n";
        certificateContent += "       KES SHROFF COLLEGE\n";
        certificateContent += "   CERTIFICATE OF AUTHENTICATION\n";
        certificateContent += "=====================================\n\n";
        
        certificateContent += "This is to certify that the document\n";
        certificateContent += "issued to the student is authentic and\n";
        certificateContent += "has been verified by the college.\n\n";
        
        certificateContent += "STUDENT DETAILS:\n";
        certificateContent += "Student ID: " + request.getStudentId() + "\n";
        certificateContent += "Document Type: " + request.getDocumentType() + "\n";
        certificateContent += "Request ID: " + request.getRequestId() + "\n";
        certificateContent += "Status: APPROVED\n";
        certificateContent += "Issued Date: " + java.time.LocalDate.now() + "\n\n";
        
        certificateContent += "VERIFICATION:\n";
        certificateContent += "Verification Code: " + verificationCode + "\n";
        certificateContent += "Scan QR Code: http://192.168.1.105:3000/verify/" + verificationCode + "\n\n";
        
        certificateContent += "=====================================\n";
        certificateContent += "This document is digitally signed and\n";
        certificateContent += "verified by KES SHROFF COLLEGE.\n";
        certificateContent += "Certificate ID: " + request.getRequestId() + "\n";
        certificateContent += "=====================================\n";
        
        baos.write(certificateContent.getBytes());
        return baos.toByteArray();
    }
}