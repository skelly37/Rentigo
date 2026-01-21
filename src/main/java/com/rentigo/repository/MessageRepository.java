package com.rentigo.repository;

import com.rentigo.entity.Message;
import com.rentigo.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReservationOrderByCreatedAtAsc(Reservation reservation);
    List<Message> findByReservation_IdOrderByCreatedAtAsc(Long reservationId);
}
