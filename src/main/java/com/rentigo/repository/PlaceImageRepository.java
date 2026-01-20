package com.rentigo.repository;

import com.rentigo.entity.Place;
import com.rentigo.entity.PlaceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceImageRepository extends JpaRepository<PlaceImage, Long> {
    List<PlaceImage> findByPlace(Place place);
    List<PlaceImage> findByPlaceOrderByDisplayOrderAsc(Place place);
}
