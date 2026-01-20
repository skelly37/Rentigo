package com.rentigo.dto.response;

import com.rentigo.dto.UserDto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;
}
