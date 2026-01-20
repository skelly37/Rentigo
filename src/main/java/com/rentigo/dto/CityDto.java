package com.rentigo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityDto {
    private Long id;
    private String name;
    private String country;
}
