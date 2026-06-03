package com.arj.expense_tracker.controller;

import com.arj.expense_tracker.dto.CategorySummaryResponse;
import com.arj.expense_tracker.dto.DashboardSummaryResponse;
import com.arj.expense_tracker.dto.ExpenseResponse;
import com.arj.expense_tracker.dto.MonthlySummaryResponse;
import com.arj.expense_tracker.entity.User;
import com.arj.expense_tracker.service.ExpenseService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ExpenseService expenseService;

    public DashboardController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse summary(@AuthenticationPrincipal User user) {
        return expenseService.summary(user);
    }

    @GetMapping("/monthly")
    public List<MonthlySummaryResponse> monthly(@AuthenticationPrincipal User user) {
        return expenseService.monthly(user);
    }

    @GetMapping("/categories")
    public List<CategorySummaryResponse> categories(@AuthenticationPrincipal User user) {
        return expenseService.categories(user);
    }

    @GetMapping("/recent")
    public List<ExpenseResponse> recent(@AuthenticationPrincipal User user) {
        return expenseService.recent(user);
    }
}
