package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin("*")
public class ConfigAPI {

    // application.properties ki app.public-url wali line yahan aati hai
    @Value("${app.public-url:}")
    private String publicUrl;

    @GetMapping
    public Map<String, String> getConfig() {
        Map<String, String> res = new HashMap<>();
        String url = publicUrl == null ? "" : publicUrl.trim();
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        res.put("publicUrl", url);
        return res;
    }
}