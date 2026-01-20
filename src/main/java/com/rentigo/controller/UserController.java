package com.rentigo.controller;

import com.rentigo.dto.UserDto;
import com.rentigo.dto.request.UpdateUserRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.entity.User;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Użytkownicy", description = "Zarządzanie profilem użytkownika")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Pobierz profil zalogowanego użytkownika")
    public ResponseEntity<UserDto> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId());
        return ResponseEntity.ok(userService.toDto(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Aktualizuj profil użytkownika")
    public ResponseEntity<UserDto> updateCurrentUser(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(userPrincipal.getId(), request);
        return ResponseEntity.ok(userService.toDto(user));
    }

    @PostMapping("/me/upgrade-to-host")
    @Operation(summary = "Uzyskaj status gospodarza")
    public ResponseEntity<ApiResponse> upgradeToHost(@CurrentUser UserPrincipal userPrincipal) {
        userService.upgradeToHost(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Uzyskano status gospodarza"));
    }
}
