package com.example.demo.service;

import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Attendance> getAttendanceRecords(Long employeeId, LocalDate from, LocalDate to) {
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);
        if (empOpt.isEmpty()) {
            throw new RuntimeException("Employee not found");
        }
        return attendanceRepository.findByEmployeeAndDateBetween(empOpt.get(), from, to);
    }

    public Attendance addAttendanceRecord(Attendance attendance) {
        if (attendance.getEmployee() == null || attendance.getEmployee().getId() == null) {
            throw new RuntimeException("Employee ID is required to save attendance.");
        }
        Optional<Employee> empOpt = employeeRepository.findById(attendance.getEmployee().getId());
        if (empOpt.isEmpty()) {
            throw new RuntimeException("Employee not found for given ID.");
        }
        attendance.setEmployee(empOpt.get());
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendanceRecord(Long id, Attendance updated) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        attendance.setCheckInTime(updated.getCheckInTime());
        attendance.setCheckOutTime(updated.getCheckOutTime());
        attendance.setStatus(updated.getStatus());
        attendance.setCorrectionNote(updated.getCorrectionNote());

        return attendanceRepository.save(attendance);
    }

    // Get all records where status is one of the correction statuses
    public List<Attendance> getAttendanceCorrections() {
        // Assuming statuses for corrections:
        List<String> correctionStatuses = List.of("CORRECTION_PENDING", "CORRECTION_APPROVED", "CORRECTION_REJECTED");
        return attendanceRepository.findByStatusIn(correctionStatuses);
    }

    public Attendance updateCorrectionStatus(Long id, String status) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        attendance.setStatus(status);
        return attendanceRepository.save(attendance);
    }

    public long getPendingAttendanceCorrectionCount() {
        // Assuming pending status is "CORRECTION_PENDING"
        return attendanceRepository.countByStatus("CORRECTION_PENDING");
    }

}

