package com.arj.expense_tracker.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal totalExpenses,
        BigDecimal monthlyExpenses,
        long transactionCount,
        BigDecimal averageExpense
) {}
