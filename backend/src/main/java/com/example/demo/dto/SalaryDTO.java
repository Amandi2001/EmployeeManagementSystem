package com.example.demo.dto;

import java.time.LocalDate;

public class SalaryDTO {
    private String employeeName;
    private String payGradeName;
    private double grossSalary;
    private double netSalary;
    private LocalDate payDate;

    public SalaryDTO(String employeeName, String payGradeName, double grossSalary, double netSalary, LocalDate payDate) {
        this.employeeName = employeeName;
        this.payGradeName = payGradeName;
        this.grossSalary = grossSalary;
        this.netSalary = netSalary;
        this.payDate = payDate;
    }

    // Getters and setters
    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getPayGradeName() {
        return payGradeName;
    }

    public void setPayGradeName(String payGradeName) {
        this.payGradeName = payGradeName;
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
