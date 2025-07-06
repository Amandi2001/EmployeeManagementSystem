package com.example.demo.service;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Search and filter employees by various parameters
     */
    public List<Employee> searchAndFilterEmployees(
            String name, String email, String department,
            String designation
    ) {
        return employeeRepository.findAll().stream()
                .filter(emp -> name == null || name.isEmpty() ||
                        emp.getFirstName().toLowerCase().contains(name.toLowerCase()) ||
                        emp.getLastName().toLowerCase().contains(name.toLowerCase()))
                .filter(emp -> email == null || email.isEmpty() ||
                        emp.getEmailId().toLowerCase().contains(email.toLowerCase()))
                .filter(emp -> department == null || department.isEmpty() ||
                        (emp.getDepartment() != null && emp.getDepartment().equalsIgnoreCase(department)))
                .filter(emp -> designation == null || designation.isEmpty() ||
                        (emp.getDesignation() != null && emp.getDesignation().equalsIgnoreCase(designation)))
                .collect(Collectors.toList());
    }

    /**
     * Get employee by their ID
     */
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    /**
     * Get employee by associated user ID (from User entity)
     */
    public Optional<Employee> getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUser_Id(userId);
    }
}
