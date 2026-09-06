package com.kesproject.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentByEnrollment(String enrollment) {
        return studentRepository.findByEnrollment(enrollment);
    }
    
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }
    
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    public boolean validateStudent(String enrollment, String password) {
        Optional<Student> student = studentRepository.findByEnrollment(enrollment);
        if (student.isPresent()) {
            return student.get().getPassword().equals(password);
        }
        return false;
    }
}