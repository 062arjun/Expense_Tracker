package com.arj.expense_tracker.dto;

import com.arj.expense_tracker.entity.Expense;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        BigDecimal amount,
        String category,
        LocalDate expenseDate,
        String note,
        Instant createdAt,
        Instant updatedAt
) {
    public static ExpenseResponse from(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getNote(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}
