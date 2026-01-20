package com.rentigo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityDto {
    private Long id;
    private String name;
    private String icon;
}
