package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class Login {

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        if ("test123".equals(req.u) && "test123".equals(req.p)) {
            return new LoginResponse("success", "Login successful", "token-test123-abc", "student");
        }
        if ("admin".equals(req.u) && "admin123".equals(req.p)) {
            return new LoginResponse("success", "Admin login successful", "token-admin-xyz", "admin");
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