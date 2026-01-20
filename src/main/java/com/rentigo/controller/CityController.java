package com.rentigo.controller;

import com.rentigo.dto.CityDto;
import com.rentigo.service.CityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
@Tag(name = "Miasta", description = "Lista dostępnych miast")
public class CityController {
    private final CityService cityService;

    @GetMapping
    @Operation(summary = "Pobierz listę miast")
    public ResponseEntity<List<CityDto>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Pobierz miasto po ID")
    public ResponseEntity<CityDto> getCity(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.toDto(cityService.findById(id)));
    }
}
