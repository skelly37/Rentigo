package com.rentigo.controller;

import com.rentigo.dto.ReviewDto;
import com.rentigo.dto.ReviewSummaryDto;
import com.rentigo.dto.request.CreateReviewRequest;
import com.rentigo.dto.response.ApiResponse;
import com.rentigo.dto.response.PageResponse;
import com.rentigo.entity.Review;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Opinie", description = "Zarządzanie opiniami")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/place/{placeId}")
    @Operation(summary = "Pobierz opinie dla miejsca")
    public ResponseEntity<List<ReviewDto>> getPlaceReviews(@PathVariable Long placeId) {
        return ResponseEntity.ok(reviewService.getPlaceReviews(placeId));
    }

    @GetMapping("/place/{placeId}/paged")
    @Operation(summary = "Pobierz opinie dla miejsca (paginowane)")
    public ResponseEntity<PageResponse<ReviewDto>> getPlaceReviewsPaged(
            @PathVariable Long placeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(PageResponse.of(
            reviewService.getPlaceReviewsPaged(placeId,
                PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/place/{placeId}/summary")
    @Operation(summary = "Pobierz podsumowanie ocen miejsca")
    public ResponseEntity<ReviewSummaryDto> getReviewSummary(@PathVariable Long placeId) {
        return ResponseEntity.ok(reviewService.getReviewSummary(placeId));
    }

    @PostMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Dodaj opinię")
    public ResponseEntity<ReviewDto> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @CurrentUser UserPrincipal userPrincipal) {
        Review review = reviewService.createReview(request, userPrincipal.getUser());
        return ResponseEntity.ok(reviewService.toDto(review));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Usuń swoją opinię")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long id,
            @CurrentUser UserPrincipal userPrincipal) {
        reviewService.deleteReview(id, userPrincipal.getUser());
        return ResponseEntity.ok(ApiResponse.success("Opinia usunięta"));
    }
}
