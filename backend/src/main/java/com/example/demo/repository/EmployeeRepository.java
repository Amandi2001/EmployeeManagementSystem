package com.example.demo.repository;

import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByFirstNameContainingIgnoreCase(String firstName);
    List<Employee> findByLastNameContainingIgnoreCase(String lastName);
    List<Employee> findByEmailIdContainingIgnoreCase(String emailId);
    List<Employee> findByDepartment(String department);
    List<Employee> findByDesignation(String designation);
    Optional<Employee> findByEmailId(String emailId);

    // ✅ For getEmployeeByUsername
    Optional<Employee> findByUser_Id(Long userId);
}

