package com.rentigo.service;

import com.rentigo.dto.*;
import com.rentigo.dto.request.CreatePlaceRequest;
import com.rentigo.dto.request.PlaceImageRequest;
import com.rentigo.entity.*;
import com.rentigo.exception.ForbiddenException;
import com.rentigo.exception.ResourceNotFoundException;
import com.rentigo.repository.*;
import com.rentigo.util.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final PlaceImageRepository placeImageRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReservationRepository reservationRepository;
    private final CityService cityService;
    private final AmenityService amenityService;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public PlaceDto toDto(Place place) {
        return toDto(place, null);
    }

    public PlaceDto toDto(Place place, User currentUser) {
        UserDto ownerDto = userService.toDto(place.getOwner());
        ownerDto.setPlaceCount(placeRepository.countByOwner(place.getOwner()));

        boolean isFavorite = currentUser != null &&
            favoriteRepository.existsByUserAndPlace(currentUser, place);

        return PlaceDto.builder()
            .id(place.getId())
            .name(place.getName())
            .description(place.getDescription())
            .city(cityService.toDto(place.getCity()))
            .district(place.getDistrict())
            .address(place.getAddress())
            .type(place.getType())
            .pricePerNight(place.getPricePerNight())
            .cleaningFee(place.getCleaningFee())
            .maxGuests(place.getMaxGuests())
            .bedrooms(place.getBedrooms())
            .bathrooms(place.getBathrooms())
            .singleBeds(place.getSingleBeds())
            .doubleBeds(place.getDoubleBeds())
            .area(place.getArea())
            .minStay(place.getMinStay())
            .maxStay(place.getMaxStay())
            .rating(place.getRating())
            .reviewCount(place.getReviewCount())
            .status(place.getStatus())
            .owner(ownerDto)
            .amenities(place.getAmenities().stream()
                .map(amenityService::toDto)
                .collect(Collectors.toSet()))
            .images(place.getImages().stream()
                .map(this::toImageDto)
                .collect(Collectors.toList()))
            .mainImageUrl(place.getMainImageUrl())
            .isFavorite(isFavorite)
            .createdAt(place.getCreatedAt())
            .build();
    }

    public PlaceListDto toListDto(Place place, User currentUser) {
        boolean isFavorite = currentUser != null &&
            favoriteRepository.existsByUserAndPlace(currentUser, place);

        int reservationCount = (int) reservationRepository.countByPlace(place);

        return PlaceListDto.builder()
            .id(place.getId())
            .name(place.getName())
            .cityName(place.getCity().getName())
            .district(place.getDistrict())
            .type(place.getType())
            .pricePerNight(place.getPricePerNight())
            .maxGuests(place.getMaxGuests())
            .bedrooms(place.getBedrooms())
            .rating(place.getRating())
            .reviewCount(place.getReviewCount())
            .status(place.getStatus())
            .mainImageUrl(place.getMainImageUrl())
            .isFavorite(isFavorite)
            .ownerId(place.getOwner() != null ? place.getOwner().getId() : null)
            .reservationCount(reservationCount)
            .build();
    }

    public PlaceImageDto toImageDto(PlaceImage image) {
        return PlaceImageDto.builder()
            .id(image.getId())
            .url(image.getUrl())
            .isMain(image.getIsMain())
            .displayOrder(image.getDisplayOrder())
            .build();
    }

    public Place findById(Long id) {
        return placeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Miejsce nie znalezione"));
    }

    public void checkOwnership(Place place, User user) {
        PermissionChecker.checkPlaceOwnership(user, place);
    }

    public Page<PlaceListDto> getActivePlaces(Pageable pageable, User currentUser) {
        return placeRepository.findByStatus(PlaceStatus.ACTIVE, pageable)
            .map(p -> toListDto(p, currentUser));
    }

    public Page<PlaceListDto> searchPlaces(String query, Pageable pageable, User currentUser) {
        return placeRepository.searchPlaces(query, pageable)
            .map(p -> toListDto(p, currentUser));
    }

    public Page<PlaceListDto> getPlacesByCity(Long cityId, Integer guests, java.time.LocalDate checkIn, java.time.LocalDate checkOut, Pageable pageable, User currentUser) {
        Page<Place> places;
        if (guests != null && guests > 0) {
            places = placeRepository.findAvailablePlaces(cityId, guests, PlaceStatus.ACTIVE, pageable);
        } else {
            places = placeRepository.findByCityIdAndStatus(cityId, PlaceStatus.ACTIVE, pageable);
        }

        if (checkIn != null && checkOut != null) {
            List<Place> placeList = places.getContent();
            List<Place> availablePlaces = placeList.stream()
                .filter(place -> {
                    List<com.rentigo.entity.Reservation> conflicts = reservationRepository.findConflictingReservations(place, checkIn, checkOut);
                    return conflicts.isEmpty();
                })
                .collect(java.util.stream.Collectors.toList());
            return new org.springframework.data.domain.PageImpl<>(
                availablePlaces.stream().map(p -> toListDto(p, currentUser)).collect(java.util.stream.Collectors.toList()),
                pageable,
                availablePlaces.size()
            );
        }

        return places.map(p -> toListDto(p, currentUser));
    }

    public List<PlaceListDto> getPlacesByOwner(User owner) {
        return placeRepository.findByOwner(owner).stream()
            .map(p -> toListDto(p, owner))
            .collect(Collectors.toList());
    }

    @Transactional
    public Place createPlace(CreatePlaceRequest request, User owner) {
        City city = cityService.findById(request.getCityId());
        Set<Amenity> amenities = request.getAmenityIds() != null
            ? amenityService.findByIds(request.getAmenityIds())
            : Set.of();

        Place place = Place.builder()
            .name(request.getName())
            .description(request.getDescription())
            .city(city)
            .district(request.getDistrict())
            .address(request.getAddress())
            .type(request.getType())
            .pricePerNight(request.getPricePerNight())
            .cleaningFee(request.getCleaningFee())
            .maxGuests(request.getMaxGuests())
            .bedrooms(request.getBedrooms())
            .bathrooms(request.getBathrooms())
            .singleBeds(request.getSingleBeds())
            .doubleBeds(request.getDoubleBeds())
            .area(request.getArea())
            .minStay(request.getMinStay() != null ? request.getMinStay() : 1)
            .maxStay(request.getMaxStay())
            .status(Boolean.TRUE.equals(request.getIsDraft()) ? PlaceStatus.DRAFT : PlaceStatus.ACTIVE)
            .owner(owner)
            .amenities(amenities)
            .build();

        return placeRepository.save(place);
    }

    @Transactional
    public Place updatePlace(Long placeId, CreatePlaceRequest request, User owner) {
        Place place = findById(placeId);

        if (!place.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Brak uprawnień do edycji tego miejsca");
        }

        if (request.getName() != null) place.setName(request.getName());
        if (request.getDescription() != null) place.setDescription(request.getDescription());
        if (request.getCityId() != null) place.setCity(cityService.findById(request.getCityId()));
        if (request.getDistrict() != null) place.setDistrict(request.getDistrict());
        if (request.getAddress() != null) place.setAddress(request.getAddress());
        if (request.getType() != null) place.setType(request.getType());
        if (request.getPricePerNight() != null) place.setPricePerNight(request.getPricePerNight());
        if (request.getCleaningFee() != null) place.setCleaningFee(request.getCleaningFee());
        if (request.getMaxGuests() != null) place.setMaxGuests(request.getMaxGuests());
        if (request.getBedrooms() != null) place.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) place.setBathrooms(request.getBathrooms());
        if (request.getSingleBeds() != null) place.setSingleBeds(request.getSingleBeds());
        if (request.getDoubleBeds() != null) place.setDoubleBeds(request.getDoubleBeds());
        if (request.getArea() != null) place.setArea(request.getArea());
        if (request.getMinStay() != null) place.setMinStay(request.getMinStay());
        if (request.getMaxStay() != null) place.setMaxStay(request.getMaxStay());

        if (request.getAmenityIds() != null) {
            place.setAmenities(amenityService.findByIds(request.getAmenityIds()));
        }

        return placeRepository.save(place);
    }

    @Transactional
    public void updatePlaceStatus(Long placeId, PlaceStatus status, User owner) {
        Place place = findById(placeId);
        if (!place.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Brak uprawnień");
        }
        place.setStatus(status);
        placeRepository.save(place);
    }

    @Transactional
    public void deletePlace(Long placeId, User user) {
        Place place = findById(placeId);

        boolean isOwner = place.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Brak uprawnień");
        }

        List<PlaceImage> images = placeImageRepository.findByPlace(place);
        images.forEach(image -> fileStorageService.deleteFile(image.getUrl()));

        placeRepository.delete(place);
    }
}
