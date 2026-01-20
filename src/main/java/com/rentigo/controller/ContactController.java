package com.rentigo.controller;

import com.rentigo.dto.request.ContactRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Kontakt", description = "Formularz kontaktowy")
public class ContactController {
    private final ContactService contactService;

    @PostMapping
    @Operation(summary = "Wyślij wiadomość kontaktową")
    public ResponseEntity<ApiResponse> sendContactMessage(@Valid @RequestBody ContactRequest request) {
        contactService.createContactMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Wiadomość została wysłana"));
    }
}
