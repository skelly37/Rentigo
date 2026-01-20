package com.rentigo.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceImageRequest {
    private String url;
    private Boolean isMain;
    private Integer displayOrder;
}
