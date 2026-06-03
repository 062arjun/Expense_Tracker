package com.arj.expense_tracker.service;

import com.arj.expense_tracker.dto.CategorySummaryResponse;
import com.arj.expense_tracker.dto.DashboardSummaryResponse;
import com.arj.expense_tracker.dto.ExpenseRequest;
import com.arj.expense_tracker.dto.ExpenseResponse;
import com.arj.expense_tracker.dto.MonthlySummaryResponse;
import com.arj.expense_tracker.entity.Expense;
import com.arj.expense_tracker.entity.User;
import com.arj.expense_tracker.exception.ResourceNotFoundException;
import com.arj.expense_tracker.repository.ExpenseRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional
    public ExpenseResponse create(ExpenseRequest request, User user) {
        Expense expense = new Expense();
        apply(request, expense);
        expense.setUser(user);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> findAll(User user, String search, String category, LocalDate startDate, LocalDate endDate,
                                         String sortBy, String direction) {
        List<Expense> expenses = expenseRepository.findByUserOrderByExpenseDateDescIdDesc(user);
        return expenses.stream()
                .filter(expense -> matchesSearch(expense, search))
                .filter(expense -> category == null || category.isBlank()
                        || expense.getCategory().equalsIgnoreCase(category))
                .filter(expense -> startDate == null || !expense.getExpenseDate().isBefore(startDate))
                .filter(expense -> endDate == null || !expense.getExpenseDate().isAfter(endDate))
                .sorted(comparator(sortBy, direction))
                .map(ExpenseResponse::from)
                .toList();
    }

    public ExpenseResponse findById(Long id, User user) {
        return ExpenseResponse.from(getOwnedExpense(id, user));
    }

    @Transactional
    public ExpenseResponse update(Long id, ExpenseRequest request, User user) {
        Expense expense = getOwnedExpense(id, user);
        apply(request, expense);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    @Transactional
    public void delete(Long id, User user) {
        expenseRepository.delete(getOwnedExpense(id, user));
    }

    public DashboardSummaryResponse summary(User user) {
        List<Expense> expenses = expenseRepository.findByUserOrderByExpenseDateDescIdDesc(user);
        BigDecimal total = sum(expenses);
        YearMonth currentMonth = YearMonth.now();
        BigDecimal monthly = sum(expenses.stream()
                .filter(expense -> YearMonth.from(expense.getExpenseDate()).equals(currentMonth))
                .toList());
        BigDecimal average = expenses.isEmpty()
                ? BigDecimal.ZERO
                : total.divide(BigDecimal.valueOf(expenses.size()), 2, RoundingMode.HALF_UP);
        return new DashboardSummaryResponse(total, monthly, expenses.size(), average);
    }

    public List<MonthlySummaryResponse> monthly(User user) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDate start = YearMonth.now().minusMonths(11).atDay(1);
        Map<YearMonth, BigDecimal> totals = expenseRepository.findByUserOrderByExpenseDateDescIdDesc(user).stream()
                .filter(expense -> !expense.getExpenseDate().isBefore(start))
                .collect(Collectors.groupingBy(
                        expense -> YearMonth.from(expense.getExpenseDate()),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
        return start.datesUntil(YearMonth.now().plusMonths(1).atDay(1), java.time.Period.ofMonths(1))
                .map(YearMonth::from)
                .map(month -> new MonthlySummaryResponse(month.format(formatter), totals.getOrDefault(month, BigDecimal.ZERO)))
                .toList();
    }

    public List<CategorySummaryResponse> categories(User user) {
        return expenseRepository.findByUserOrderByExpenseDateDescIdDesc(user).stream()
                .collect(Collectors.groupingBy(expense -> expense.getCategory().toLowerCase(Locale.ROOT)))
                .entrySet()
                .stream()
                .map(entry -> new CategorySummaryResponse(
                        titleCase(entry.getKey()),
                        sum(entry.getValue()),
                        entry.getValue().size()
                ))
                .sorted(Comparator.comparing(CategorySummaryResponse::total).reversed())
                .toList();
    }

    public List<ExpenseResponse> recent(User user) {
        return expenseRepository.findTop5ByUserOrderByExpenseDateDescIdDesc(user).stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    private Expense getOwnedExpense(Long id, User user) {
        return expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    private void apply(ExpenseRequest request, Expense expense) {
        expense.setAmount(request.amount());
        expense.setCategory(request.category().trim());
        expense.setExpenseDate(request.expenseDate());
        expense.setNote(request.note() == null ? "" : request.note().trim());
    }

    private boolean matchesSearch(Expense expense, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }
        String value = search.toLowerCase(Locale.ROOT);
        return expense.getCategory().toLowerCase(Locale.ROOT).contains(value)
                || expense.getNote().toLowerCase(Locale.ROOT).contains(value);
    }

    private Comparator<Expense> comparator(String sortBy, String direction) {
        Comparator<Expense> comparator = "amount".equalsIgnoreCase(sortBy)
                ? Comparator.comparing(Expense::getAmount)
                : Comparator.comparing(Expense::getExpenseDate).thenComparing(Expense::getId);
        return "asc".equalsIgnoreCase(direction) ? comparator : comparator.reversed();
    }

    private BigDecimal sum(List<Expense> expenses) {
        return expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String titleCase(String input) {
        if (input.isBlank()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase(Locale.ROOT) + input.substring(1);
    }
}
