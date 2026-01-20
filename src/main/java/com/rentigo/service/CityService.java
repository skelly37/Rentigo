package com.rentigo.service;

import com.rentigo.dto.CityDto;
import com.rentigo.entity.City;
import com.rentigo.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CityService {
    private final CityRepository cityRepository;

    public CityDto toDto(City city) {
        return CityDto.builder()
            .id(city.getId())
            .name(city.getName())
            .country(city.getCountry())
            .build();
    }

    public City findById(Long id) {
        return cityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Miasto nie znalezione"));
    }

    public List<CityDto> getAllCities() {
        return cityRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
}
