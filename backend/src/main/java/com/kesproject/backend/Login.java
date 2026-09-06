package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class Login {

    @Autowired
    private StudentService studentService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        
        // Check if admin
        if ("admin".equals(req.u) && "admin123".equals(req.p)) {
            return new LoginResponse("success", "Admin login successful", "token-admin-xyz", "admin");
        }
        
        // Check student in database
        boolean isValid = studentService.validateStudent(req.u, req.p);
        if (isValid) {
            Optional<Student> student = studentService.getStudentByEnrollment(req.u);
            if (student.isPresent()) {
                return new LoginResponse("success", "Login successful", "token-" + req.u, "student");
            }
        }
        
        return new LoginResponse("error", "Invalid credentials", "", "");
    }

    public static class LoginRequest {
        public String u;
        public String p;
    }

    public static class LoginResponse {
        public String status;
        public String message;
        public String token;
        public String role;

        public LoginResponse(String status, String message, String token, String role) {
            this.status = status;
            this.message = message;
            this.token = token;
            this.role = role;
        }
    }
}