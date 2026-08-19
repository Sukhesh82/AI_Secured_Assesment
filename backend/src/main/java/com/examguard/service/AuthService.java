package com.examguard.service;

import com.examguard.dto.AuthRequest;
import com.examguard.dto.AuthResponse;
import com.examguard.dto.RegisterRequest;
import com.examguard.entity.User;
import com.examguard.entity.enums.Role;
import com.examguard.exception.BadRequestException;
import com.examguard.repository.UserRepository;
import com.examguard.security.JwtTokenProvider;
import com.examguard.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuditService auditService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.STUDENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .studentId(request.getStudentId())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        auditService.logAction(savedUser.getId(), "USER_REGISTERED", "Registered user: " + savedUser.getEmail() + " with role " + savedUser.getRole(), null, null);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .studentId(savedUser.getStudentId())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        auditService.logAction(userPrincipal.getId(), "USER_LOGIN", "User logged in: " + userPrincipal.getEmail(), null, null);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(userPrincipal.getId())
                .name(userPrincipal.getName())
                .email(userPrincipal.getEmail())
                .role(userPrincipal.getRole())
                .studentId(userPrincipal.getStudentId())
                .build();
    }
}
