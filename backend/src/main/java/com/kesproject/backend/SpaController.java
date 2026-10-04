package com.kesproject.backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Controller
public class SpaController {

    @Autowired
    private DocumentRequestRepository documentRequestRepository;

    @PersistenceContext
    private EntityManager em;

    // React pages
    @GetMapping({"/dashboard", "/admin"})
    public String forward() {
        return "forward:/index.html";
    }

    // QR scan page: seedha HTML, JavaScript ki zarurat nahi (phone par blank nahi aayega)
    @GetMapping(value = "/verify/{code}", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String verifyPage(@PathVariable String code) {

        Optional<DocumentRequest> found =
                documentRequestRepository.findByVerificationCode(code.trim());

        boolean valid = found.isPresent() && "approved".equals(found.get().getStatus());

        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        String color = valid ? "#059669" : "#dc2626";
        String light = valid ? "#ecfdf5" : "#fef2f2";
        String icon = valid ? "&#10003;" : "&#10005;";
        String title = valid ? "Verified Genuine" : "Not Verified";
        String message = valid
                ? "This document is genuine and issued by KES SHROFF COLLEGE."
                : "This code is not found in KES SHROFF COLLEGE records. The document may be fake.";

        StringBuilder details = new StringBuilder();

        if (valid) {
            DocumentRequest doc = found.get();

            String studentName = null;
            try {
                List<String> names = em.createQuery(
                                "select s.name from Student s where s.enrollment = :e", String.class)
                        .setParameter("e", doc.getStudentId())
                        .setMaxResults(1)
                        .getResultList();
                if (!names.isEmpty()) {
                    studentName = names.get(0);
                }
            } catch (Exception ignored) {
            }

            details.append("<h3>Document Details</h3>");
            if (studentName != null) {
                details.append(row("Student Name", studentName));
            }
            details.append(row("Enrollment No.", doc.getStudentId()));
            details.append(row("Document Type", doc.getDocumentType()));
            details.append(row("Request ID", doc.getRequestId()));
            String date = doc.getCreatedDate() == null ? "" : doc.getCreatedDate();
            if (date.length() > 10) {
                date = date.substring(0, 10);
            }
            details.append(row("Request Date", date));
            details.append(row("Document on Record", doc.getFileName() != null ? "Yes" : "Pending"));
            details.append("<div class=\"stamp\">Verified by KES SHROFF COLLEGE<br><span>Checked on ")
                    .append(esc(now)).append("</span></div>");
        } else {
            details.append("<div class=\"stamp\">Please contact the college office to confirm this document.</div>");
        }

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang=\"en\"><head>")
            .append("<meta charset=\"UTF-8\">")
            .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">")
            .append("<title>DocVerify - KES SHROFF COLLEGE</title>")
            .append("<style>")
            .append("*{box-sizing:border-box}")
            .append("body{margin:0;min-height:100vh;font-family:Arial,Helvetica,sans-serif;")
            .append("background:linear-gradient(135deg,#667eea,#764ba2);padding:20px 14px;}")
            .append(".wrap{max-width:520px;margin:0 auto}")
            .append(".head{text-align:center;color:#fff;margin-bottom:18px}")
            .append(".head h1{margin:0;font-size:26px}")
            .append(".head p{margin:6px 0 0;color:#e0e7ff;font-size:14px}")
            .append(".card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}")
            .append(".banner{background:").append(color).append(";padding:28px 20px;text-align:center;color:#fff}")
            .append(".circle{width:72px;height:72px;border-radius:50%;background:#fff;color:").append(color)
            .append(";font-size:40px;font-weight:700;line-height:72px;margin:0 auto 14px}")
            .append(".banner h2{margin:0;font-size:24px}")
            .append(".banner p{margin:8px 0 0;font-size:15px;opacity:.95}")
            .append(".body{padding:20px}")
            .append("h3{margin:0 0 6px;font-size:16px;color:#111827}")
            .append(".row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #f3f4f6}")
            .append(".row .l{color:#6b7280;font-size:14px}")
            .append(".row .v{color:#111827;font-weight:700;font-size:15px;text-align:right;word-break:break-word}")
            .append(".stamp{background:").append(light).append(";border:2px solid ").append(color)
            .append(";color:").append(color)
            .append(";border-radius:12px;padding:14px;margin-top:18px;font-weight:700;font-size:15px}")
            .append(".stamp span{font-weight:400;font-size:13px}")
            .append(".code{padding:0 20px 20px}")
            .append(".code p{margin:0 0 4px;color:#6b7280;font-size:12px}")
            .append(".code div{font-family:monospace;font-size:13px;color:#111827;word-break:break-all}")
            .append(".foot{text-align:center;color:#e0e7ff;font-size:12px;margin-top:16px}")
            .append("</style></head><body><div class=\"wrap\">")
            .append("<div class=\"head\"><h1>DocVerify</h1>")
            .append("<p>KES SHROFF COLLEGE &bull; Document Verification</p></div>")
            .append("<div class=\"card\">")
            .append("<div class=\"banner\"><div class=\"circle\">").append(icon).append("</div>")
            .append("<h2>").append(title).append("</h2><p>").append(esc(message)).append("</p></div>")
            .append("<div class=\"body\">").append(details).append("</div>")
            .append("<div class=\"code\"><p>Verification Code</p><div>").append(esc(code)).append("</div></div>")
            .append("</div>")
            .append("<div class=\"foot\">Secure &bull; Verified &bull; Mobile Ready</div>")
            .append("</div></body></html>");

        return html.toString();
    }

    private String row(String label, String value) {
        return "<div class=\"row\"><span class=\"l\">" + esc(label)
                + "</span><span class=\"v\">" + esc(value) + "</span></div>";
    }

    // HTML mein khatarnak characters ko safe banata hai
    private String esc(String s) {
        if (s == null) {
            return "";
        }
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}