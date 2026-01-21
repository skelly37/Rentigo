package com.rentigo.controller;

import com.rentigo.dto.PlaceDto;
import com.rentigo.dto.PlaceListDto;
import com.rentigo.dto.request.CreatePlaceRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.dto.response.PageResponse;
import com.rentigo.entity.Place;
import com.rentigo.entity.PlaceStatus;
import com.rentigo.entity.User;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.PlaceService;
import com.rentigo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@Tag(name = "Miejsca", description = "Endpointy do zarządzania miejscami noclegowymi")
public class PlaceController {
    private final PlaceService placeService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Pobierz listę aktywnych miejsc")
    public ResponseEntity<PageResponse<PlaceListDto>> getPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @CurrentUser UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size,
            sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        User currentUser = userPrincipal != null ? userPrincipal.getUser() : null;
        return ResponseEntity.ok(PageResponse.of(placeService.getActivePlaces(pageable, currentUser)));
    }

    @GetMapping("/search")
    @Operation(summary = "Wyszukaj miejsca")
    public ResponseEntity<PageResponse<PlaceListDto>> searchPlaces(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @CurrentUser UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size);
        User currentUser = userPrincipal != null ? userPrincipal.getUser() : null;
        return ResponseEntity.ok(PageResponse.of(placeService.searchPlaces(q, pageable, currentUser)));
    }

    @GetMapping("/city/{cityId}")
    @Operation(summary = "Pobierz miejsca w danym mieście")
    public ResponseEntity<PageResponse<PlaceListDto>> getPlacesByCity(
            @PathVariable Long cityId,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @CurrentUser UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size);
        User currentUser = userPrincipal != null ? userPrincipal.getUser() : null;
        return ResponseEntity.ok(PageResponse.of(placeService.getPlacesByCity(cityId, guests, checkIn, checkOut, pageable, currentUser)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Pobierz szczegóły miejsca")
    public ResponseEntity<PlaceDto> getPlace(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        Place place = placeService.findById(id);
        User currentUser = userPrincipal != null ? userPrincipal.getUser() : null;
        return ResponseEntity.ok(placeService.toDto(place, currentUser));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Dodaj nowe miejsce", description = "Wymaga roli HOST lub ADMIN")
    public ResponseEntity<PlaceDto> createPlace(
            @Valid @RequestBody CreatePlaceRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        Place place = placeService.createPlace(request, userPrincipal.getUser());
        return ResponseEntity.ok(placeService.toDto(place));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Edytuj miejsce")
    public ResponseEntity<PlaceDto> updatePlace(
            @PathVariable Long id,
            @Valid @RequestBody CreatePlaceRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        Place place = placeService.updatePlace(id, request, userPrincipal.getUser());
        return ResponseEntity.ok(placeService.toDto(place));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Zmień status miejsca")
    public ResponseEntity<ApiResponse> updatePlaceStatus(
            @PathVariable Long id,
            @RequestParam PlaceStatus status,
            @CurrentUser UserPrincipal userPrincipal) {
        placeService.updatePlaceStatus(id, status, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Status miejsca zaktualizowany"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Usuń miejsce")
    public ResponseEntity<ApiResponse> deletePlace(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        placeService.deletePlace(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Miejsce zostało usunięte"));
    }
}
