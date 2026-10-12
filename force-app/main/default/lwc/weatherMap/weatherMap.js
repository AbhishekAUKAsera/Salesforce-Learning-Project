import { LightningElement } from 'lwc';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CONDITIONS = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

export default class WeatherMap extends LightningElement {
    city = '';
    weather;
    mapMarkers = [];
    isLoading = false;
    errorMessage = '';
    requestId = 0;

    get hasWeather() {
        return Boolean(this.weather);
    }

    handleCityChange(event) {
        this.city = event.target.value;
    }

    async handleSearch(event) {
        event.preventDefault();
        const city = this.city.trim();

        if (!city || this.isLoading) {
            return;
        }

        const currentRequestId = ++this.requestId;
        this.isLoading = true;
        this.errorMessage = '';
        this.weather = undefined;
        this.mapMarkers = [];

        try {
            const locationResponse = await fetch(
                `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );
            if (!locationResponse.ok) {
                throw new Error('Location search is temporarily unavailable.');
            }

            const locationData = await locationResponse.json();
            const location = locationData.results?.[0];
            if (!location) {
                throw new Error(`No location found for "${city}". Try another city.`);
            }

            const weatherParams = new URLSearchParams({
                latitude: location.latitude,
                longitude: location.longitude,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
                timezone: 'auto'
            });
            const weatherResponse = await fetch(`${WEATHER_URL}?${weatherParams.toString()}`);
            if (!weatherResponse.ok) {
                throw new Error('Weather data is temporarily unavailable. Please try again.');
            }

            const weatherData = await weatherResponse.json();
            if (!weatherData.current) {
                throw new Error('No current weather data is available for this location.');
            }

            if (currentRequestId !== this.requestId) {
                return;
            }

            const current = weatherData.current;
            const placeName = [location.name, location.admin1, location.country]
                .filter(Boolean)
                .filter((part, index, parts) => parts.indexOf(part) === index)
                .join(', ');

            this.weather = {
                placeName,
                temperature: Math.round(current.temperature_2m),
                feelsLike: Math.round(current.apparent_temperature),
                humidity: current.relative_humidity_2m,
                windSpeed: current.wind_speed_10m,
                condition: WEATHER_CONDITIONS[current.weather_code] || 'Current conditions',
                observedAt: current.time,
                temperatureUnit: weatherData.current_units?.temperature_2m || '°C',
                windUnit: weatherData.current_units?.wind_speed_10m || 'km/h'
            };
            this.mapMarkers = [
                {
                    location: {
                        Latitude: location.latitude,
                        Longitude: location.longitude
                    },
                    title: placeName,
                    description: `${this.weather.condition} - ${this.weather.temperature}${this.weather.temperatureUnit}`
                }
            ];
        } catch (error) {
            if (currentRequestId === this.requestId) {
                this.errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Unable to load weather data. Please try again.';
            }
        } finally {
            if (currentRequestId === this.requestId) {
                this.isLoading = false;
            }
        }
    }
}
