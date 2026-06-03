package com.arj.expense_tracker.dto;

import java.math.BigDecimal;

public record MonthlySummaryResponse(String month, BigDecimal total) {}
