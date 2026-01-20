package com.rentigo.dto.request;

import lombok.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    @NotNull(message = "ID miejsca jest wymagane")
    private Long placeId;

    @NotNull(message = "Ocena jest wymagana")
    @DecimalMin(value = "1.0", message = "Ocena minimalna to 1")
    @DecimalMax(value = "10.0", message = "Ocena maksymalna to 10")
    private BigDecimal rating;

    @DecimalMin(value = "1.0") @DecimalMax(value = "10.0")
    private BigDecimal cleanlinessRating;

    @DecimalMin(value = "1.0") @DecimalMax(value = "10.0")
    private BigDecimal locationRating;

    @DecimalMin(value = "1.0") @DecimalMax(value = "10.0")
    private BigDecimal communicationRating;

    @DecimalMin(value = "1.0") @DecimalMax(value = "10.0")
    private BigDecimal valueRating;

    private String comment;
}
