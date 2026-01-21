package com.rentigo.dto;

import com.rentigo.entity.PlaceStatus;
import com.rentigo.entity.PlaceType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceDto {
    private Long id;
    private String name;
    private String description;
    private CityDto city;
    private String district;
    private String address;
    private PlaceType type;
    private BigDecimal pricePerNight;
    private BigDecimal cleaningFee;
    private Integer maxGuests;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer singleBeds;
    private Integer doubleBeds;
    private Integer area;
    private Integer minStay;
    private Integer maxStay;
    private BigDecimal rating;
    private Integer reviewCount;
    private PlaceStatus status;
    private UserDto owner;
    private Set<AmenityDto> amenities;
    private List<PlaceImageDto> images;
    private String mainImageUrl;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
}
