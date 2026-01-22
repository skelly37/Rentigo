package com.rentigo.repository;

import com.rentigo.entity.Favorite;
import com.rentigo.entity.Place;
import com.rentigo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);

    boolean existsByUserAndPlace(User user, Place place);

    void deleteByUserAndPlace(User user, Place place);

}
