package com.rentigo.service;

import com.rentigo.entity.ContactMessage;
import com.rentigo.entity.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notifications}")
    private String exchange;

    @Value("${rabbitmq.routing.key.notifications}")
    private String routingKey;

    public void sendReservationNotification(Reservation reservation, String action) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("type", "RESERVATION_" + action);
            message.put("reservationId", reservation.getId());
            message.put("reservationNumber", reservation.getReservationNumber());
            message.put("guestEmail", reservation.getUser().getEmail());
            message.put("guestName", reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName());
            message.put("hostEmail", reservation.getPlace().getOwner().getEmail());
            message.put("hostName", reservation.getPlace().getOwner().getFirstName());
            message.put("placeName", reservation.getPlace().getName());
            message.put("checkIn", reservation.getCheckIn().toString());
            message.put("checkOut", reservation.getCheckOut().toString());
            message.put("totalPrice", reservation.getTotalPrice().toString());

            rabbitTemplate.convertAndSend(exchange, routingKey, message);
            log.info("Reservation notification sent: {} - {}", action, reservation.getReservationNumber());
        } catch (Exception e) {
            log.warn("Failed to send reservation notification: {}", e.getMessage());
        }
    }

    public void sendContactNotification(ContactMessage contactMessage) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("type", "CONTACT_MESSAGE");
            message.put("messageId", contactMessage.getId());
            message.put("senderEmail", contactMessage.getEmail());
            message.put("senderName", contactMessage.getFirstName() + " " + contactMessage.getLastName());
            message.put("subject", contactMessage.getSubject());
            message.put("content", contactMessage.getMessage());

            rabbitTemplate.convertAndSend(exchange, routingKey, message);
            log.info("Contact notification sent: {}", contactMessage.getId());
        } catch (Exception e) {
            log.warn("Failed to send contact notification: {}", e.getMessage());
        }
    }
}
