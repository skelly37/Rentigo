package com.rentigo.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "place_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    @ToString.Exclude
    private Place place;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private Boolean isMain;

    private Integer displayOrder;
}
