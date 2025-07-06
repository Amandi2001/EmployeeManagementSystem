package com.example.demo.dto;

import com.example.demo.model.Employee;

public class CombinedEmployeeUserDTO {

    private String username;
    private String password;
    private String role;
    private Employee employee;

    public CombinedEmployeeUserDTO() {}

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
