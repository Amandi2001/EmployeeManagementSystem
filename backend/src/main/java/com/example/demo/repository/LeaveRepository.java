package com.example.demo.repository;

import com.example.demo.model.Leave;
import com.example.demo.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeId(Long employeeId);

    long countByEmployeeId(Long employeeId);

    @Query("SELECT COUNT(l) FROM Leave l WHERE l.employee.id = :employeeId AND l.status = :status")
    long countByEmployeeIdAndStatus(@Param("employeeId") Long employeeId, @Param("status") LeaveStatus status);

    long countByStatus(LeaveStatus status);
}
