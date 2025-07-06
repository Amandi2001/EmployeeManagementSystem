package com.example.demo.service;

import com.example.demo.dto.LeaveStatsDTO;
import com.example.demo.model.LeaveStatus;
import com.example.demo.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    public LeaveStatsDTO getLeaveStatsByEmployeeId(Long employeeId) {
        long appliedCount = leaveRepository.countByEmployeeId(employeeId);
        long approvedCount = leaveRepository.countByEmployeeIdAndStatus(employeeId, LeaveStatus.APPROVED);
        return new LeaveStatsDTO(appliedCount, approvedCount);
    }
}
