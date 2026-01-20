package com.rentigo.service;

import com.rentigo.dto.AmenityDto;
import com.rentigo.entity.Amenity;
import com.rentigo.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmenityService {
    private final AmenityRepository amenityRepository;

    public AmenityDto toDto(Amenity amenity) {
        return AmenityDto.builder()
            .id(amenity.getId())
            .name(amenity.getName())
            .icon(amenity.getIcon())
            .build();
    }

    public Amenity findById(Long id) {
        return amenityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Udogodnienie nie znalezione"));
    }

    public Set<Amenity> findByIds(Set<Long> ids) {
        return amenityRepository.findAllById(ids).stream().collect(Collectors.toSet());
    }

    public List<AmenityDto> getAllAmenities() {
        return amenityRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
}
