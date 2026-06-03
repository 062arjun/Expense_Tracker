package com.arj.expense_tracker.dto;

import com.arj.expense_tracker.entity.Role;
import com.arj.expense_tracker.entity.User;

public record UserResponse(Long id, String name, String email, Role role) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
