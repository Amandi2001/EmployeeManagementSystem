// LeaveSummaryDTO.java
package com.example.demo.dto;

public class LeaveSummaryDTO {
    private long totalApplied;
    private long totalApproved;

    public LeaveSummaryDTO(long totalApplied, long totalApproved) {
        this.totalApplied = totalApplied;
        this.totalApproved = totalApproved;
    }

    public long getTotalApplied() {
        return totalApplied;
    }

    public long getTotalApproved() {
        return totalApproved;
    }
}
