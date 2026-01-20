const API_BASE = '/api';

const api = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!this.token;
    },

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.clearAuth();
            window.location.href = '/login.html';
            throw new Error('Sesja wygasła');
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            if (data?.data && typeof data.data === 'object') {
                const fieldTranslations = {
                    'name': 'Nazwa',
                    'description': 'Opis',
                    'cityId': 'Miasto',
                    'address': 'Adres',
                    'type': 'Typ',
                    'pricePerNight': 'Cena za noc',
                    'cleaningFee': 'Opłata za sprzątanie',
                    'maxGuests': 'Maksymalna liczba gości',
                    'bedrooms': 'Liczba sypialni',
                    'bathrooms': 'Liczba łazienek'
                };
                const errors = Object.entries(data.data)
                    .map(([field, message]) => {
                        const fieldName = fieldTranslations[field] || field;
                        return `${fieldName}: ${message}`;
                    })
                    .join('\n');
                throw new Error(errors || data?.message || 'Wystąpił błąd');
            }
            throw new Error(data?.message || 'Wystąpił błąd');
        }

        return data;
    },

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setAuth(data.token, data.user);
        return data;
    },

    async register(firstName, lastName, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        this.setAuth(data.token, data.user);
        return data;
    },

    async getMe() {
        return this.request('/users/me');
    },

    async updateMe(data) {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async upgradeToHost() {
        return this.request('/users/me/upgrade-to-host', { method: 'POST' });
    },

    async getPlaces(page = 0, size = 12) {
        return this.request(`/places?page=${page}&size=${size}`);
    },

    async searchPlaces(query, page = 0, size = 12) {
        return this.request(`/places/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    },

    async getPlacesByCity(cityId, guests = null, page = 0, size = 12) {
        let url = `/places/city/${cityId}?page=${page}&size=${size}`;
        if (guests) url += `&guests=${guests}`;
        return this.request(url);
    },

    async getPlace(id) {
        return this.request(`/places/${id}`);
    },

    async createPlace(data) {
        return this.request('/places', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updatePlace(id, data) {
        return this.request(`/places/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async getCities() {
        return this.request('/cities');
    },

    async getAmenities() {
        return this.request('/amenities');
    },

    async getReservations() {
        return this.request('/reservations');
    },

    async getUpcomingReservations() {
        return this.request('/reservations/upcoming');
    },

    async getPastReservations() {
        return this.request('/reservations/past');
    },

    async getCancelledReservations() {
        return this.request('/reservations/cancelled');
    },

    async createReservation(data) {
        return this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async cancelReservation(id) {
        return this.request(`/reservations/${id}/cancel`, { method: 'POST' });
    },

    async confirmReservation(id) {
        return this.request(`/reservations/${id}/confirm`, { method: 'POST' });
    },

    async getReviews(placeId) {
        return this.request(`/reviews/place/${placeId}`);
    },

    async getReviewSummary(placeId) {
        return this.request(`/reviews/place/${placeId}/summary`);
    },

    async createReview(data) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getFavorites() {
        return this.request('/favorites');
    },

    async toggleFavorite(placeId) {
        return this.request(`/favorites/${placeId}/toggle`, { method: 'POST' });
    },

    async addFavorite(placeId) {
        return this.request(`/favorites/${placeId}`, { method: 'POST' });
    },

    async removeFavorite(placeId) {
        return this.request(`/favorites/${placeId}`, { method: 'DELETE' });
    },

    async sendContact(data) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getMyPlaces() {
        return this.request('/host/places');
    },

    async getHostStats() {
        return this.request('/host/stats');
    }
};

function updateAuthUI() {
    const userAvatar = document.querySelector('.user-avatar');
    const loginBtn = document.querySelector('.login-btn');

    if (api.isLoggedIn() && api.user) {
        if (userAvatar) {
            userAvatar.textContent = api.user.initials || api.user.firstName?.charAt(0) + api.user.lastName?.charAt(0);
            userAvatar.href = 'profile.html';
            userAvatar.style.display = 'flex';
        }
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
    } else {
        if (userAvatar) {
            userAvatar.style.display = 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = 'block';
        }
    }
}

function showLoading(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Ładowanie...</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3>Wystąpił błąd</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Spróbuj ponownie</button>
        </div>
    `;
}

function showEmpty(container, message, actionHtml = '') {
    container.innerHTML = `
        <div class="empty-state">
            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <h3>${message}</h3>
            ${actionHtml}
        </div>
    `;
}

function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 0
    }).format(price);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

document.addEventListener('DOMContentLoaded', updateAuthUI);
