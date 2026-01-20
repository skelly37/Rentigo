package com.rentigo.controller;

import com.rentigo.dto.AmenityDto;
import com.rentigo.service.AmenityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
@Tag(name = "Udogodnienia", description = "Lista dostępnych udogodnień")
public class AmenityController {
    private final AmenityService amenityService;

    @GetMapping
    @Operation(summary = "Pobierz listę udogodnień")
    public ResponseEntity<List<AmenityDto>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAllAmenities());
    }
}
