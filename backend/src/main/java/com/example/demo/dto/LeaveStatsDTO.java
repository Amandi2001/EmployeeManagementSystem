package com.example.demo.dto;

public class LeaveStatsDTO {
    private long leavesApplied;
    private long leavesApproved;

    public LeaveStatsDTO(long leavesApplied, long leavesApproved) {
        this.leavesApplied = leavesApplied;
        this.leavesApproved = leavesApproved;
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
