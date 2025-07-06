package com.example.demo.dto;

import com.example.demo.model.Employee;

public class EmployeeWithLeaveStats {
    private Employee employee;
    private long leavesApplied;
    private long leavesApproved;

    public EmployeeWithLeaveStats(Employee employee, long leavesApplied, long leavesApproved) {
        this.employee = employee;
        this.leavesApplied = leavesApplied;
        this.leavesApproved = leavesApproved;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public long getLeavesApplied() {
        return leavesApplied;
    }

    public void setLeavesApplied(long leavesApplied) {
        this.leavesApplied = leavesApplied;
    }

    public long getLeavesApproved() {
        return leavesApproved;
    }

    public void setLeavesApproved(long leavesApproved) {
        this.leavesApproved = leavesApproved;
    }
}
