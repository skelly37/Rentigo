package com.rentigo.repository;

import com.rentigo.entity.Place;
import com.rentigo.entity.Review;
import com.rentigo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPlace(Place place);

    Page<Review> findByPlace(Place place, Pageable pageable);

    List<Review> findByUser(User user);

    Optional<Review> findByPlaceAndUser(Place place, User user);

    boolean existsByPlaceAndUser(Place place, User user);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.place = :place")
    BigDecimal calculateAverageRating(@Param("place") Place place);

    @Query("SELECT AVG(r.cleanlinessRating) FROM Review r WHERE r.place = :place AND r.cleanlinessRating IS NOT NULL")
    BigDecimal calculateAverageCleanlinessRating(@Param("place") Place place);

    @Query("SELECT AVG(r.locationRating) FROM Review r WHERE r.place = :place AND r.locationRating IS NOT NULL")
    BigDecimal calculateAverageLocationRating(@Param("place") Place place);

    @Query("SELECT AVG(r.communicationRating) FROM Review r WHERE r.place = :place AND r.communicationRating IS NOT NULL")
    BigDecimal calculateAverageCommunicationRating(@Param("place") Place place);

    @Query("SELECT AVG(r.valueRating) FROM Review r WHERE r.place = :place AND r.valueRating IS NOT NULL")
    BigDecimal calculateAverageValueRating(@Param("place") Place place);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.place = :place")
    long countByPlace(@Param("place") Place place);
}
