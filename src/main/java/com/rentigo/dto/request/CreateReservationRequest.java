package com.rentigo.dto.request;

import lombok.*;
import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReservationRequest {
    @NotNull(message = "ID miejsca jest wymagane")
    private Long placeId;

    @NotNull(message = "Data zameldowania jest wymagana")
    @FutureOrPresent(message = "Data zameldowania nie może być w przeszłości")
    private LocalDate checkIn;

    @NotNull(message = "Data wymeldowania jest wymagana")
    @Future(message = "Data wymeldowania musi być w przyszłości")
    private LocalDate checkOut;

    @NotNull(message = "Liczba gości jest wymagana")
    @Min(value = 1, message = "Minimum 1 gość")
    private Integer guests;
}
