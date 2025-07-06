package com.example.demo.repository;

import com.example.demo.model.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {

    List<Salary> findByEmployeeId(Long employeeId);

    // ✅ Fetch employee and payGrade eagerly for serialization
    @Query("SELECT s FROM Salary s JOIN FETCH s.employee e JOIN FETCH s.payGrade p")
    List<Salary> findAllWithEmployeeAndPayGrade();
}
