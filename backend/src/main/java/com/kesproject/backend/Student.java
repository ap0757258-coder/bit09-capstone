package com.kesproject.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String enrollment;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String semester;
    
    @Column(nullable = false)
    private String email;
    
    // Constructors
    public Student() {}
    
    public Student(String enrollment, String name, String password, String department, String semester, String email) {
        this.enrollment = enrollment;
        this.name = name;
        this.password = password;
        this.department = department;
        this.semester = semester;
        this.email = email;
    }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEnrollment() { return enrollment; }
    public void setEnrollment(String enrollment) { this.enrollment = enrollment; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}