package com.rentigo.controller;

import com.rentigo.dto.PlaceListDto;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Ulubione", description = "Zarządzanie ulubionymi miejscami")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping
    @Operation(summary = "Pobierz ulubione miejsca")
    public ResponseEntity<List<PlaceListDto>> getFavorites(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userPrincipal.getUser()));
    }

    @GetMapping("/{placeId}/check")
    @Operation(summary = "Sprawdź czy miejsce jest w ulubionych")
    public ResponseEntity<ApiResponse> checkFavorite(
            @PathVariable Long placeId,
            @CurrentUser UserPrincipal userPrincipal) {
        boolean isFavorite = favoriteService.isFavorite(userPrincipal.getUser(), placeId);
        return ResponseEntity.ok(ApiResponse.builder()
            .success(true)
            .data(isFavorite)
            .build());
    }

    @PostMapping("/{placeId}")
    @Operation(summary = "Dodaj do ulubionych")
    public ResponseEntity<ApiResponse> addFavorite(
            @PathVariable Long placeId,
            @CurrentUser UserPrincipal userPrincipal) {
        favoriteService.addFavorite(userPrincipal.getUser(), placeId);
        return ResponseEntity.ok(ApiResponse.success("Dodano do ulubionych"));
    }

    @DeleteMapping("/{placeId}")
    @Operation(summary = "Usuń z ulubionych")
    public ResponseEntity<ApiResponse> removeFavorite(
            @PathVariable Long placeId,
            @CurrentUser UserPrincipal userPrincipal) {
        favoriteService.removeFavorite(userPrincipal.getUser(), placeId);
        return ResponseEntity.ok(ApiResponse.success("Usunięto z ulubionych"));
    }

    @PostMapping("/{placeId}/toggle")
    @Operation(summary = "Przełącz status ulubionego")
    public ResponseEntity<ApiResponse> toggleFavorite(
            @PathVariable Long placeId,
            @CurrentUser UserPrincipal userPrincipal) {
        boolean added = favoriteService.toggleFavorite(userPrincipal.getUser(), placeId);
        return ResponseEntity.ok(ApiResponse.builder()
            .success(true)
            .message(added ? "Dodano do ulubionych" : "Usunięto z ulubionych")
            .data(added)
            .build());
    }
}
