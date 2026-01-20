package com.rentigo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@Slf4j
public class NotificationConsumer {

    @RabbitListener(queues = "${rabbitmq.queue.notifications}")
    public void processNotification(Map<String, Object> message) {
        String type = (String) message.get("type");
        log.info("Processing notification: {}", type);

        switch (type) {
            case "RESERVATION_CREATED":
                handleReservationCreated(message);
                break;
            case "RESERVATION_CONFIRMED":
                handleReservationConfirmed(message);
                break;
            case "RESERVATION_CANCELLED":
                handleReservationCancelled(message);
                break;
            case "CONTACT_MESSAGE":
                handleContactMessage(message);
                break;
            default:
                log.warn("Unknown notification type: {}", type);
        }
    }

    private void handleReservationCreated(Map<String, Object> message) {
        log.info("New reservation created: {} for {} at {}",
            message.get("reservationNumber"),
            message.get("guestName"),
            message.get("placeName"));
    }

    private void handleReservationConfirmed(Map<String, Object> message) {
        log.info("Reservation confirmed: {} - notifying guest {}",
            message.get("reservationNumber"),
            message.get("guestEmail"));
    }

    private void handleReservationCancelled(Map<String, Object> message) {
        log.info("Reservation cancelled: {} - notifying parties",
            message.get("reservationNumber"));
    }

    private void handleContactMessage(Map<String, Object> message) {
        log.info("New contact message from {}: {}",
            message.get("senderEmail"),
            message.get("subject"));
    }
}
