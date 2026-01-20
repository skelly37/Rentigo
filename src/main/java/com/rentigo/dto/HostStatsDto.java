package com.rentigo.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostStatsDto {
    private long activePlaces;
    private long monthlyReservations;
    private BigDecimal monthlyRevenue;
    private BigDecimal averageRating;
}
