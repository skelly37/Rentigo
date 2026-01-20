package com.rentigo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceImageDto {
    private Long id;
    private String url;
    private Boolean isMain;
    private Integer displayOrder;
}
