package com.example.demo.controller;

import com.example.demo.model.PayGrade;
import com.example.demo.service.PayGradeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paygrades")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend requests
public class PayGradeController {

    @Autowired
    private PayGradeService payGradeService;

    // Get all pay grades
    @GetMapping
    public List<PayGrade> getAllPayGrades() {
        return payGradeService.getAllPayGrades();
    }

    // Get pay grade by ID (optional, but useful)
    @GetMapping("/{id}")
    public ResponseEntity<PayGrade> getPayGradeById(@PathVariable Long id) {
        PayGrade payGrade = payGradeService.getPayGradeById(id);
        if (payGrade != null) {
            return ResponseEntity.ok(payGrade);
        }
        return ResponseEntity.notFound().build();
    }

    // Create a new pay grade
    @PostMapping
    public ResponseEntity<PayGrade> createPayGrade(@RequestBody PayGrade payGrade) {
        PayGrade createdPayGrade = payGradeService.createPayGrade(payGrade);
        return ResponseEntity.ok(createdPayGrade);
    }

    // Update existing pay grade by ID
    @PutMapping("/{id}")
    public ResponseEntity<PayGrade> updatePayGrade(@PathVariable Long id, @RequestBody PayGrade updatedPayGrade) {
        PayGrade payGrade = payGradeService.updatePayGrade(id, updatedPayGrade);
        if (payGrade != null) {
            return ResponseEntity.ok(payGrade);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete pay grade by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayGrade(@PathVariable Long id) {
        payGradeService.deletePayGrade(id);
        return ResponseEntity.noContent().build();
    }
}
