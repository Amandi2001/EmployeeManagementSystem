package com.example.demo.controller;

import com.example.demo.dto.CombinedEmployeeUserDTO;
import com.example.demo.model.Employee;
import com.example.demo.model.User;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.FileStorageService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000") // adjust your frontend URL
public class CombinedController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/employees-with-user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEmployeeWithUser(
            @RequestPart("data") String jsonData,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile
    ) {
        try {
            CombinedEmployeeUserDTO dto = objectMapper.readValue(jsonData, CombinedEmployeeUserDTO.class);

            if (userService.existsByUsername(dto.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
            }

            // Save User with encoded password
            User newUser = new User();
            newUser.setUsername(dto.getUsername());
            newUser.setPassword(dto.getPassword());
            newUser.setRole(dto.getRole());
            User savedUser = userService.registerUser(newUser);  // save and get saved entity

            // Prepare Employee and link User entity (not username string)
            Employee employee = dto.getEmployee();
            employee.setUser(savedUser);  // Link employee to User

            // Save files and set filenames to employee fields
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profilePicFilename = fileStorageService.saveFile(profilePicture);
                employee.setProfilePicture("uploads/" + profilePicFilename); // save relative path
            }
            if (resumeFile != null && !resumeFile.isEmpty()) {
                String resumeFilename = fileStorageService.saveFile(resumeFile);
                employee.setResumeFile("uploads/" + resumeFilename);
            }

            employeeRepository.save(employee);

            return ResponseEntity.status(HttpStatus.CREATED).body("Employee and User created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request or data");
        }
    }
}
