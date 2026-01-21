package com.rentigo.controller;

import com.rentigo.dto.MessageDto;
import com.rentigo.dto.request.CreateMessageRequest;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Wiadomości", description = "Czat między gościem a gospodarzem")
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/reservation/{reservationId}")
    @Operation(summary = "Pobierz wiadomości dla rezerwacji")
    public ResponseEntity<List<MessageDto>> getReservationMessages(
            @PathVariable Long reservationId,
            @CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(messageService.getReservationMessages(reservationId, userPrincipal.getUser()));
    }

    @PostMapping
    @Operation(summary = "Wyślij wiadomość")
    public ResponseEntity<MessageDto> createMessage(
            @Valid @RequestBody CreateMessageRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(messageService.createMessage(request, userPrincipal.getUser()));
    }
}
