package com.example.demo.controller;

import com.example.demo.model.Attendance;
import com.example.demo.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getAttendanceForEmployee(
            @PathVariable Long employeeId,
            @RequestParam String from,
            @RequestParam String to) {
        return attendanceService.getAttendanceRecords(employeeId, java.time.LocalDate.parse(from), java.time.LocalDate.parse(to));
    }

    @PostMapping
    public Attendance createAttendance(@RequestBody Attendance attendance) {
        if (attendance.getDate() == null) {
            attendance.setDate(java.time.LocalDate.now());
        }
        return attendanceService.addAttendanceRecord(attendance);
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        return attendanceService.updateAttendanceRecord(id, attendance);
    }

    // New endpoint: Get all attendance corrections (e.g., with correction statuses)
    @GetMapping("/corrections")
    public List<Attendance> getAllCorrections() {
        return attendanceService.getAttendanceCorrections();
    }

    // New endpoint: Update correction status
    @PutMapping("/corrections/{id}/status")
    public Attendance updateCorrectionStatus(@PathVariable Long id, @RequestParam String status) {
        return attendanceService.updateCorrectionStatus(id, status);
    }

    @GetMapping("/count/pending")
    public long getPendingAttendanceCount() {
        return attendanceService.getPendingAttendanceCorrectionCount();
    }
}
