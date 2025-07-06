package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.model.PayGrade;
import com.example.demo.model.Salary;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.PayGradeService;
import com.example.demo.service.SalaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.SalaryRepository;
import com.example.demo.dto.SalaryDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/salaries")
@CrossOrigin(origins = "http://localhost:3000")
public class SalaryController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PayGradeService payGradeService;

    @Autowired
    private SalaryService salaryService;

    @Autowired
    private SalaryRepository salaryRepository;

    @PostMapping("/generate")
    public Salary generateSalary(@RequestParam Long employeeId, @RequestParam Long payGradeId) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        PayGrade payGrade = payGradeService.getPayGradeById(payGradeId);

        if (employee != null && payGrade != null) {
            return salaryService.generateSalary(employee, payGrade);
        }

        throw new RuntimeException("Invalid employee or pay grade");
    }

    @GetMapping("/employee/{id}")
    public List<SalaryDTO> getSalariesByEmployeeId(@PathVariable Long id) {
        List<Salary> salaries = salaryRepository.findByEmployeeId(id);

        return salaries.stream().map(s -> new SalaryDTO(
                s.getEmployee().getFirstName() + " " + s.getEmployee().getLastName(),
                s.getPayGrade().getGradeName(),
                s.getGrossSalary(),
                s.getNetSalary(),
                s.getPayDate()
        )).collect(Collectors.toList());
    }

    @GetMapping
    public List<SalaryDTO> getAllSalaries() {
        List<Salary> salaries = salaryService.getAllSalaries();

        return salaries.stream().map(s -> new SalaryDTO(
                s.getEmployee().getFirstName() + " " + s.getEmployee().getLastName(),
                s.getPayGrade().getGradeName(),
                s.getGrossSalary(),
                s.getNetSalary(),
                s.getPayDate()
        )).collect(Collectors.toList());
    }
}
