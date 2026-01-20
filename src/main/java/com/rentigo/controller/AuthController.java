package com.rentigo.controller;

import com.rentigo.dto.request.LoginRequest;
import com.rentigo.dto.request.RegisterRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.dto.response.AuthResponse;
import com.rentigo.entity.User;
import com.rentigo.security.JwtTokenProvider;
import com.rentigo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autoryzacja", description = "Endpointy do logowania i rejestracji")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Logowanie użytkownika", description = "Zwraca token JWT po pomyślnym logowaniu")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userService.findByEmail(request.getEmail());

        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwt)
            .type("Bearer")
            .user(userService.toDto(user))
            .build());
    }

    @PostMapping("/register")
    @Operation(summary = "Rejestracja nowego użytkownika")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.createUser(request);
        String jwt = tokenProvider.generateToken(user.getId());

        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwt)
            .type("Bearer")
            .user(userService.toDto(user))
            .build());
    }

    @GetMapping("/check")
    @Operation(summary = "Sprawdzenie czy email jest dostępny")
    public ResponseEntity<ApiResponse> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(ApiResponse.builder()
            .success(true)
            .data(!exists)
            .message(exists ? "Email jest już zajęty" : "Email jest dostępny")
            .build());
    }
}
