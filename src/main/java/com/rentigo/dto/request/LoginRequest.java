package com.rentigo.dto.request;

import lombok.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidłowy format email")
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    private String password;
}
