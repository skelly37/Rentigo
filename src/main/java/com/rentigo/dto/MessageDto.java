package com.rentigo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDto {
    private Long id;
    private Long reservationId;
    private Long senderId;
    private String senderName;
    private String senderInitials;
    private String content;
    private LocalDateTime createdAt;
}
