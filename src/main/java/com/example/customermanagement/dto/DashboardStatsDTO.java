package com.example.customermanagement.dto;

public class DashboardStatsDTO {

    private long totalCustomers;
    private long activeCustomers;
    private long inactiveCustomers;
    private long individualCustomers;
    private long businessCustomers;

    public DashboardStatsDTO(long totalCustomers, long activeCustomers, long inactiveCustomers, long individualCustomers, long businessCustomers) {
        this.totalCustomers = totalCustomers;
        this.activeCustomers = activeCustomers;
        this.inactiveCustomers = inactiveCustomers;
        this.individualCustomers = individualCustomers;
        this.businessCustomers = businessCustomers;
    }

    // Getters only, as this data is calculated by the backend and shouldn't be modified
    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getActiveCustomers() {
        return activeCustomers;
    }

    public long getInactiveCustomers() {
        return inactiveCustomers;
    }

    public long getIndividualCustomers() {
        return individualCustomers;
    }

    public long getBusinessCustomers() {
        return businessCustomers;
    }
}