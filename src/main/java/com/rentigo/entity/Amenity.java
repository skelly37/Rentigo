package com.rentigo.entity;

import lombok.*;
import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "amenities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String icon;

    @ManyToMany(mappedBy = "amenities")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Place> places = new HashSet<>();
}
