package com.rentigo.service;

import com.rentigo.dto.request.ContactRequest;
import com.rentigo.entity.ContactMessage;
import com.rentigo.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactMessageRepository contactMessageRepository;
    private final NotificationService notificationService;

    @Transactional
    public void createContactMessage(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .subject(request.getSubject())
            .message(request.getMessage())
            .build();

        message = contactMessageRepository.save(message);

        notificationService.sendContactNotification(message);

    }
}
