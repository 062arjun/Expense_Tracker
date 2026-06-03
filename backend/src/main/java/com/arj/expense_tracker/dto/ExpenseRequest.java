package com.arj.expense_tracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
        BigDecimal amount,

        @NotBlank(message = "Category is required")
        @Size(max = 80, message = "Category must be 80 characters or fewer")
        String category,

        @NotNull(message = "Expense date is required")
        LocalDate expenseDate,

        @Size(max = 500, message = "Note must be 500 characters or fewer")
        String note
) {}
