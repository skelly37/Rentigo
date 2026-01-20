package com.rentigo.service;

import com.rentigo.dto.ReservationDto;
import com.rentigo.dto.request.CreateReservationRequest;
import com.rentigo.entity.*;
import com.rentigo.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final PlaceService placeService;
    private final UserService userService;
    private final NotificationService notificationService;

    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.05");

    public ReservationDto toDto(Reservation reservation) {
        return ReservationDto.builder()
            .id(reservation.getId())
            .reservationNumber(reservation.getReservationNumber())
            .place(placeService.toListDto(reservation.getPlace(), reservation.getUser()))
            .user(userService.toDto(reservation.getUser()))
            .checkIn(reservation.getCheckIn())
            .checkOut(reservation.getCheckOut())
            .guests(reservation.getGuests())
            .nights(reservation.getNights())
            .nightsPrice(reservation.getNightsPrice())
            .cleaningFee(reservation.getCleaningFee())
            .serviceFee(reservation.getServiceFee())
            .totalPrice(reservation.getTotalPrice())
            .status(reservation.getStatus())
            .createdAt(reservation.getCreatedAt())
            .build();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rezerwacja nie znaleziona"));
    }

    public List<ReservationDto> getUserReservations(User user) {
        return reservationRepository.findByUser(user).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<ReservationDto> getUpcomingReservations(User user) {
        return reservationRepository.findUpcomingReservations(user).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<ReservationDto> getPastReservations(User user) {
        return reservationRepository.findPastReservations(user).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<ReservationDto> getCancelledReservations(User user) {
        return reservationRepository.findByUserAndStatus(user, ReservationStatus.CANCELLED).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<ReservationDto> getHostReservations(User host) {
        return reservationRepository.findByPlaceOwner(host).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<ReservationDto> getPlaceReservations(Long placeId, User owner) {
        Place place = placeService.findById(placeId);
        if (!place.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Brak uprawnień");
        }
        return reservationRepository.findByPlace(place).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public Reservation createReservation(CreateReservationRequest request, User user) {
        Place place = placeService.findById(request.getPlaceId());

        if (place.getStatus() != PlaceStatus.ACTIVE) {
            throw new RuntimeException("Miejsce nie jest dostępne do rezerwacji");
        }

        if (request.getGuests() > place.getMaxGuests()) {
            throw new RuntimeException("Przekroczona maksymalna liczba gości");
        }

        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new RuntimeException("Data wymeldowania musi być po dacie zameldowania");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        if (place.getMinStay() != null && nights < place.getMinStay()) {
            throw new RuntimeException("Minimalny pobyt to " + place.getMinStay() + " nocy");
        }

        if (place.getMaxStay() != null && place.getMaxStay() > 0 && nights > place.getMaxStay()) {
            throw new RuntimeException("Maksymalny pobyt to " + place.getMaxStay() + " nocy");
        }

        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
            place, request.getCheckIn(), request.getCheckOut()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Wybrane terminy są już zarezerwowane");
        }

        BigDecimal nightsPrice = place.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal cleaningFee = place.getCleaningFee() != null ? place.getCleaningFee() : BigDecimal.ZERO;
        BigDecimal serviceFee = nightsPrice.multiply(SERVICE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = nightsPrice.add(cleaningFee).add(serviceFee);

        Reservation reservation = Reservation.builder()
            .place(place)
            .user(user)
            .checkIn(request.getCheckIn())
            .checkOut(request.getCheckOut())
            .guests(request.getGuests())
            .nightsPrice(nightsPrice)
            .cleaningFee(cleaningFee)
            .serviceFee(serviceFee)
            .totalPrice(totalPrice)
            .status(ReservationStatus.PENDING)
            .build();

        reservation = reservationRepository.save(reservation);

        notificationService.sendReservationNotification(reservation, "CREATED");

        return reservation;
    }

    @Transactional
    public Reservation confirmReservation(Long reservationId, User host) {
        Reservation reservation = findById(reservationId);

        if (!reservation.getPlace().getOwner().getId().equals(host.getId())) {
            throw new RuntimeException("Brak uprawnień");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Rezerwacja nie może być potwierdzona");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation = reservationRepository.save(reservation);

        notificationService.sendReservationNotification(reservation, "CONFIRMED");

        return reservation;
    }

    @Transactional
    public Reservation cancelReservation(Long reservationId, User user) {
        Reservation reservation = findById(reservationId);

        boolean isOwner = reservation.getPlace().getOwner().getId().equals(user.getId());
        boolean isGuest = reservation.getUser().getId().equals(user.getId());

        if (!isOwner && !isGuest) {
            throw new RuntimeException("Brak uprawnień");
        }

        if (reservation.getStatus() == ReservationStatus.COMPLETED ||
            reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Rezerwacja nie może być anulowana");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation = reservationRepository.save(reservation);

        notificationService.sendReservationNotification(reservation, "CANCELLED");

        return reservation;
    }

    public long countMonthlyReservations(User owner) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return reservationRepository.countReservationsByOwnerSince(owner, startOfMonth);
    }

    public BigDecimal getMonthlyRevenue(User owner) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return reservationRepository.sumRevenueByOwnerSince(owner, startOfMonth);
    }

    @Transactional
    public void deleteReservation(Long reservationId, User user) {
        if (!user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Brak uprawnień - tylko administrator może usuwać rezerwacje");
        }

        Reservation reservation = findById(reservationId);
        reservationRepository.delete(reservation);
    }
}
