package com.kesproject.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class Login {

    @PostMapping("/auth/login")
    public Response login(@RequestBody Request req) {
        if ("test123".equals(req.u) && "test123".equals(req.p)) {
            return new Response("ok", "test123", "User", "student");
        }
        return new Response("fail", "", "", "");
    }

    public static class Request {
        public String u, p;
    }

    public static class Response {
        public String status, id, name, role;
        public Response(String s, String id, String n, String r) {
            this.status = s; this.id = id; this.name = n; this.role = r;
        }
    }
}