package com.kesproject.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final StudentRepository studentRepository;
    
    public DataInitializer(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            // CURRENT STUDENTS (6)
            
            Student s1 = new Student();
            s1.setEnrollment("TDIT065A");
            s1.setName("AADITI KUMAR KIRITBHAI PATEL");
            s1.setPassword("TDIT065A");
            s1.setDepartment("B.Sc IT");
            s1.setSemester("TY IT A");
            s1.setEmail("aaditi@kesproject.edu");
            s1.setStatus("current");
            studentRepository.save(s1);
            
            Student s2 = new Student();
            s2.setEnrollment("TDIT069A");
            s2.setName("PALAK HARISH PRAJAPATI");
            s2.setPassword("TDIT069A");
            s2.setDepartment("B.Sc IT");
            s2.setSemester("TY IT A");
            s2.setEmail("palak@kesproject.edu");
            s2.setStatus("current");
            studentRepository.save(s2);
            
            Student s3 = new Student();
            s3.setEnrollment("TDIT055A");
            s3.setName("JANVI MUKESH PADIA");
            s3.setPassword("TDIT055A");
            s3.setDepartment("B.Sc IT");
            s3.setSemester("TY IT");
            s3.setEmail("janvi@kesproject.edu");
            s3.setStatus("current");
            studentRepository.save(s3);
            
            Student s4 = new Student();
            s4.setEnrollment("TDIT049A");
            s4.setName("JANHVI MISHRA");
            s4.setPassword("TDIT049A");
            s4.setDepartment("B.Sc IT");
            s4.setSemester("TY IT A");
            s4.setEmail("janhvi@kesproject.edu");
            s4.setStatus("current");
            studentRepository.save(s4);
            
            // USER PROVIDED STUDENTS (2)
            
            Student s5 = new Student();
            s5.setEnrollment("TDBMS041");
            s5.setName("ANSH K PATEL");
            s5.setPassword("TDBMS041");
            s5.setDepartment("BMS");
            s5.setSemester("TY BMS");
            s5.setEmail("anshpatel@gmail.com");
            s5.setStatus("current");
            studentRepository.save(s5);
            
            Student s6 = new Student();
            s6.setEnrollment("TDIT033");
            s6.setName("PRATIK K PATEL");
            s6.setPassword("TDIT033");
            s6.setDepartment("B.Sc IT");
            s6.setSemester("TY IT");
            s6.setEmail("pratikpatel@gmail.com");
            s6.setStatus("current");
            studentRepository.save(s6);
            
            // ALUMNI STUDENTS (4)
            
            Student s7 = new Student();
            s7.setEnrollment("TDMMC0050");
            s7.setName("KRISHNA CHETAN SOLANKI");
            s7.setPassword("TDMMC0050");
            s7.setDepartment("B.A MMC");
            s7.setSemester("Graduated 2023");
            s7.setEmail("krishna@kesproject.edu");
            s7.setStatus("alumni");
            studentRepository.save(s7);
            
            Student s8 = new Student();
            s8.setEnrollment("TDIT032");
            s8.setName("RAHUL SHARMA");
            s8.setPassword("TDIT032");
            s8.setDepartment("B.Sc IT");
            s8.setSemester("Graduated 2022");
            s8.setEmail("rahul.sharma@kesproject.edu");
            s8.setStatus("alumni");
            studentRepository.save(s8);
            
            Student s9 = new Student();
            s9.setEnrollment("TDBCOM025");
            s9.setName("PRIYA VERMA");
            s9.setPassword("TDBCOM025");
            s9.setDepartment("B.Com");
            s9.setSemester("Graduated 2023");
            s9.setEmail("priya.verma@kesproject.edu");
            s9.setStatus("alumni");
            studentRepository.save(s9);
            
            Student s10 = new Student();
            s10.setEnrollment("TDSC015");
            s10.setName("AMIT KUMAR");
            s10.setPassword("TDSC015");
            s10.setDepartment("B.Sc");
            s10.setSemester("Graduated 2021");
            s10.setEmail("amit.kumar@kesproject.edu");
            s10.setStatus("alumni");
            studentRepository.save(s10);
            
            System.out.println("✅ Database initialized with 10 students (6 current, 4 alumni)!");
        }
    }
}