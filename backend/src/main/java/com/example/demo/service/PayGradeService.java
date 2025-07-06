package com.example.demo.service;

import com.example.demo.model.PayGrade;
import com.example.demo.repository.PayGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class PayGradeService {

    @Autowired
    private PayGradeRepository payGradeRepository;

    public List<PayGrade> getAllPayGrades() {
        return payGradeRepository.findAll();
    }

    public PayGrade createPayGrade(PayGrade payGrade) {
        return payGradeRepository.save(payGrade);
    }

    public PayGrade updatePayGrade(Long id, PayGrade updatedPayGrade) {
        Optional<PayGrade> optional = payGradeRepository.findById(id);
        if (optional.isPresent()) {
            PayGrade existing = optional.get();
            existing.setGradeName(updatedPayGrade.getGradeName());
            existing.setBaseSalary(updatedPayGrade.getBaseSalary());
            existing.setAllowance(updatedPayGrade.getAllowance());
            existing.setDeduction(updatedPayGrade.getDeduction());
            existing.setDescription(updatedPayGrade.getDescription());  // <-- Added this line
            return payGradeRepository.save(existing);
        }
        return null;
    }

    public void deletePayGrade(Long id) {
        payGradeRepository.deleteById(id);
    }

    public PayGrade getPayGradeById(Long id) {
        return payGradeRepository.findById(id).orElse(null);
    }
}
