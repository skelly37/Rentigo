package com.rentigo.service;

import com.rentigo.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload.base-dir}")
    private String baseDir;

    @Value("${file.upload.max-file-size}")
    private long maxFileSize;

    @Value("${file.upload.max-avatar-size}")
    private long maxAvatarSize;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    public String storeFile(MultipartFile file, String type, Long entityId) {
        validateImageFile(file, type.equals("avatars") ? maxAvatarSize : maxFileSize);

        String fileName = generateFileName(file.getOriginalFilename(), type, entityId);
        Path targetLocation = Paths.get(baseDir, type, fileName);

        try {
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("File stored successfully: {}", targetLocation);
            return "/uploads/" + type + "/" + fileName;
        } catch (IOException e) {
            log.error("Failed to store file: {}", fileName, e);
            throw new BadRequestException("Nie udało się zapisać pliku: " + e.getMessage());
        }
    }

    public void validateImageFile(MultipartFile file, long maxSizeBytes) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Plik jest pusty");
        }

        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("Plik jest za duży. Maksymalny rozmiar: " + (maxSizeBytes / 1024 / 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Nieprawidłowy format pliku. Dozwolone: JPG, PNG, GIF, WEBP");
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            String relativePath = fileUrl.substring("/uploads/".length());
            Path filePath = Paths.get(baseDir, relativePath);
            Files.deleteIfExists(filePath);
            log.info("File deleted successfully: {}", filePath);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", fileUrl, e);
        }
    }

    public String generateFileName(String originalName, String type, Long entityId) {
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String timestamp = String.valueOf(System.currentTimeMillis());
        String randomString = UUID.randomUUID().toString().substring(0, 8);

        return String.format("%s_%d_%s_%s%s", type, entityId, timestamp, randomString, extension);
    }
}
