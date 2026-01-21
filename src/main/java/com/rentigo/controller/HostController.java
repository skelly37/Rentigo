package com.rentigo.controller;

import com.rentigo.dto.HostStatsDto;
import com.rentigo.dto.PlaceListDto;
import com.rentigo.dto.ReservationDto;
import com.rentigo.entity.PlaceStatus;
import com.rentigo.repository.PlaceRepository;
import com.rentigo.repository.ReviewRepository;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.PlaceService;
import com.rentigo.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/host")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Panel gospodarza", description = "Endpointy dla gospodarzy")
public class HostController {
    private final PlaceService placeService;
    private final ReservationService reservationService;
    private final PlaceRepository placeRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping("/places")
    @Operation(summary = "Pobierz moje miejsca")
    public ResponseEntity<List<PlaceListDto>> getMyPlaces(@CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(placeService.getPlacesByOwner(userPrincipal.getUser()));
    }

    @GetMapping("/places/{placeId}/reservations")
    @Operation(summary = "Pobierz rezerwacje dla miejsca")
    public ResponseEntity<List<ReservationDto>> getPlaceReservations(
            @PathVariable Long placeId,
            @CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(reservationService.getPlaceReservations(placeId, userPrincipal.getUser()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Pobierz statystyki gospodarza")
    public ResponseEntity<HostStatsDto> getHostStats(@CurrentUser UserPrincipal userPrincipal) {
        long activePlaces = placeRepository.countByOwnerAndStatus(userPrincipal.getUser(), PlaceStatus.ACTIVE);
        long monthlyReservations = reservationService.countMonthlyReservations(userPrincipal.getUser());
        BigDecimal monthlyRevenue = reservationService.getMonthlyRevenue(userPrincipal.getUser());
        BigDecimal averageRating = reviewRepository.calculateAverageRatingForOwner(userPrincipal.getUser());

        return ResponseEntity.ok(HostStatsDto.builder()
            .activePlaces(activePlaces)
            .monthlyReservations(monthlyReservations)
            .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO)
            .averageRating(averageRating)
            .build());
    }
}
