package com.arj.expense_tracker.repository;

import com.arj.expense_tracker.entity.Expense;
import com.arj.expense_tracker.entity.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByExpenseDateDescIdDesc(User user);
    List<Expense> findTop5ByUserOrderByExpenseDateDescIdDesc(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);
    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(User user, LocalDate start, LocalDate end);
}
