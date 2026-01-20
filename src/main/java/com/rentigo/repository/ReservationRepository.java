package com.rentigo.repository;

import com.rentigo.entity.Place;
import com.rentigo.entity.Reservation;
import com.rentigo.entity.ReservationStatus;
import com.rentigo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);

    List<Reservation> findByUserAndStatus(User user, ReservationStatus status);

    List<Reservation> findByPlace(Place place);

    Optional<Reservation> findByReservationNumber(String reservationNumber);

    boolean existsByUserAndPlaceAndStatus(User user, Place place, ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.user = :user AND r.checkIn >= CURRENT_DATE AND r.status IN ('PENDING', 'CONFIRMED')")
    List<Reservation> findUpcomingReservations(@Param("user") User user);

    @Query("SELECT r FROM Reservation r WHERE r.user = :user AND r.checkOut < CURRENT_DATE")
    List<Reservation> findPastReservations(@Param("user") User user);

    @Query("SELECT r FROM Reservation r WHERE r.place = :place AND " +
           "((r.checkIn <= :checkOut AND r.checkOut >= :checkIn)) AND " +
           "r.status IN ('PENDING', 'CONFIRMED')")
    List<Reservation> findConflictingReservations(
        @Param("place") Place place,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.place.owner = :owner AND r.createdAt >= :since")
    long countReservationsByOwnerSince(@Param("owner") User owner, @Param("since") java.time.LocalDateTime since);

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.place.owner = :owner AND r.createdAt >= :since AND r.status IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal sumRevenueByOwnerSince(@Param("owner") User owner, @Param("since") java.time.LocalDateTime since);

    @Query("SELECT r FROM Reservation r WHERE r.place.owner = :owner ORDER BY r.createdAt DESC")
    List<Reservation> findByPlaceOwner(@Param("owner") User owner);
}
