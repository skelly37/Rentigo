package com.rentigo.controller;

import com.rentigo.dto.ReservationDto;
import com.rentigo.dto.request.CreateReservationRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.entity.Reservation;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.ReservationService;
import com.rentigo.util.PermissionChecker;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Rezerwacje", description = "Zarządzanie rezerwacjami")
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping
    @Operation(summary = "Pobierz moje rezerwacje")
    public ResponseEntity<List<ReservationDto>> getMyReservations(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getUserReservations(userPrincipal.getUser()));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Pobierz nadchodzące rezerwacje")
    public ResponseEntity<List<ReservationDto>> getUpcomingReservations(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getUpcomingReservations(userPrincipal.getUser()));
    }

    @GetMapping("/past")
    @Operation(summary = "Pobierz zakończone rezerwacje")
    public ResponseEntity<List<ReservationDto>> getPastReservations(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getPastReservations(userPrincipal.getUser()));
    }

    @GetMapping("/cancelled")
    @Operation(summary = "Pobierz anulowane rezerwacje")
    public ResponseEntity<List<ReservationDto>> getCancelledReservations(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getCancelledReservations(userPrincipal.getUser()));
    }

    @GetMapping("/host")
    @Operation(summary = "Pobierz rezerwacje moich miejsc (jako gospodarz)")
    public ResponseEntity<List<ReservationDto>> getHostReservations(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getHostReservations(userPrincipal.getUser()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Pobierz szczegóły rezerwacji")
    public ResponseEntity<ReservationDto> getReservation(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        Reservation reservation = reservationService.findById(id);
        PermissionChecker.checkReservationAccess(userPrincipal.getUser(), reservation);
        return ResponseEntity.ok(reservationService.toDto(reservation));
    }

    @PostMapping
    @Operation(summary = "Utwórz nową rezerwację")
    public ResponseEntity<ReservationDto> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        Reservation reservation = reservationService.createReservation(request, userPrincipal.getUser());
        return ResponseEntity.ok(reservationService.toDto(reservation));
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Potwierdź rezerwację (dla gospodarza)")
    public ResponseEntity<ReservationDto> confirmReservation(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        Reservation reservation = reservationService.confirmReservation(id, userPrincipal.getUser());
        return ResponseEntity.ok(reservationService.toDto(reservation));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Anuluj rezerwację")
    public ResponseEntity<ReservationDto> cancelReservation(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        Reservation reservation = reservationService.cancelReservation(id, userPrincipal.getUser());
        return ResponseEntity.ok(reservationService.toDto(reservation));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Usuń rezerwację (tylko admin)")
    public ResponseEntity<ApiResponse> deleteReservation(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        reservationService.deleteReservation(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Rezerwacja usunięta"));
    }
}
