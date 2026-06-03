package com.arj.expense_tracker.dto;

public record AuthResponse(String token, String tokenType, UserResponse user) {}
