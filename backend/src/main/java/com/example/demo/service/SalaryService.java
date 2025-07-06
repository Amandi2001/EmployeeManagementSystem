package com.example.demo.service;

import com.example.demo.model.Employee;
import com.example.demo.model.PayGrade;
import com.example.demo.model.Salary;
import com.example.demo.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalaryService {

    @Autowired
    private SalaryRepository salaryRepository;

    public Salary generateSalary(Employee employee, PayGrade grade) {
        double gross = grade.getBaseSalary() + grade.getAllowance();
        double net = gross - grade.getDeduction();

        Salary salary = new Salary();
        salary.setEmployee(employee);
        salary.setPayGrade(grade);
        salary.setGrossSalary(gross);
        salary.setNetSalary(net);
        salary.setPayDate(LocalDate.now());

        return salaryRepository.save(salary);
    }

    // ✅ Use the eager fetch method
    public List<Salary> getAllSalaries() {
        return salaryRepository.findAllWithEmployeeAndPayGrade();
    }

    public List<Salary> getSalariesByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId);
    }

    public boolean isSalaryAlreadyGeneratedForMonth(Employee employee, LocalDate date) {
        List<Salary> salaries = salaryRepository.findByEmployeeId(employee.getId());
        for (Salary s : salaries) {
            LocalDate payDate = s.getPayDate();
            if (payDate.getYear() == date.getYear() && payDate.getMonth() == date.getMonth()) {
                return true;
            }
        }
        return false;
    }
}
