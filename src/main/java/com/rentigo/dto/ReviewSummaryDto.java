package com.rentigo.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryDto {
    private BigDecimal averageRating;
    private BigDecimal cleanlinessRating;
    private BigDecimal locationRating;
    private BigDecimal communicationRating;
    private BigDecimal valueRating;
    private Long reviewCount;
}
