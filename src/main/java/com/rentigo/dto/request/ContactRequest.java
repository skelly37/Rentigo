package com.rentigo.dto.request;

import lombok.*;
import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    @NotBlank(message = "Imię jest wymagane")
    private String firstName;

    @NotBlank(message = "Nazwisko jest wymagane")
    private String lastName;

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidłowy format email")
    private String email;

    @NotBlank(message = "Temat jest wymagany")
    private String subject;

    @NotBlank(message = "Wiadomość jest wymagana")
    @Size(min = 10, message = "Wiadomość musi mieć co najmniej 10 znaków")
    private String message;
}
