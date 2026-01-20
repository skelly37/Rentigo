package com.rentigo.dto.request;

import com.rentigo.entity.PlaceType;
import lombok.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlaceRequest {
    @NotBlank(message = "Nazwa miejsca jest wymagana")
    private String name;

    @Size(min = 100, message = "Opis musi mieć co najmniej 100 znaków")
    private String description;

    @NotNull(message = "Miasto jest wymagane")
    private Long cityId;

    private String district;

    @NotBlank(message = "Adres jest wymagany")
    private String address;

    @NotNull(message = "Typ noclegu jest wymagany")
    private PlaceType type;

    @NotNull(message = "Cena za noc jest wymagana")
    @Positive(message = "Cena musi być dodatnia")
    private BigDecimal pricePerNight;

    @PositiveOrZero(message = "Opłata za sprzątanie nie może być ujemna")
    private BigDecimal cleaningFee;

    @NotNull(message = "Maksymalna liczba gości jest wymagana")
    @Min(value = 1, message = "Minimum 1 gość")
    private Integer maxGuests;

    @NotNull(message = "Liczba sypialni jest wymagana")
    @Min(value = 0, message = "Liczba sypialni nie może być ujemna")
    private Integer bedrooms;

    @NotNull(message = "Liczba łazienek jest wymagana")
    @Min(value = 1, message = "Minimum 1 łazienka")
    private Integer bathrooms;

    private Integer singleBeds;
    private Integer doubleBeds;
    private Integer area;

    @Min(value = 1, message = "Minimalny pobyt to 1 noc")
    private Integer minStay;

    private Integer maxStay;

    private Set<Long> amenityIds;
    private List<PlaceImageRequest> images;
    private Boolean isDraft;
}
