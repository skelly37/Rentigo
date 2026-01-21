package com.rentigo.service;

import com.rentigo.dto.PlaceListDto;
import com.rentigo.entity.Favorite;
import com.rentigo.entity.Place;
import com.rentigo.entity.User;
import com.rentigo.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final PlaceService placeService;

    @Transactional(readOnly = true)
    public List<PlaceListDto> getUserFavorites(User user) {
        return favoriteRepository.findByUser(user).stream()
            .map(f -> placeService.toListDto(f.getPlace(), user))
            .collect(Collectors.toList());
    }

    public boolean isFavorite(User user, Long placeId) {
        Place place = placeService.findById(placeId);
        return favoriteRepository.existsByUserAndPlace(user, place);
    }

    @Transactional
    public void addFavorite(User user, Long placeId) {
        Place place = placeService.findById(placeId);

        if (favoriteRepository.existsByUserAndPlace(user, place)) {
            return;
        }

        Favorite favorite = Favorite.builder()
            .user(user)
            .place(place)
            .build();

        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(User user, Long placeId) {
        Place place = placeService.findById(placeId);
        favoriteRepository.deleteByUserAndPlace(user, place);
    }

    @Transactional
    public boolean toggleFavorite(User user, Long placeId) {
        Place place = placeService.findById(placeId);

        if (favoriteRepository.existsByUserAndPlace(user, place)) {
            favoriteRepository.deleteByUserAndPlace(user, place);
            return false;
        } else {
            Favorite favorite = Favorite.builder()
                .user(user)
                .place(place)
                .build();
            favoriteRepository.save(favorite);
            return true;
        }
    }
}
