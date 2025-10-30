package com.rentigo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    @GetMapping
    public ResponseEntity<List<Place>> getPlaces() {
        List<Place> places = Arrays.asList(
                new Place(1, "Mieszkanie w Krakowie", "Polska", "Kraków", "ul. Długa 12", 150.00),
                new Place(2, "Apartament w Warszawie", "Polska", "Warszawa", "ul. Nowy świat 7", 200.00)
        );
        return ResponseEntity.ok(places);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPlaceById(@PathVariable int id) {
        List<Place> places = Arrays.asList(
                new Place(1, "Mieszkanie w Krakowie", "Polska", "Kraków", "ul. Długa 12", 150.00),
                new Place(2, "Apartament w Warszawie", "Polska", "Warszawa", "ul. Nowy Świat 7", 200.00)
        );

        Place place = places.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (place == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Place not found"));
        }

        return ResponseEntity.ok(place);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Place {
        private int id;
        private String name;
        private String country;
        private String city;
        private String address;
        private double pricePerNight;
    }
}
