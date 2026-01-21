package com.rentigo.service;

import com.rentigo.dto.MessageDto;
import com.rentigo.dto.request.CreateMessageRequest;
import com.rentigo.entity.Message;
import com.rentigo.entity.Reservation;
import com.rentigo.entity.User;
import com.rentigo.repository.MessageRepository;
import com.rentigo.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<MessageDto> getReservationMessages(Long reservationId, User user) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Rezerwacja nie istnieje"));

        if (!reservation.getUser().getId().equals(user.getId()) &&
            !reservation.getPlace().getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Brak uprawnień do wiadomości tej rezerwacji");
        }

        List<Message> messages = messageRepository.findByReservation_IdOrderByCreatedAtAsc(reservationId);
        return messages.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto createMessage(CreateMessageRequest request, User sender) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new RuntimeException("Rezerwacja nie istnieje"));

        if (!reservation.getUser().getId().equals(sender.getId()) &&
            !reservation.getPlace().getOwner().getId().equals(sender.getId())) {
            throw new RuntimeException("Brak uprawnień do wysyłania wiadomości w tej rezerwacji");
        }

        Message message = Message.builder()
                .reservation(reservation)
                .sender(sender)
                .content(request.getContent())
                .build();

        message = messageRepository.save(message);
        return toDto(message);
    }

    public MessageDto toDto(Message message) {
        User sender = message.getSender();
        String senderName = sender.getFirstName() + " " + sender.getLastName();
        String senderInitials = "";
        if (sender.getFirstName() != null && !sender.getFirstName().isEmpty()) {
            senderInitials += sender.getFirstName().charAt(0);
        }
        if (sender.getLastName() != null && !sender.getLastName().isEmpty()) {
            senderInitials += sender.getLastName().charAt(0);
        }

        return MessageDto.builder()
                .id(message.getId())
                .reservationId(message.getReservation().getId())
                .senderId(sender.getId())
                .senderName(senderName)
                .senderInitials(senderInitials)
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
