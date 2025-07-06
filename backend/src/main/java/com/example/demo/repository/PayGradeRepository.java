package com.example.demo.repository;

import com.example.demo.model.PayGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayGradeRepository extends JpaRepository<PayGrade, Long> {
}
