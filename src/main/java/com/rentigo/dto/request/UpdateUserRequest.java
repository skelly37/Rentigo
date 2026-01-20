package com.rentigo.dto.request;

import lombok.*;
import javax.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String firstName;
    private String lastName;

    @Email(message = "Nieprawidłowy format email")
    private String email;

    private String phone;
    private String avatarUrl;
    private String currentPassword;
    private String newPassword;
}
