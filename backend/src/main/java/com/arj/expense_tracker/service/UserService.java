package com.arj.expense_tracker.service;

import com.arj.expense_tracker.dto.AuthResponse;
import com.arj.expense_tracker.dto.LoginRequest;
import com.arj.expense_tracker.dto.RegisterRequest;
import com.arj.expense_tracker.dto.UserResponse;
import com.arj.expense_tracker.entity.User;
import com.arj.expense_tracker.exception.DuplicateResourceException;
import com.arj.expense_tracker.repository.UserRepository;
import com.arj.expense_tracker.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered");
        }
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);
        return new AuthResponse(jwtUtil.generateToken(saved), "Bearer", UserResponse.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = loadUserEntity(email);
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return new AuthResponse(jwtUtil.generateToken(user), "Bearer", UserResponse.from(user));
    }

    public User loadUserEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return loadUserEntity(username);
    }
}
