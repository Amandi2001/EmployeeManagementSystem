package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.FileStorageService;
import com.example.demo.dto.CombinedEmployeeUserDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "http://localhost:3000") // Adjust to your React frontend URL
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private FileStorageService fileStorageService;

    // ✅ Get All Employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    // ✅ Create new Employee (JSON only)
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        if (employeeRepository.findByEmailId(employee.getEmailId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Employee already exists with email: " + employee.getEmailId());
        }
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ Upload Employee with Profile Picture + Resume
    @PostMapping("/employees-with-user")
    public ResponseEntity<?> uploadEmployeeWithUser(
            @RequestPart("data") CombinedEmployeeUserDTO data,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile) {

        try {
            // Validate employee
            Employee employee = data.getEmployee();
            if (employeeRepository.findByEmailId(employee.getEmailId()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Employee already exists with email: " + employee.getEmailId());
            }

            // Save files
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profileFilename = fileStorageService.saveFile(profilePicture);
                employee.setProfilePicture(profileFilename);
            }

            if (resumeFile != null && !resumeFile.isEmpty()) {
                String resumeFilename = fileStorageService.saveFile(resumeFile);
                employee.setResumeFile(resumeFilename);
            }

            // TODO: Create and save User entity first using data.getUsername(), etc.
            // Then set the User to employee.setUser(savedUser);
            // Save employee

            Employee saved = employeeRepository.save(employee);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving employee: " + e.getMessage());
        }
    }

    // ✅ Get Employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable long id) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        return employeeOpt
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found"));
    }

    // ✅ Update Employee with Files
    @PutMapping("/{id}/upload")
    public ResponseEntity<?> updateEmployeeWithFiles(
            @PathVariable long id,
            @RequestPart("employee") Employee employeeDetails,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile) {

        try {
            Employee updateEmployee = employeeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

            if (!updateEmployee.getEmailId().equals(employeeDetails.getEmailId())) {
                Optional<Employee> emailOwner = employeeRepository.findByEmailId(employeeDetails.getEmailId());
                if (emailOwner.isPresent() && emailOwner.get().getId() != id) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Email is already used by another employee: " + employeeDetails.getEmailId());
                }
            }

            updateEmployee.setFirstName(employeeDetails.getFirstName());
            updateEmployee.setLastName(employeeDetails.getLastName());
            updateEmployee.setEmailId(employeeDetails.getEmailId());
            updateEmployee.setPhoneNumber(employeeDetails.getPhoneNumber());
            updateEmployee.setDepartment(employeeDetails.getDepartment());
            updateEmployee.setDesignation(employeeDetails.getDesignation());
            updateEmployee.setJoiningDate(employeeDetails.getJoiningDate());

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profileFilename = fileStorageService.saveFile(profilePicture);
                updateEmployee.setProfilePicture(profileFilename);
            }

            if (resumeFile != null && !resumeFile.isEmpty()) {
                String resumeFilename = fileStorageService.saveFile(resumeFile);
                updateEmployee.setResumeFile(resumeFilename);
            }

            Employee saved = employeeRepository.save(updateEmployee);
            return ResponseEntity.ok(saved);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating employee: " + ex.getMessage());
        }
    }

    // ✅ Delete Employee
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
            employeeRepository.delete(employee);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting employee: " + ex.getMessage());
        }
    }

    // ✅ Search Employees (by name, email, department, etc.)
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String emailId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation) {

        String name = null;
        if ((firstName != null && !firstName.isEmpty()) || (lastName != null && !lastName.isEmpty())) {
            name = ((firstName != null) ? firstName : "") + " " + ((lastName != null) ? lastName : "");
            name = name.trim();
        }

        List<Employee> result = employeeService.searchAndFilterEmployees(name, emailId, department, designation);
        return ResponseEntity.ok(result);
    }

    // ✅ Get Employee by User ID
    @GetMapping("/by-userid/{userId}")
    public ResponseEntity<Employee> getEmployeeByUserId(@PathVariable Long userId) {
        return employeeService.getEmployeeByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Total Employees Count
    @GetMapping("/count")
    public long getEmployeeCount() {
        return employeeRepository.count();
    }
}
