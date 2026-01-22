package com.rentigo.service;

import com.rentigo.dto.UserDto;
import com.rentigo.dto.request.RegisterRequest;
import com.rentigo.dto.request.UpdateUserRequest;
import com.rentigo.entity.Role;
import com.rentigo.entity.User;
import com.rentigo.exception.BadRequestException;
import com.rentigo.exception.ConflictException;
import com.rentigo.exception.ForbiddenException;
import com.rentigo.exception.ResourceNotFoundException;
import com.rentigo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto toDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .avatarUrl(user.getAvatarUrl())
            .initials(user.getInitials())
            .role(user.getRole())
            .createdAt(user.getCreatedAt())
            .build();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Użytkownik nie znaleziony"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Użytkownik nie znaleziony"));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User createUser(RegisterRequest request) {
        if (existsByEmail(request.getEmail())) {
            throw new ConflictException("Email jest już zajęty");
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(Role.USER)
            .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = findById(userId);

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (existsByEmail(request.getEmail())) {
                throw new ConflictException("Email jest już zajęty");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getNewPassword() != null && request.getCurrentPassword() != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Nieprawidłowe obecne hasło");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void updateAvatar(Long userId, String avatarUrl) {
        User user = findById(userId);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
    }

    @Transactional
    public void upgradeToHost(Long userId) {
        User user = findById(userId);
        if (user.getRole() == Role.USER) {
            user.setRole(Role.HOST);
            userRepository.save(user);
        }
    }

    @Transactional
    public void deleteUser(Long userId, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Brak uprawnień - tylko administrator może usuwać użytkowników");
        }

        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("Nie możesz usunąć własnego konta");
        }

        User user = findById(userId);
        userRepository.delete(user);
    }
}
