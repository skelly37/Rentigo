package com.rentigo.service;

import com.rentigo.dto.ReviewDto;
import com.rentigo.dto.ReviewSummaryDto;
import com.rentigo.dto.request.CreateReviewRequest;
import com.rentigo.entity.Place;
import com.rentigo.entity.Review;
import com.rentigo.entity.ReservationStatus;
import com.rentigo.entity.User;
import com.rentigo.repository.PlaceRepository;
import com.rentigo.repository.ReservationRepository;
import com.rentigo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;
    private final ReservationRepository reservationRepository;
    private final PlaceService placeService;
    private final UserService userService;

    public ReviewDto toDto(Review review) {
        return ReviewDto.builder()
            .id(review.getId())
            .placeId(review.getPlace().getId())
            .user(userService.toDto(review.getUser()))
            .rating(review.getRating())
            .cleanlinessRating(review.getCleanlinessRating())
            .locationRating(review.getLocationRating())
            .communicationRating(review.getCommunicationRating())
            .valueRating(review.getValueRating())
            .comment(review.getComment())
            .createdAt(review.getCreatedAt())
            .build();
    }

    public List<ReviewDto> getPlaceReviews(Long placeId) {
        Place place = placeService.findById(placeId);
        return reviewRepository.findByPlace(place).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Page<ReviewDto> getPlaceReviewsPaged(Long placeId, Pageable pageable) {
        Place place = placeService.findById(placeId);
        return reviewRepository.findByPlace(place, pageable).map(this::toDto);
    }

    public ReviewSummaryDto getReviewSummary(Long placeId) {
        Place place = placeService.findById(placeId);
        return ReviewSummaryDto.builder()
            .averageRating(reviewRepository.calculateAverageRating(place))
            .cleanlinessRating(reviewRepository.calculateAverageCleanlinessRating(place))
            .locationRating(reviewRepository.calculateAverageLocationRating(place))
            .communicationRating(reviewRepository.calculateAverageCommunicationRating(place))
            .valueRating(reviewRepository.calculateAverageValueRating(place))
            .reviewCount(reviewRepository.countByPlace(place))
            .build();
    }

    @Transactional
    public Review createReview(CreateReviewRequest request, User user) {
        Place place = placeService.findById(request.getPlaceId());

        boolean hasFinishedReservation = reservationRepository.existsByUserAndPlaceAndStatusIn(
            user, place, List.of(ReservationStatus.COMPLETED, ReservationStatus.CANCELLED)
        );

        if (!hasFinishedReservation) {
            throw new RuntimeException("Możesz dodać opinię tylko po zakończonej lub anulowanej rezerwacji");
        }

        if (reviewRepository.existsByPlaceAndUser(place, user)) {
            throw new RuntimeException("Już dodałeś opinię dla tego miejsca");
        }

        Review review = Review.builder()
            .place(place)
            .user(user)
            .rating(request.getRating())
            .cleanlinessRating(request.getCleanlinessRating())
            .locationRating(request.getLocationRating())
            .communicationRating(request.getCommunicationRating())
            .valueRating(request.getValueRating())
            .comment(request.getComment())
            .build();

        review = reviewRepository.save(review);

        updatePlaceRating(place);

        return review;
    }

    @Transactional
    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Opinia nie znaleziona"));

        boolean isOwner = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Brak uprawnień");
        }

        Place place = review.getPlace();
        reviewRepository.delete(review);
        updatePlaceRating(place);
    }

    private void updatePlaceRating(Place place) {
        BigDecimal avgRating = reviewRepository.calculateAverageRating(place);
        long count = reviewRepository.countByPlace(place);

        place.setRating(avgRating != null ? avgRating.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        place.setReviewCount((int) count);
        placeRepository.save(place);
    }
}
