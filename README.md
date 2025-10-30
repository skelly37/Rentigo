# Rentigo - Platforma do wynajmowania miejsc noclegowych

Rentigo to platforma internetowa umożliwiająca użytkownikom wyszukiwanie miejsc noclegowych w różnych miastach, a także dodawanie ogłoszeń przez właścicieli mieszkań.

## Wybór technologii

### Backend:
- **Java (Spring Boot)** - Wybór Javy jako technologii backendowej wynika z jej popularności i szerokiego wsparcia dla rozwoju aplikacji webowych. Spring Boot jest frameworkiem, który pozwala na szybkie tworzenie aplikacji, zapewniając łatwą konfigurację i integrację z bazą danych, co jest kluczowe w przypadku naszego systemu.
- **Baza danych (PostgreSQL)** - Relacyjna baza danych, w której przechowywane będą informacje o użytkownikach, ogłoszeniach, transakcjach i komunikacji. PostgreSQL został wybrany ze względu na swoje stabilność, wsparcie dla zaawansowanych operacji SQL oraz możliwość łatwej integracji z Java i Spring Boot.

### Frontend:
- **React** - React został wybrany jako framework frontendowy ze względu na swoją wydajność, komponentową strukturę oraz popularność wśród developerów. Dzięki Reactowi możemy tworzyć dynamiczne i interaktywne interfejsy użytkownika, co jest niezbędne w aplikacji, gdzie użytkownicy mogą przeglądać oferty w czasie rzeczywistym i wchodzić w interakcje z właścicielami mieszkań.
    - **React Router** - Do nawigacji po aplikacji. Pozwoli na wygodne przechodzenie między stronami bez konieczności przeładowania całej strony.
    - **Axios** - Używany do komunikacji z backendem. Dzięki Axios użytkownicy będą mogli bezpiecznie i efektywnie pobierać i wysyłać dane do backendu.

### Dodatkowe narzędzia:
- **JWT (JSON Web Token)** - Do implementacji uwierzytelniania i autoryzacji. JWT pozwala na bezpieczne zarządzanie sesjami użytkowników oraz zapewnia, że tylko autoryzowani użytkownicy będą mieli dostęp do odpowiednich funkcji.
- **Swagger/OpenAPI** - Do dokumentacji API. Dzięki Swaggerowi frontend i backend będą mogły się łatwo komunikować, a dokumentacja będzie zawsze aktualna i dostępna.
- **Bootstrap** - Framework CSS, który pozwoli na szybkie i łatwe tworzenie responsywnych, estetycznych interfejsów użytkownika.


## Projekt interfejsu (implementacja w następnych wydaniach)
![](./design/start.png)