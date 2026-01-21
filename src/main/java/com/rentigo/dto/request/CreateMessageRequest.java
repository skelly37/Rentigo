package com.rentigo.dto.request;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateMessageRequest {
    @NotNull(message = "ID rezerwacji jest wymagane")
    private Long reservationId;

    @NotBlank(message = "Treść wiadomości jest wymagana")
    private String content;
}
