package com.rentigo.dto;

import com.rentigo.entity.PlaceStatus;
import com.rentigo.entity.PlaceType;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceListDto {
    private Long id;
    private String name;
    private String cityName;
    private String district;
    private PlaceType type;
    private BigDecimal pricePerNight;
    private Integer maxGuests;
    private Integer bedrooms;
    private BigDecimal rating;
    private Integer reviewCount;
    private PlaceStatus status;
    private String mainImageUrl;
    private Boolean isFavorite;
}
