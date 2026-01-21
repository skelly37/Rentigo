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
import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final AmenityRepository amenityRepository;
    private final PlaceRepository placeRepository;
    private final PlaceImageRepository placeImageRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database...");

        List<City> cities = createCities();
        List<Amenity> amenities = createAmenities();
        List<User> users = createUsers();
        List<Place> places = createPlaces(cities, amenities, users);
        createReservations(places, users);
        createReviews(places, users);
        createFavorites(places, users);

        log.info("Database seeded successfully!");
    }

    private List<City> createCities() {
        List<City> cities = Arrays.asList(
            City.builder().name("Kraków").country("Polska").build(),
            City.builder().name("Warszawa").country("Polska").build(),
            City.builder().name("Gdańsk").country("Polska").build(),
            City.builder().name("Wrocław").country("Polska").build(),
            City.builder().name("Poznań").country("Polska").build(),
            City.builder().name("Zakopane").country("Polska").build()
        );
        return cityRepository.saveAll(cities);
    }

    private List<Amenity> createAmenities() {
        List<Amenity> amenities = Arrays.asList(
            Amenity.builder().name("Wi-Fi").icon("wifi").build(),
            Amenity.builder().name("Kuchnia").icon("kitchen").build(),
            Amenity.builder().name("Pralka").icon("washing-machine").build(),
            Amenity.builder().name("Klimatyzacja").icon("ac").build(),
            Amenity.builder().name("Telewizor").icon("tv").build(),
            Amenity.builder().name("Parking").icon("parking").build(),
            Amenity.builder().name("Balkon").icon("balcony").build(),
            Amenity.builder().name("Winda").icon("elevator").build(),
            Amenity.builder().name("Zwierzęta").icon("pets").build(),
            Amenity.builder().name("Żelazko").icon("iron").build(),
            Amenity.builder().name("Suszarka").icon("hairdryer").build(),
            Amenity.builder().name("Ogrzewanie").icon("heating").build()
        );
        return amenityRepository.saveAll(amenities);
    }

    private List<User> createUsers() {
        List<User> users = Arrays.asList(
            User.builder().email("admin@rentigo.pl").password(passwordEncoder.encode("admin123"))
                .firstName("Admin").lastName("System").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.ADMIN).build(),
            User.builder().email("jan.kowalski@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Jan").lastName("Kowalski").phone("+48 123 456 789").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.HOST).build(),
            User.builder().email("anna.nowak@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Anna").lastName("Nowak").phone("+48 987 654 321").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.HOST).build(),
            User.builder().email("piotr.wisniewski@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Piotr").lastName("Wiśniewski").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.USER).build(),
            User.builder().email("maria.zielinska@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Maria").lastName("Zielińska").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.USER).build(),
            User.builder().email("tomasz.lewandowski@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Tomasz").lastName("Lewandowski").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.USER).build(),
            User.builder().email("katarzyna.dabrowska@example.com").password(passwordEncoder.encode("password123"))
                .firstName("Katarzyna").lastName("Dąbrowska").avatarUrl("/uploads/avatars/placeholder.jpg").role(Role.HOST).build()
        );
        return userRepository.saveAll(users);
    }

    private List<Place> createPlaces(List<City> cities, List<Amenity> amenities, List<User> users) {
        User host1 = users.get(1);
        User host2 = users.get(2);
        User host3 = users.get(6);
        City krakow = cities.get(0);
        City warszawa = cities.get(1);
        City gdansk = cities.get(2);
        City wroclaw = cities.get(3);
        City zakopane = cities.get(5);

        Set<Amenity> basicAmenities = new HashSet<>(amenities.subList(0, 6));
        Set<Amenity> fullAmenities = new HashSet<>(amenities);

        List<Place> places = new ArrayList<>();

        places.add(createPlace("Apartament Stare Miasto", krakow, "Stare Miasto",
            "Piękny apartament w samym sercu Krakowa, 2 minuty od Rynku Głównego. Idealny dla par i rodzin szukających komfortowego noclegu w zabytkowej kamienicy z widokiem na Sukiennice. Apartament wyposażony w pełni w aneks kuchenny, łazienkę z prysznicem oraz klimatyzację.",
            PlaceType.APARTMENT, new BigDecimal("320"), new BigDecimal("80"), 4, 2, 1, host1, fullAmenities));

        places.add(createPlace("Studio Kazimierz", krakow, "Kazimierz",
            "Przytulne studio w sercu artystycznej dzielnicy Kazimierz. W pobliżu liczne kawiarnie, galerie i restauracje. Idealne dla singli lub par. Nowoczesny design połączony z klimatem historycznej dzielnicy. W cenie miejsce parkingowe.",
            PlaceType.STUDIO, new BigDecimal("189"), new BigDecimal("50"), 2, 0, 1, host1, basicAmenities));

        places.add(createPlace("Loft Podgórze", krakow, "Podgórze",
            "Przestronny loft w industrialnym stylu w modnej dzielnicy Podgórze. 100m2 otwartej przestrzeni z wysokimi sufitami i dużymi oknami. Idealne dla grup przyjaciół lub rodzin z dziećmi. Taras na dachu z widokiem na Kraków.",
            PlaceType.LOFT, new BigDecimal("450"), new BigDecimal("100"), 6, 3, 2, host2, fullAmenities));

        places.add(createPlace("Apartament Nowa Huta", krakow, "Nowa Huta",
            "Unikatowy apartament w socrealistycznej architekturze Nowej Huty. Oryginalny wystrój lat 50-tych połączony z nowoczesnymi udogodnieniami. Doskonała baza wypadowa do zwiedzania tej fascynującej dzielnicy.",
            PlaceType.APARTMENT, new BigDecimal("180"), new BigDecimal("40"), 3, 1, 1, host3, basicAmenities));

        places.add(createPlace("Luksusowy Penthouse Centrum", warszawa, "Śródmieście",
            "Ekskluzywny penthouse z panoramicznym widokiem na Warszawę. 150m2 luksusu w samym centrum stolicy. Taras z jacuzzi, w pełni wyposażona kuchnia, 3 sypialnie. Idealne dla wymagających gości szukających najwyższego standardu.",
            PlaceType.APARTMENT, new BigDecimal("890"), new BigDecimal("150"), 6, 3, 2, host2, fullAmenities));

        places.add(createPlace("Studio Praga", warszawa, "Praga-Północ",
            "Artystyczne studio w hipsterskiej dzielnicy Praga. Industrialny design, oryginalne grafiki na ścianach, vintage meble. W pobliżu najmodniejsze kluby i galerie Warszawy. Dla miłośników alternatywnej kultury.",
            PlaceType.STUDIO, new BigDecimal("220"), new BigDecimal("60"), 2, 0, 1, host1, basicAmenities));

        places.add(createPlace("Apartament Stare Miasto Gdańsk", gdansk, "Stare Miasto",
            "Romantyczny apartament w zabytkowej kamienicy przy Długim Targu. Widok na fontannę Neptuna. Idealne dla par szukających niezapomnianych wrażeń. Stylowe wnętrze łączące historię z nowoczesnością.",
            PlaceType.APARTMENT, new BigDecimal("380"), new BigDecimal("90"), 4, 2, 1, host3, fullAmenities));

        places.add(createPlace("Dom z widokiem na morze", gdansk, "Sopot",
            "Piękny dom jednorodzinny 300m od plaży w Sopocie. Ogród, taras, grill. Idealne dla rodzin z dziećmi. 4 sypialnie, 2 łazienki, w pełni wyposażona kuchnia. Parking na 2 samochody.",
            PlaceType.HOUSE, new BigDecimal("650"), new BigDecimal("120"), 8, 4, 2, host2, fullAmenities));

        places.add(createPlace("Apartament Rynek Wrocław", wroclaw, "Stare Miasto",
            "Elegancki apartament przy Rynku we Wrocławiu. Widok na ratusz i kolorowe kamienice. Wysoki standard wykończenia, klimatyzacja, szybkie WiFi. Doskonała lokalizacja w sercu miasta.",
            PlaceType.APARTMENT, new BigDecimal("340"), new BigDecimal("75"), 4, 2, 1, host1, fullAmenities));

        places.add(createPlace("Pokój w Ostrowie Tumskim", wroclaw, "Ostrów Tumski",
            "Przytulny pokój w historycznej części Wrocławia. Wspólna kuchnia i łazienka. Idealne dla backpackerów i osób szukających budżetowego noclegu w świetnej lokalizacji.",
            PlaceType.ROOM, new BigDecimal("89"), new BigDecimal("20"), 2, 1, 1, host3, Set.of(amenities.get(0), amenities.get(4))));

        places.add(createPlace("Góralska Chata Zakopane", zakopane, "Centrum",
            "Autentyczna góralska chata w Zakopanem. Drewniane wnętrza, kominek, widok na Giewont. Idealna dla miłośników gór i tradycyjnej architektury. W zimie blisko wyciągów narciarskich.",
            PlaceType.HOUSE, new BigDecimal("520"), new BigDecimal("100"), 6, 3, 2, host2, fullAmenities));

        places.add(createPlace("Apartament Pod Tatrami", zakopane, "Krupówki",
            "Nowoczesny apartament przy słynnych Krupówkach. Balkon z widokiem na Tatry, sauna, jacuzzi. Luksusowy wypoczynek w górskim klimacie. 5 minut pieszo do Gubałówki.",
            PlaceType.APARTMENT, new BigDecimal("480"), new BigDecimal("90"), 4, 2, 1, host3, fullAmenities));

        List<Place> savedPlaces = placeRepository.saveAll(places);

        for (int i = 0; i < savedPlaces.size(); i++) {
            Place place = savedPlaces.get(i);
            PlaceImage mainImage = PlaceImage.builder()
                .place(place).url("/uploads/places/placeholder.jpg").isMain(true).displayOrder(0).build();
            placeImageRepository.save(mainImage);
        }

        return savedPlaces;
    }

    private Place createPlace(String name, City city, String district, String description,
                              PlaceType type, BigDecimal price, BigDecimal cleaningFee,
                              int maxGuests, int bedrooms, int bathrooms,
                              User owner, Set<Amenity> amenities) {
        return Place.builder()
            .name(name)
            .city(city)
            .district(district)
            .description(description)
            .address("ul. Przykładowa " + (int)(Math.random() * 100))
            .type(type)
            .pricePerNight(price)
            .cleaningFee(cleaningFee)
            .maxGuests(maxGuests)
            .bedrooms(bedrooms)
            .bathrooms(bathrooms)
            .singleBeds(bedrooms > 0 ? bedrooms : 1)
            .doubleBeds(bedrooms > 0 ? 1 : 0)
            .minStay(1)
            .maxStay(30)
            .status(PlaceStatus.ACTIVE)
            .owner(owner)
            .amenities(amenities)
            .build();
    }

    private void createReservations(List<Place> places, List<User> users) {
        User guest1 = users.get(3);
        User guest2 = users.get(4);
        User guest3 = users.get(5);

        List<Reservation> reservations = Arrays.asList(
            createReservation(places.get(0), guest1, LocalDate.now().plusDays(30), LocalDate.now().plusDays(33), 2, ReservationStatus.CONFIRMED),
            createReservation(places.get(0), guest2, LocalDate.now().plusDays(45), LocalDate.now().plusDays(48), 3, ReservationStatus.PENDING),
            createReservation(places.get(1), guest3, LocalDate.now().plusDays(15), LocalDate.now().plusDays(17), 2, ReservationStatus.CONFIRMED),
            createReservation(places.get(2), guest1, LocalDate.now().minusDays(10), LocalDate.now().minusDays(7), 4, ReservationStatus.COMPLETED),
            createReservation(places.get(3), guest2, LocalDate.now().plusDays(60), LocalDate.now().plusDays(65), 2, ReservationStatus.PENDING),
            createReservation(places.get(4), guest3, LocalDate.now().plusDays(20), LocalDate.now().plusDays(25), 4, ReservationStatus.CONFIRMED),
            createReservation(places.get(5), guest1, LocalDate.now().minusDays(30), LocalDate.now().minusDays(27), 2, ReservationStatus.COMPLETED),
            createReservation(places.get(6), guest2, LocalDate.now().plusDays(90), LocalDate.now().plusDays(95), 3, ReservationStatus.PENDING)
        );

        reservationRepository.saveAll(reservations);
    }

    private Reservation createReservation(Place place, User user, LocalDate checkIn, LocalDate checkOut, int guests, ReservationStatus status) {
        long nights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal nightsPrice = place.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal cleaningFee = place.getCleaningFee() != null ? place.getCleaningFee() : BigDecimal.ZERO;
        BigDecimal serviceFee = nightsPrice.multiply(new BigDecimal("0.10"));
        BigDecimal totalPrice = nightsPrice.add(cleaningFee).add(serviceFee);

        return Reservation.builder()
            .place(place)
            .user(user)
            .checkIn(checkIn)
            .checkOut(checkOut)
            .guests(guests)
            .nightsPrice(nightsPrice)
            .cleaningFee(cleaningFee)
            .serviceFee(serviceFee)
            .totalPrice(totalPrice)
            .status(status)
            .build();
    }

    private void createReviews(List<Place> places, List<User> users) {
        User guest1 = users.get(3);
        User guest2 = users.get(4);
        User guest3 = users.get(5);

        List<Review> reviews = Arrays.asList(
            createReview(places.get(0), guest1, new BigDecimal("9.5"), "Fantastyczny apartament! Lokalizacja idealna, wnętrze piękne i bardzo czyste."),
            createReview(places.get(0), guest2, new BigDecimal("8.8"), "Bardzo dobry nocleg, polecam. Drobne uwagi do wyposażenia kuchni."),
            createReview(places.get(1), guest3, new BigDecimal("9.0"), "Świetne studio, klimatyczna okolica. Na pewno wrócę!"),
            createReview(places.get(2), guest1, new BigDecimal("9.8"), "Najlepszy loft w jakim nocowałem. Widoki z tarasu zapierają dech."),
            createReview(places.get(2), guest2, new BigDecimal("9.2"), "Przestronny, czysty, świetna lokalizacja. Gospodarz bardzo pomocny."),
            createReview(places.get(4), guest3, new BigDecimal("10.0"), "Luksus w każdym calu! Widoki niesamowite, obsługa na najwyższym poziomie."),
            createReview(places.get(5), guest1, new BigDecimal("8.5"), "Ciekawe miejsce, klimat Pragi niepowtarzalny. Trochę głośno w nocy."),
            createReview(places.get(6), guest2, new BigDecimal("9.3"), "Piękny apartament z widokiem na Neptuna. Romantyczny weekend udany!"),
            createReview(places.get(7), guest3, new BigDecimal("9.7"), "Dom marzeń! Plaża blisko, ogród piękny, dzieci zachwycone."),
            createReview(places.get(10), guest1, new BigDecimal("9.4"), "Autentyczna góralska chata. Kominek wieczorem to czysta magia."),
            createReview(places.get(11), guest2, new BigDecimal("8.9"), "Świetna lokalizacja przy Krupówkach. Sauna po nartach to strzał w dziesiątkę!")
        );

        reviewRepository.saveAll(reviews);

        for (Place place : places) {
            BigDecimal avgRating = reviewRepository.calculateAverageRating(place);
            long count = reviewRepository.countByPlace(place);
            if (avgRating != null) {
                place.setRating(avgRating.setScale(1, java.math.RoundingMode.HALF_UP));
                place.setReviewCount((int) count);
                placeRepository.save(place);
            }
        }
    }

    private Review createReview(Place place, User user, BigDecimal rating, String comment) {
        return Review.builder()
            .place(place)
            .user(user)
            .rating(rating)
            .cleanlinessRating(rating.subtract(new BigDecimal("0.2")).max(BigDecimal.ONE))
            .locationRating(rating.add(new BigDecimal("0.1")).min(BigDecimal.TEN))
            .communicationRating(rating)
            .valueRating(rating.subtract(new BigDecimal("0.3")).max(BigDecimal.ONE))
            .comment(comment)
            .build();
    }

    private void createFavorites(List<Place> places, List<User> users) {
        User guest1 = users.get(3);
        User guest2 = users.get(4);
        User guest3 = users.get(5);

        List<Favorite> favorites = Arrays.asList(
            Favorite.builder().user(guest1).place(places.get(0)).build(),
            Favorite.builder().user(guest1).place(places.get(2)).build(),
            Favorite.builder().user(guest1).place(places.get(10)).build(),
            Favorite.builder().user(guest2).place(places.get(1)).build(),
            Favorite.builder().user(guest2).place(places.get(4)).build(),
            Favorite.builder().user(guest2).place(places.get(7)).build(),
            Favorite.builder().user(guest3).place(places.get(0)).build(),
            Favorite.builder().user(guest3).place(places.get(6)).build()
        );

        favoriteRepository.saveAll(favorites);
    }
}
