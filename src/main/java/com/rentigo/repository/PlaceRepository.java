package com.rentigo.repository;

import com.rentigo.entity.Place;
import com.rentigo.entity.PlaceStatus;
import com.rentigo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByOwner(User owner);

    Page<Place> findByStatus(PlaceStatus status, Pageable pageable);

    @Query("SELECT p FROM Place p WHERE p.status = :status AND p.city.id = :cityId")
    Page<Place> findByCityIdAndStatus(@Param("cityId") Long cityId, @Param("status") PlaceStatus status, Pageable pageable);

    @Query("SELECT p FROM Place p WHERE p.status = :status AND p.maxGuests >= :guests AND p.city.id = :cityId")
    Page<Place> findAvailablePlaces(
        @Param("cityId") Long cityId,
        @Param("guests") Integer guests,
        @Param("status") PlaceStatus status,
        Pageable pageable
    );

    @Query("SELECT p FROM Place p WHERE p.status = 'ACTIVE' AND " +
           "(LOWER(p.city.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Place> searchPlaces(@Param("query") String query, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Place p WHERE p.owner = :owner AND p.status = :status")
    long countByOwnerAndStatus(@Param("owner") User owner, @Param("status") PlaceStatus status);

    long countByOwner(User owner);
}
