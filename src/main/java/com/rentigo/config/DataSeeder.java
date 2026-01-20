package com.rentigo.config;

import com.rentigo.entity.*;
import com.rentigo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final AmenityRepository amenityRepository;
    private final PlaceRepository placeRepository;
    private final PlaceImageRepository placeImageRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database with test data...");

        List<City> cities = seedCities();
        List<Amenity> amenities = seedAmenities();
        List<User> users = seedUsers();
        List<Place> places = seedPlaces(users, cities, amenities);
        seedReviews(users, places);

        log.info("Database seeded successfully!");
        log.info("Test users:");
        log.info("  - admin@rentigo.pl / admin123 (ADMIN)");
        log.info("  - host@rentigo.pl / host123 (HOST)");
        log.info("  - user@rentigo.pl / user123 (USER)");
    }

    private List<City> seedCities() {
        List<City> cities = Arrays.asList(
            City.builder().name("Kraków").country("Polska").build(),
            City.builder().name("Warszawa").country("Polska").build(),
            City.builder().name("Gdańsk").country("Polska").build(),
            City.builder().name("Wrocław").country("Polska").build(),
            City.builder().name("Poznań").country("Polska").build(),
            City.builder().name("Zakopane").country("Polska").build(),
            City.builder().name("Sopot").country("Polska").build(),
            City.builder().name("Łódź").country("Polska").build()
        );
        return cityRepository.saveAll(cities);
    }

    private List<Amenity> seedAmenities() {
        List<Amenity> amenities = Arrays.asList(
            Amenity.builder().name("WiFi").icon("wifi").build(),
            Amenity.builder().name("Klimatyzacja").icon("ac").build(),
            Amenity.builder().name("Kuchnia").icon("kitchen").build(),
            Amenity.builder().name("Pralka").icon("washer").build(),
            Amenity.builder().name("Telewizor").icon("tv").build(),
            Amenity.builder().name("Parking").icon("parking").build(),
            Amenity.builder().name("Balkon").icon("balcony").build(),
            Amenity.builder().name("Zwierzęta dozwolone").icon("pets").build(),
            Amenity.builder().name("Siłownia").icon("gym").build(),
            Amenity.builder().name("Basen").icon("pool").build(),
            Amenity.builder().name("Jacuzzi").icon("jacuzzi").build(),
            Amenity.builder().name("Grill").icon("grill").build()
        );
        return amenityRepository.saveAll(amenities);
    }

    private List<User> seedUsers() {
        List<User> users = new ArrayList<>();

        users.add(userRepository.save(User.builder()
            .email("admin@rentigo.pl")
            .password(passwordEncoder.encode("admin123"))
            .firstName("Admin")
            .lastName("Rentigo")
            .phone("+48 111 111 111")
            .avatarUrl("/images/placeholder.jpg")
            .role(Role.ADMIN)
            .build()));

        users.add(userRepository.save(User.builder()
            .email("host@rentigo.pl")
            .password(passwordEncoder.encode("host123"))
            .firstName("Jan")
            .lastName("Kowalski")
            .phone("+48 222 222 222")
            .avatarUrl("/images/placeholder.jpg")
            .role(Role.HOST)
            .build()));

        users.add(userRepository.save(User.builder()
            .email("host2@rentigo.pl")
            .password(passwordEncoder.encode("host123"))
            .firstName("Anna")
            .lastName("Nowak")
            .phone("+48 333 333 333")
            .avatarUrl("/images/placeholder.jpg")
            .role(Role.HOST)
            .build()));

        users.add(userRepository.save(User.builder()
            .email("user@rentigo.pl")
            .password(passwordEncoder.encode("user123"))
            .firstName("Piotr")
            .lastName("Wiśniewski")
            .phone("+48 444 444 444")
            .avatarUrl("/images/placeholder.jpg")
            .role(Role.USER)
            .build()));

        users.add(userRepository.save(User.builder()
            .email("user2@rentigo.pl")
            .password(passwordEncoder.encode("user123"))
            .firstName("Maria")
            .lastName("Dąbrowska")
            .phone("+48 555 555 555")
            .avatarUrl("/images/placeholder.jpg")
            .role(Role.USER)
            .build()));

        return users;
    }

    private List<Place> seedPlaces(List<User> users, List<City> cities, List<Amenity> amenities) {
        List<Place> places = new ArrayList<>();
        User host1 = users.get(1);
        User host2 = users.get(2);
        Random random = new Random(42);

        String[] placeNames = {
            "Apartament Stare Miasto", "Studio Kazimierz", "Loft Podgórze", "Apartament Wawel View",
            "Przytulne Studio", "Apartament Centrum", "Nowoczesny Loft", "Penthouse z Widokiem",
            "Kawalerka Nowy Świat", "Apartament Mokotów", "Studio Praga", "Loft Wola",
            "Apartament Śródmieście", "Przytulny Pokój", "Domek nad Morzem", "Villa Sopot",
            "Apartament Stare Miasto", "Studio Oliwa", "Loft Wrzeszcz", "Penthouse Gdańsk",
            "Apartament Rynek", "Studio Nadodrze", "Loft Krzyki", "Nowoczesny Apartament",
            "Apartament Stary Rynek", "Studio Jeżyce", "Przytulna Kawalerka", "Loft Poznań",
            "Chata Góralska", "Domek w Górach", "Apartament Krupówki", "Penthouse Zakopane"
        };

        String[] descriptions = {
            "Piękny apartament w samym sercu miasta. Idealne miejsce dla par i rodzin. Blisko wszystkich atrakcji turystycznych. Świeżo wyremontowany z nowoczesnymi udogodnieniami.",
            "Nowoczesne studio z pełnym wyposażeniem. Klimatyzacja, szybkie WiFi, smart TV. Doskonała lokalizacja blisko komunikacji miejskiej.",
            "Przestronny loft w industrialnym stylu. Wysokie sufity, duże okna, mnóstwo światła. Idealny dla osób ceniących design i wygodę.",
            "Ekskluzywny apartament z widokiem na miasto. Luksusowe wykończenie, pełne wyposażenie kuchni. Parking w cenie."
        };

        String[] districts = {"Stare Miasto", "Centrum", "Śródmieście", "Dzielnica turystyczna"};
        String[] addresses = {"ul. Główna 1", "ul. Rynkowa 15", "ul. Długa 42", "ul. Krótka 7", "ul. Słoneczna 23"};

        for (int i = 0; i < placeNames.length; i++) {
            City city = cities.get(i % cities.size());
            User owner = (i % 2 == 0) ? host1 : host2;
            PlaceType type = PlaceType.values()[i % PlaceType.values().length];

            Set<Amenity> placeAmenities = new HashSet<>();
            int amenityCount = 3 + random.nextInt(6);
            List<Amenity> shuffledAmenities = new ArrayList<>(amenities);
            Collections.shuffle(shuffledAmenities, random);
            for (int j = 0; j < Math.min(amenityCount, shuffledAmenities.size()); j++) {
                placeAmenities.add(shuffledAmenities.get(j));
            }

            Place place = Place.builder()
                .name(placeNames[i])
                .description(descriptions[i % descriptions.length])
                .city(city)
                .district(districts[i % districts.length])
                .address(addresses[i % addresses.length] + "/" + (i + 1))
                .type(type)
                .pricePerNight(BigDecimal.valueOf(150 + random.nextInt(350)))
                .cleaningFee(BigDecimal.valueOf(30 + random.nextInt(70)))
                .maxGuests(2 + random.nextInt(6))
                .bedrooms(1 + random.nextInt(3))
                .bathrooms(1 + random.nextInt(2))
                .singleBeds(random.nextInt(3))
                .doubleBeds(1 + random.nextInt(2))
                .area(30 + random.nextInt(70))
                .minStay(1)
                .maxStay(30)
                .status(PlaceStatus.ACTIVE)
                .owner(owner)
                .amenities(placeAmenities)
                .build();

            place = placeRepository.save(place);

            PlaceImage mainImage = PlaceImage.builder()
                .place(place)
                .url("/images/placeholder.jpg")
                .isMain(true)
                .displayOrder(0)
                .build();
            placeImageRepository.save(mainImage);

            places.add(place);
        }

        return places;
    }

    private void seedReviews(List<User> users, List<Place> places) {
        Random random = new Random(42);
        User user1 = users.get(3);
        User user2 = users.get(4);

        String[] comments = {
            "Świetne miejsce! Czysto, wygodnie, gospodarz bardzo pomocny. Polecam!",
            "Dobra lokalizacja, blisko centrum. Apartament zgodny z opisem.",
            "Bardzo ładne wnętrze, nowoczesne wyposażenie. Na pewno wrócę!",
            "Idealne na weekend. Wszystko działało bez zarzutu.",
            "Polecam! Świetny kontakt z właścicielem, czysto i przytulnie.",
            "Lokalizacja idealna, apartament czysty i dobrze wyposażony.",
            "Bardzo przyjemny pobyt, gospodarz uprzejmy i pomocny.",
            "Wygodne łóżko, cicha okolica. Polecam dla par."
        };

        for (int i = 0; i < places.size(); i++) {
            Place place = places.get(i);
            int reviewCount = 1 + random.nextInt(3);

            BigDecimal totalRating = BigDecimal.ZERO;

            for (int j = 0; j < reviewCount; j++) {
                User reviewer = (j % 2 == 0) ? user1 : user2;
                BigDecimal rating = BigDecimal.valueOf(7 + random.nextInt(3) + random.nextDouble());
                rating = rating.setScale(1, BigDecimal.ROUND_HALF_UP);
                if (rating.compareTo(BigDecimal.TEN) > 0) rating = BigDecimal.TEN;

                totalRating = totalRating.add(rating);

                Review review = Review.builder()
                    .place(place)
                    .user(reviewer)
                    .rating(rating)
                    .cleanlinessRating(BigDecimal.valueOf(7 + random.nextInt(3)).add(BigDecimal.valueOf(random.nextDouble())).setScale(1, BigDecimal.ROUND_HALF_UP))
                    .locationRating(BigDecimal.valueOf(7 + random.nextInt(3)).add(BigDecimal.valueOf(random.nextDouble())).setScale(1, BigDecimal.ROUND_HALF_UP))
                    .communicationRating(BigDecimal.valueOf(8 + random.nextInt(2)).add(BigDecimal.valueOf(random.nextDouble())).setScale(1, BigDecimal.ROUND_HALF_UP))
                    .valueRating(BigDecimal.valueOf(7 + random.nextInt(3)).add(BigDecimal.valueOf(random.nextDouble())).setScale(1, BigDecimal.ROUND_HALF_UP))
                    .comment(comments[(i + j) % comments.length])
                    .build();

                reviewRepository.save(review);
            }

            BigDecimal avgRating = totalRating.divide(BigDecimal.valueOf(reviewCount), 2, BigDecimal.ROUND_HALF_UP);
            place.setRating(avgRating);
            place.setReviewCount(reviewCount);
            placeRepository.save(place);
        }
    }
}
