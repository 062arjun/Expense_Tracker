package com.arj.expense_tracker.dto;

import java.math.BigDecimal;

public record CategorySummaryResponse(String category, BigDecimal total, long count) {}
