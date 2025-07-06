package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Lazy loading for optimization
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paygrade_id", nullable = false)
    private PayGrade payGrade;

    private double grossSalary;
    private double netSalary;
    private LocalDate payDate;

    // Getters and Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }
    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public PayGrade getPayGrade() {
        return payGrade;
    }
    public void setPayGrade(PayGrade payGrade) {
        this.payGrade = payGrade;
    }

    public double getGrossSalary() {
        return grossSalary;
    }
    public void setGrossSalary(double grossSalary) {
        this.grossSalary = grossSalary;
    }

    public double getNetSalary() {
        return netSalary;
    }
    public void setNetSalary(double netSalary) {
        this.netSalary = netSalary;
    }

    public LocalDate getPayDate() {
        return payDate;
    }
    public void setPayDate(LocalDate payDate) {
        this.payDate = payDate;
    }
}
