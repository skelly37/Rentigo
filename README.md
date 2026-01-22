# Rentigo - Platforma do wynajmowania miejsc noclegowych

Rentigo to nowoczesna platforma internetowa umożliwiająca użytkownikom wyszukiwanie i rezerwację miejsc noclegowych w różnych miastach Polski, a także dodawanie ogłoszeń przez właścicieli nieruchomości.

## Spis treści
- [Wybór technologii](#wybór-technologii)
- [Architektura](#architektura)
- [Diagram ERD](#diagram-erd)
- [Funkcjonalności](#funkcjonalności)
- [Role użytkowników](#role-użytkowników)
- [Instrukcja uruchomienia](#instrukcja-uruchomienia)
- [Dokumentacja API](#dokumentacja-api)

## Wybór technologii

### Backend

| Technologia           | Wersja | Uzasadnienie                                                                                       |
|-----------------------|--------|----------------------------------------------------------------------------------------------------|
| **Java**              | 11     | Stabilność, wydajność, bogaty ekosystem bibliotek i szeroka społeczność                            |
| **Spring Boot**       | 2.7.18 | Szybkie tworzenie aplikacji, autowiring, bogata integracja z bazami danych i systemami kolejkowymi |
| **Spring Security**   | 5.7.x  | Kompleksowe rozwiązanie do uwierzytelniania i autoryzacji                                          |
| **Spring Data JPA**   | 2.7.x  | Uproszczony dostęp do bazy danych, automatyczne generowanie zapytań                                |
| **PostgreSQL**        | 15+    | Stabilna relacyjna baza danych, wsparcie dla JSON, zaawansowane indeksowanie                       |
| **JWT (jjwt)**        | 0.11.5 | Bezstanowe uwierzytelnianie, skalowalność, bezpieczeństwo                                          |
| **RabbitMQ**          | 3.x    | Asynchroniczne przetwarzanie powiadomień, niezawodność, wsparcie dla wzorców pub/sub               |
| **Lombok**            | 1.18.x | Redukcja boilerplate code, czytelniejszy kod                                                       |
| **SpringDoc OpenAPI** | 1.7.0  | Automatyczna generacja dokumentacji API, Swagger UI                                                |

### Frontend

| Technologia      | Wersja  | Uzasadnienie                                                                         |
|------------------|---------|--------------------------------------------------------------------------------------|
| **React**        | 18.2.0  | Nowoczesna biblioteka UI, komponentowy model, wydajne renderowanie, bogaty ekosystem |
| **React Router** | 6.20.0  | Routing po stronie klienta, SPA navigation, protected routes                         |
| **Vite**         | 5.0.8   | Szybki build tool, HMR (Hot Module Replacement), optymalizacja produkcyjna           |
| **Fetch API**    | Native  | Natywna obsługa HTTP, Promise-based, czysty kod                                      |
| **CSS3**         | -       | Responsywny design z media queries, Flexbox/Grid, mobile-first approach              |

### Dodatkowe narzędzia

- **Maven** - Zarządzanie zależnościami i budowanie projektu
- **Git** - System kontroli wersji
- **Docker** (opcjonalnie) - Konteneryzacja aplikacji

## Architektura

Aplikacja wykorzystuje **warstwową architekturę** (Layered Architecture):

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              HTML / CSS / JavaScript                │    │
│  │         (login, search, hotel, profile, etc.)       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                        │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐       │
│  │   Auth   │ │  Place   │ │Reservation│ │  Review  │       │
│  │Controller│ │Controller│ │Controller │ │Controller│       │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐       │
│  │   User   │ │ Favorite │ │   City    │ │ Amenity  │       │
│  │Controller│ │Controller│ │Controller │ │Controller│       │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                          │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐       │
│  │   User   │ │  Place   │ │Reservation│ │  Review  │       │
│  │ Service  │ │ Service  │ │  Service  │ │ Service  │       │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘       │
│  ┌──────────────────┐  ┌──────────────────────────┐         │
│  │ FavoriteService  │  │   NotificationService    │         │
│  └──────────────────┘  └──────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐       │
│  │   User   │ │  Place   │ │Reservation│ │  Review  │       │
│  │Repository│ │Repository│ │Repository │ │Repository│       │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────────────┐  ┌─────────────────────┐           │
│  │     PostgreSQL      │  │      RabbitMQ       │           │
│  │   (Persistence)     │  │  (Message Queue)    │           │
│  └─────────────────────┘  └─────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Przepływ JWT Authentication

```
┌──────────┐     POST /api/auth/login      ┌──────────┐
│  Client  │ ─────────────────────────────▶│  Server  │
│          │   {email, password}           │          │
│          │                               │          │
│          │◀───────────────────────────── │          │
│          │   {token, user}               │          │
│          │                               │          │
│          │   GET /api/places             │          │
│          │ ─────────────────────────────▶│          │
│          │   Authorization: Bearer <JWT> │          │
│          │                               │          │
│          │◀───────────────────────────── │          │
└──────────┘   {places data}               └──────────┘
```

### Architektura Frontend (React)

```
┌────────────────────────────────────────────────────────┐
│                    React Application                   │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │              React Router (SPA)                  │  │
│  │  - Route Guards (PrivateRoute)                   │  │
│  │  - Dynamic routing (/place/:id)                  │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                             │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │           Context API (AuthContext)              │  │
│  │  - User state management                         │  │
│  │  - Token management                              │  │
│  │  - Login/Logout functions                        │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                             │
│  ┌──────────────┬────────┴────────┬──────────────┐     │
│  │   Pages      │   Components    │   Services   │     │
│  │  - HomePage  │   - Navbar      │   - api.js   │     │
│  │  - SearchPage│   - Footer      │   - Fetch    │     │
│  │  - Profile   │   - Layout      │              │     │
│  │  - ...       │   - Cards       │              │     │
│  └──────────────┴─────────────────┴──────────────┘     │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   REST API (Backend)  │
              │   Spring Boot :8080   │
              └───────────────────────┘
```

**Kluczowe koncepcje React:**
- **Komponenty** - Modularne, wielokrotnego użytku elementy UI
- **Hooks** - useState, useEffect, useContext dla zarządzania stanem
- **Context API** - Globalne zarządzanie stanem autoryzacji
- **React Router** - Client-side routing, SPA navigation
- **Vite** - Szybki build tool z HMR dla lepszego DX

## Diagram ERD

```
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│      users        │       │      places       │       │      cities       │
├───────────────────┤       ├───────────────────┤       ├───────────────────┤
│ PK id             │       │ PK id             │       │ PK id             │
│    email (unique) │       │ FK owner_id       │   ┌───│    name           │
│    password       │       │ FK city_id ───────┼───┘   │    country        │
│    first_name     │       │    name           │       │    created_at     │
│    last_name      │       │    description    │       └───────────────────┘
│    phone          │       │    address        │
│    role           │       │    type           │       ┌───────────────────┐
│    avatar_url     │       │    price_per_night│       │    amenities      │
│    created_at     │       │    max_guests     │       ├───────────────────┤
│    updated_at     │       │    bedrooms       │       │ PK id             │
└────────┬──────────┘       │    bathrooms      │       │    name           │
         │                  │    area           │       │    icon           │
         │                  │    status         │       └─────────┬─────────┘
         │                  │    created_at     │                 │
         │                  │    updated_at     │                 │
         │                  └─────────┬─────────┘                 │
         │                            │                           │
         │                            │     ┌─────────────────────┘
         │                            │     │
         │                  ┌─────────┴─────┴─────┐
         │                  │   place_amenities   │
         │                  ├─────────────────────┤
         │                  │ FK place_id         │
         │                  │ FK amenity_id       │
         │                  └─────────────────────┘
         │
         │                  ┌───────────────────┐
         │                  │   place_images    │
         │                  ├───────────────────┤
         │                  │ PK id             │
         │                  │ FK place_id ──────┼──────┐
         │                  │    url            │      │
         │                  │    is_main        │      │
         │                  │    display_order  │      │
         │                  └───────────────────┘      │
         │                                             │
         ├─────────────────────────────────────────────┤
         │                                             │
         │                  ┌───────────────────┐      │
         ├──────────────────┤   reservations    │      │
         │                  ├───────────────────┤      │
         │                  │ PK id             │      │
         │                  │ FK user_id ───────┼──────┤
         │                  │ FK place_id ──────┼──────┘
         │                  │    reservation_num│
         │                  │    check_in       │
         │                  │    check_out      │
         │                  │    guests         │
         │                  │    total_price    │
         │                  │    status         │
         │                  │    created_at     │
         │                  └───────────────────┘
         │
         │                  ┌───────────────────┐
         ├──────────────────┤     reviews       │
         │                  ├───────────────────┤
         │                  │ PK id             │
         │                  │ FK user_id ───────┤
         │                  │ FK place_id ──────┤
         │                  │    rating         │
         │                  │    cleanliness    │
         │                  │    location       │
         │                  │    value          │
         │                  │    communication  │
         │                  │    comment        │
         │                  │    created_at     │
         │                  └───────────────────┘
         │
         │                  ┌───────────────────┐
         ├──────────────────┤    favorites      │
         │                  ├───────────────────┤
         │                  │ PK id             │
         │                  │ FK user_id        │
         │                  │ FK place_id       │
         │                  │    created_at     │
         │                  └───────────────────┘
         │
         │                  ┌───────────────────┐
         └──────────────────┤     messages      │
                            ├───────────────────┤
                            │ PK id             │
                            │ FK reservation_id │
                            │ FK sender_id      │
                            │    content        │
                            │    created_at     │
                            └───────────────────┘

┌───────────────────┐
│ contact_messages  │
├───────────────────┤
│ PK id             │
│    first_name     │
│    last_name      │
│    email          │
│    subject        │
│    message        │
│    read           │
│    created_at     │
└───────────────────┘
```

### Tabele w bazie danych (10 tabel + 1 junction)

| Tabela           | Opis                                  | Liczba rekordów (seed)  |
|------------------|---------------------------------------|-------------------------|
| users            | Użytkownicy systemu                   | 7                       |
| cities           | Miasta dostępne w systemie            | 6                       |
| amenities        | Udogodnienia dostępne dla miejsc      | 12                      |
| places           | Miejsca noclegowe                     | 12                      |
| place_amenities  | Relacja many-to-many places-amenities | ~50                     |
| place_images     | Zdjęcia miejsc                        | 12                      |
| reservations     | Rezerwacje                            | 8                       |
| reviews          | Recenzje miejsc                       | 11                      |
| favorites        | Ulubione miejsca użytkowników         | 8                       |
| messages         | Wiadomości w ramach rezerwacji        | 0                       |
| contact_messages | Wiadomości z formularza kontaktowego  | 0                       |

**Łącznie: 30+ rekordów testowych**

## Funkcjonalności

### Zaimplementowane

| Funkcjonalność           | Status  | Opis                                                            |
|--------------------------|---------|-----------------------------------------------------------------|
| Rejestracja użytkownika  | ✅       | Tworzenie nowego konta z walidacją                              |
| Logowanie                | ✅       | Uwierzytelnianie JWT                                            |
| Wyszukiwanie miejsc      | ✅       | Po mieście, liczbie gości                                       |
| Przeglądanie ofert       | ✅       | Lista wszystkich miejsc                                         |
| Szczegóły miejsca        | ✅       | Pełne informacje, zdjęcia, recenzje                             |
| Rezerwacja               | ✅       | Tworzenie rezerwacji z walidacją dat i dynamiczną ceną          |
| Moje rezerwacje          | ✅       | Lista rezerwacji użytkownika (nadchodzące, przeszłe, anulowane) |
| Anulowanie rezerwacji    | ✅       | Możliwość anulowania przez gościa                               |
| Potwierdzanie rezerwacji | ✅       | Zatwierdzanie rezerwacji przez gospodarza                       |
| Komunikacja host-gość    | ✅       | Czat między gościem a gospodarzem w ramach rezerwacji           |
| Recenzje                 | ✅       | Dodawanie ocen miejsc po zakończonym pobycie                    |
| Ulubione                 | ✅       | Dodawanie/usuwanie z ulubionych                                 |
| Panel gospodarza         | ✅       | Zarządzanie własnymi miejscami i statystyki                     |
| Dodawanie miejsca        | ✅       | Tworzenie nowego ogłoszenia                                     |
| Edycja miejsca           | ✅       | Aktualizacja istniejącego ogłoszenia                            |
| Usuwanie miejsca         | ✅       | Możliwość usunięcia miejsca przez gospodarza                    |
| Zarządzanie zdjęciami    | ✅       | Dodawanie, usuwanie i ustawianie głównego zdjęcia               |
| Profil użytkownika       | ✅       | Edycja danych osobowych (imię, nazwisko, email, hasło, avatar)  |
| Upgrade do HOST          | ✅       | Zmiana roli na gospodarza                                       |
| Formularz kontaktowy     | ✅       | Wysyłanie wiadomości                                            |
| Powiadomienia async      | ✅       | RabbitMQ dla powiadomień                                        |
| Dokumentacja API         | ✅       | Swagger UI                                                      |

## Role użytkowników

| Rola      | Uprawnienia                                                          |
|-----------|----------------------------------------------------------------------|
| **USER**  | Przeglądanie miejsc, rezerwacje, recenzje, ulubione                  |
| **HOST**  | Wszystko co USER + dodawanie/edycja miejsc, zarządzanie rezerwacjami |
| **ADMIN** | Pełny dostęp do systemu                                              |

## Instrukcja uruchomienia

### Wymagania

- Java 17+
- Maven 3.8+
- Docker & Docker Compose (dla PostgreSQL i RabbitMQ)
- Node.js 18+ (opcjonalnie, dla developmentu frontendu)
- npm 9+ (opcjonalnie, dla developmentu frontendu)

### Automatyczne uruchomienie (zalecane)

Aplikacja automatycznie:
- ✅ Uruchamia PostgreSQL i RabbitMQ w Dockerze
- ✅ Tworzy bazę danych `rentigo`
- ✅ Tworzy wszystkie tabele (Hibernate auto-ddl)
- ✅ Wczytuje dane testowe (DataLoader)
- ✅ Buduje i uruchamia aplikację

### Krok 1: Uruchomienie aplikacji

#### Opcja A: Uruchomienie pełnej aplikacji (zalecane)

**Pierwsze uruchomienie (fresh start):**
```bash
./start-fresh.sh
```

**Kolejne uruchomienia (restart):**
```bash
./restart.sh
```

**Zatrzymanie:**
```bash
./stop.sh
```

Aplikacja będzie dostępna pod adresem: http://localhost:8080

#### Opcja B: Development mode z Hot Reload (dla developmentu frontendu)

**Terminal 1 - Uruchom backend i usługi:**
```bash
./restart.sh
```

**Terminal 2 - Frontend dev server:**
```bash
cd frontend
npm install
npm run dev
```

Frontend dev server: http://localhost:3000 (z Hot Module Replacement)
Backend API: http://localhost:8080

### Krok 2: Dostęp do aplikacji

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

### Domyślne konta testowe

| Email                           | Hasło       | Rola   |
|---------------------------------|-------------|--------|
| admin@rentigo.pl                | admin123    | ADMIN  |
| jan.kowalski@example.com        | password123 | HOST   |
| anna.nowak@example.com          | password123 | HOST   |
| katarzyna.dabrowska@example.com | password123 | HOST   |
| piotr.wisniewski@example.com    | password123 | USER   |
| maria.zielinska@example.com     | password123 | USER   |
| tomasz.lewandowski@example.com  | password123 | USER   |

## Dokumentacja API

### Endpointy autoryzacji

| Metoda  | Endpoint             | Opis                           |
|---------|----------------------|--------------------------------|
| POST    | `/api/auth/register` | Rejestracja nowego użytkownika |
| POST    | `/api/auth/login`    | Logowanie, zwraca JWT token    |

### Endpointy użytkowników

| Metoda  | Endpoint                        | Opis                                  | Auth    |
|---------|---------------------------------|---------------------------------------|---------|
| GET     | `/api/users/me`                 | Pobierz dane zalogowanego użytkownika | ✅       |
| PUT     | `/api/users/me`                 | Aktualizuj dane użytkownika           | ✅       |
| POST    | `/api/users/me/upgrade-to-host` | Upgrade do roli HOST                  | ✅       |
| DELETE  | `/api/users/{id}`               | Usuń użytkownika                      | ✅ ADMIN |

### Endpointy miejsc

| Metoda  | Endpoint                       | Opis                    | Auth   |
|---------|--------------------------------|-------------------------|--------|
| GET     | `/api/places`                  | Lista wszystkich miejsc | ❌      |
| GET     | `/api/places/{id}`             | Szczegóły miejsca       | ❌      |
| GET     | `/api/places/search?q={query}` | Wyszukiwanie miejsc     | ❌      |
| GET     | `/api/places/city/{cityId}`    | Miejsca w mieście       | ❌      |
| POST    | `/api/places`                  | Utwórz nowe miejsce     | ✅ HOST |
| PUT     | `/api/places/{id}`             | Aktualizuj miejsce      | ✅ HOST |
| PATCH   | `/api/places/{id}/status`      | Zmień status miejsca    | ✅ HOST |
| DELETE  | `/api/places/{id}`             | Usuń miejsce            | ✅ HOST |

### Endpointy rezerwacji

| Metoda  | Endpoint                         | Opis                                | Auth    |
|---------|----------------------------------|-------------------------------------|---------|
| GET     | `/api/reservations`              | Moje rezerwacje                     | ✅       |
| GET     | `/api/reservations/{id}`         | Szczegóły rezerwacji                | ✅       |
| GET     | `/api/reservations/upcoming`     | Nadchodzące rezerwacje              | ✅       |
| GET     | `/api/reservations/past`         | Przeszłe rezerwacje                 | ✅       |
| GET     | `/api/reservations/cancelled`    | Anulowane rezerwacje                | ✅       |
| GET     | `/api/reservations/host`         | Rezerwacje moich miejsc (gospodarz) | ✅ HOST  |
| POST    | `/api/reservations`              | Utwórz rezerwację                   | ✅       |
| POST    | `/api/reservations/{id}/cancel`  | Anuluj rezerwację                   | ✅       |
| POST    | `/api/reservations/{id}/confirm` | Potwierdź rezerwację                | ✅ HOST  |
| DELETE  | `/api/reservations/{id}`         | Usuń rezerwację                     | ✅ ADMIN |

### Endpointy recenzji

| Metoda  | Endpoint                               | Opis              | Auth  |
|---------|----------------------------------------|-------------------|-------|
| GET     | `/api/reviews/place/{placeId}`         | Recenzje miejsca  | ❌     |
| GET     | `/api/reviews/place/{placeId}/summary` | Podsumowanie ocen | ❌     |
| POST    | `/api/reviews`                         | Dodaj recenzję    | ✅     |

### Endpointy ulubionych

| Metoda  | Endpoint                          | Opis            | Auth  |
|---------|-----------------------------------|-----------------|-------|
| GET     | `/api/favorites`                  | Moje ulubione   | ✅     |
| POST    | `/api/favorites/{placeId}/toggle` | Toggle ulubione | ✅     |

### Endpointy gospodarza

| Metoda  | Endpoint                                  | Opis                   | Auth   |
|---------|-------------------------------------------|------------------------|--------|
| GET     | `/api/host/places`                        | Moje miejsca           | ✅ HOST |
| GET     | `/api/host/places/{placeId}/reservations` | Rezerwacje dla miejsca | ✅ HOST |
| GET     | `/api/host/stats`                         | Statystyki gospodarza  | ✅ HOST |

### Endpointy wiadomości (komunikacja host-gość)

| Metoda  | Endpoint                                    | Opis                              | Auth  |
|---------|---------------------------------------------|-----------------------------------|-------|
| GET     | `/api/messages/reservation/{reservationId}` | Pobierz wiadomości dla rezerwacji | ✅     |
| POST    | `/api/messages`                             | Wyślij wiadomość                  | ✅     |

### Endpointy zarządzania zdjęciami

| Metoda  | Endpoint                                      | Opis                           | Auth   |
|---------|-----------------------------------------------|--------------------------------|--------|
| POST    | `/api/files/places/{placeId}/images`          | Dodaj zdjęcie do miejsca       | ✅ HOST |
| DELETE  | `/api/files/places/images/{imageId}`          | Usuń zdjęcie                   | ✅ HOST |
| PATCH   | `/api/files/places/images/{imageId}/set-main` | Ustaw jako główne zdjęcie      | ✅ HOST |
| POST    | `/api/files/avatar`                           | Dodaj/zmień avatar użytkownika | ✅      |
| DELETE  | `/api/files/avatar`                           | Usuń avatar użytkownika        | ✅      |

### Pozostałe endpointy

| Metoda  | Endpoint         | Opis             | Auth  |
|---------|------------------|------------------|-------|
| GET     | `/api/cities`    | Lista miast      | ❌     |
| GET     | `/api/amenities` | Lista udogodnień | ❌     |
| POST    | `/api/contact`   | Wyślij wiadomość | ❌     |

## Licencja

Projekt edukacyjny.
