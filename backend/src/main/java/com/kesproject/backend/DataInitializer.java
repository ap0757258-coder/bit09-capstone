package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private StudentService studentService;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize 5 students if not exist
        initializeStudent("TDIT065A", "AADITI KUMAR KIRITBHAI PATEL", "TDIT065A", "B.Sc IT", "TY IT A", "aaditi@kesstudent.ac.in");
        initializeStudent("TDIT069A", "PALAK HARISH PRAJAPATI", "TDIT069A", "B.Sc IT", "TY IT A", "palak@kesstudent.ac.in");
        initializeStudent("TDMMC0050", "KRISHNA CHETAN SOLANKI", "TDMMC0050", "B.A MMC", "TY MMC", "krishna@kesstudent.ac.in");
        initializeStudent("TDIT055A", "JANVI MUKESH PADIA", "TDIT055A", "B.Sc IT", "TY IT", "janvi@kesstudent.ac.in");
        initializeStudent("TDIT049A", "JANHVI MISHRA", "TDIT049A", "B.Sc IT", "TY IT A", "janhvi@kesstudent.ac.in");
        
        System.out.println("✅ Database initialized with 5 students!");
    }
    
    private void initializeStudent(String enrollment, String name, String password, String department, String semester, String email) {
        Optional<Student> existing = studentService.getStudentByEnrollment(enrollment);
        if (existing.isEmpty()) {
            Student student = new Student(enrollment, name, password, department, semester, email);
            studentService.saveStudent(student);
            System.out.println("✅ Student created: " + name);
        }
    }
}