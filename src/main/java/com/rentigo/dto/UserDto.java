package com.rentigo.dto;

import com.rentigo.entity.Role;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String avatarUrl;
    private String initials;
    private Role role;
    private LocalDateTime createdAt;
    private Long placeCount;
}
