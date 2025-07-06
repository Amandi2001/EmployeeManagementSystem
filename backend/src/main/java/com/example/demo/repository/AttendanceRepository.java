package com.example.demo.repository;

import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeAndDateBetween(Employee employee, LocalDate from, LocalDate to);

    List<Attendance> findByStatusIn(List<String> statuses);

    // New method to get count by status
    long countByStatus(String status);
}