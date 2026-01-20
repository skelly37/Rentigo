package com.rentigo.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long placeId;
    private UserDto user;
    private BigDecimal rating;
    private BigDecimal cleanlinessRating;
    private BigDecimal locationRating;
    private BigDecimal communicationRating;
    private BigDecimal valueRating;
    private String comment;
    private LocalDateTime createdAt;
}
