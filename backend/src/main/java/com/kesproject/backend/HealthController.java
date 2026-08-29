package com.kesproject.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("Backend is running", "v1.0.0", "KES SHROFF");
    }

    public static class HealthResponse {
        public String message;
        public String version;
        public String application;

        public HealthResponse(String message, String version, String application) {
            this.message = message;
            this.version = version;
            this.application = application;
        }
    }
}