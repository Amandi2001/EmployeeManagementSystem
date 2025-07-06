package com.example.demo.controller;

import com.example.demo.dto.LeaveSummaryDTO;
import com.example.demo.model.Employee;
import com.example.demo.model.Leave;
import com.example.demo.model.LeaveStatus;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.LeaveRepository;
import com.example.demo.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveController {

    @Autowired
    private LeaveRepository leaveRepo;

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Apply leave with Employee reference (you must send employeeId in request body)
    @PostMapping("/apply")
    public Leave applyLeave(@RequestBody Map<String, Object> payload) {
        // Extract fields from the payload
        Long employeeId = Long.valueOf(payload.get("employeeId").toString());
        String leaveType = (String) payload.get("leaveType");
        String reason = (String) payload.get("reason");
        String contactDuringLeave = (String) payload.get("contactDuringLeave");
        String fromDateStr = (String) payload.get("fromDate");
        String toDateStr = (String) payload.get("toDate");

        if (employeeId == null || leaveType == null || reason == null || fromDateStr == null || toDateStr == null) {
            throw new RuntimeException("Missing required leave fields.");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));

        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setLeaveType(leaveType);
        leave.setReason(reason);
        leave.setContactDuringLeave(contactDuringLeave);
        leave.setFromDate(java.time.LocalDate.parse(fromDateStr));
        leave.setToDate(java.time.LocalDate.parse(toDateStr));
        leave.setStatus(LeaveStatus.PENDING);

        return leaveRepo.save(leave);
    }

    // Get all leaves of an employee by employeeId
    @GetMapping("/user/{employeeId}")
    public List<Leave> getUserLeaves(@PathVariable Long employeeId) {
        return leaveRepo.findByEmployeeId(employeeId);
    }

    // Update leave status
    @PutMapping("/update-status/{id}")
    public Leave updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        LeaveStatus status;
        try {
            status = LeaveStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr);
        }
        Leave leave = leaveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found with ID: " + id));
        leave.setStatus(status);
        return leaveRepo.save(leave);
    }

    // Get all leaves in the system
    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveRepo.findAll();
    }

    // Get leave summary by employeeId (total applied and approved)
    @GetMapping("/summary/{employeeId}")
    public LeaveSummaryDTO getLeaveSummary(@PathVariable Long employeeId) {
        long applied = leaveRepo.countByEmployeeId(employeeId);
        long approved = leaveRepo.countByEmployeeIdAndStatus(employeeId, LeaveStatus.APPROVED);
        return new LeaveSummaryDTO(applied, approved);
    }

    // Total leave requests in system
    @GetMapping("/count")
    public long getTotalLeaveRequests() {
        return leaveRepo.count();
    }

    // Pending leave requests count
    @GetMapping("/count/pending")
    public long getPendingLeaveRequests() {
        return leaveRepo.countByStatus(LeaveStatus.PENDING);
    }

    // Approved leave requests count
    @GetMapping("/count/approved")
    public long getApprovedLeaveCount() {
        return leaveRepo.countByStatus(LeaveStatus.APPROVED);
    }
}
