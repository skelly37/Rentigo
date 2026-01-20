package com.rentigo.dto;

import com.rentigo.entity.ReservationStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDto {
    private Long id;
    private String reservationNumber;
    private PlaceListDto place;
    private UserDto user;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Long nights;
    private BigDecimal nightsPrice;
    private BigDecimal cleaningFee;
    private BigDecimal serviceFee;
    private BigDecimal totalPrice;
    private ReservationStatus status;
    private LocalDateTime createdAt;
}
