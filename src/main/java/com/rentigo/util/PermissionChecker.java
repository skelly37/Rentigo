package com.rentigo.util;

import com.rentigo.entity.Place;
import com.rentigo.entity.Reservation;
import com.rentigo.entity.Review;
import com.rentigo.entity.Role;
import com.rentigo.entity.User;
import com.rentigo.exception.ForbiddenException;

public class PermissionChecker {

    public static void checkPlaceOwnership(User user, Place place) {
        boolean isOwner = place.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Brak uprawnień");
        }
    }

    public static void checkReservationAccess(User user, Reservation reservation) {
        boolean isGuest = reservation.getUser().getId().equals(user.getId());
        boolean isHost = reservation.getPlace().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isGuest && !isHost && !isAdmin) {
            throw new ForbiddenException("Brak uprawnień");
        }
    }

    public static void checkReviewOwnership(User user, Review review) {
        boolean isOwner = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Brak uprawnień");
        }
    }

}
