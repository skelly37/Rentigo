package com.rentigo.controller;

import com.rentigo.dto.response.ApiResponse;
import com.rentigo.entity.Place;
import com.rentigo.entity.PlaceImage;
import com.rentigo.entity.User;
import com.rentigo.repository.PlaceImageRepository;
import com.rentigo.security.CurrentUser;
import com.rentigo.security.UserPrincipal;
import com.rentigo.service.FileStorageService;
import com.rentigo.service.PlaceService;
import com.rentigo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Pliki", description = "Endpointy do zarządzania plikami i zdjęciami")
public class FileUploadController {
    private final FileStorageService fileStorageService;
    private final PlaceService placeService;
    private final UserService userService;
    private final PlaceImageRepository placeImageRepository;

    @PostMapping("/places/{placeId}/images")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Dodaj zdjęcie do miejsca")
    public ResponseEntity<Map<String, Object>> uploadPlaceImage(
            @PathVariable Long placeId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false, defaultValue = "false") Boolean isMain,
            @CurrentUser UserPrincipal userPrincipal) {

        Place place = placeService.findById(placeId);
        placeService.checkOwnership(place, userPrincipal.getUser());

        String imageUrl = fileStorageService.storeFile(file, "places", placeId);

        List<PlaceImage> existingImages = placeImageRepository.findByPlace(place);
        if (isMain || existingImages.isEmpty()) {
            existingImages.forEach(img -> img.setIsMain(false));
            placeImageRepository.saveAll(existingImages);
        }

        int displayOrder = existingImages.size();
        PlaceImage placeImage = PlaceImage.builder()
                .place(place)
                .url(imageUrl)
                .isMain(isMain || existingImages.isEmpty())
                .displayOrder(displayOrder)
                .build();

        placeImage = placeImageRepository.save(placeImage);

        Map<String, Object> response = new HashMap<>();
        response.put("id", placeImage.getId());
        response.put("url", imageUrl);
        response.put("isMain", placeImage.getIsMain());
        response.put("displayOrder", displayOrder);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/places/images/{imageId}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Usuń zdjęcie miejsca")
    public ResponseEntity<ApiResponse> deletePlaceImage(
            @PathVariable Long imageId,
            @CurrentUser UserPrincipal userPrincipal) {

        PlaceImage image = placeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Zdjęcie nie znalezione"));

        placeService.checkOwnership(image.getPlace(), userPrincipal.getUser());

        fileStorageService.deleteFile(image.getUrl());
        placeImageRepository.delete(image);

        return ResponseEntity.ok(ApiResponse.success("Zdjęcie zostało usunięte"));
    }

    @PatchMapping("/places/images/{imageId}/set-main")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Ustaw zdjęcie jako główne")
    public ResponseEntity<ApiResponse> setMainPlaceImage(
            @PathVariable Long imageId,
            @CurrentUser UserPrincipal userPrincipal) {

        PlaceImage image = placeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Zdjęcie nie znalezione"));

        placeService.checkOwnership(image.getPlace(), userPrincipal.getUser());

        List<PlaceImage> allImages = placeImageRepository.findByPlace(image.getPlace());
        allImages.forEach(img -> img.setIsMain(img.getId().equals(imageId)));
        placeImageRepository.saveAll(allImages);

        return ResponseEntity.ok(ApiResponse.success("Zdjęcie główne zostało ustawione"));
    }

    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Dodaj/zmień avatar użytkownika")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @CurrentUser UserPrincipal userPrincipal) {

        User user = userPrincipal.getUser();

        if (user.getAvatarUrl() != null) {
            fileStorageService.deleteFile(user.getAvatarUrl());
        }

        String avatarUrl = fileStorageService.storeFile(file, "avatars", user.getId());
        userService.updateAvatar(user.getId(), avatarUrl);

        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", avatarUrl);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Usuń avatar użytkownika")
    public ResponseEntity<ApiResponse> deleteAvatar(@CurrentUser UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();

        if (user.getAvatarUrl() != null) {
            fileStorageService.deleteFile(user.getAvatarUrl());
            userService.updateAvatar(user.getId(), null);
        }

        return ResponseEntity.ok(ApiResponse.success("Avatar został usunięty"));
    }
}
