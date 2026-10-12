import { createElement } from 'lwc';
import WeatherMap from 'c/weatherMap';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-weather-map', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.restoreAllMocks();
    });

    it('shows current conditions and a map marker for a matching city', async () => {
        global.fetch = jest
            .fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: 'Seattle',
                            admin1: 'Washington',
                            country: 'United States',
                            latitude: 47.6062,
                            longitude: -122.3321
                        }
                    ]
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    current: {
                        temperature_2m: 18.4,
                        relative_humidity_2m: 62,
                        apparent_temperature: 17.8,
                        weather_code: 2,
                        wind_speed_10m: 9.5,
                        time: '2026-10-12T12:00'
                    },
                    current_units: {
                        temperature_2m: '°C',
                        wind_speed_10m: 'km/h'
                    }
                })
            });

        const element = createElement('c-weather-map', { is: WeatherMap });
        document.body.appendChild(element);

        const cityInput = element.shadowRoot.querySelector('lightning-input');
        cityInput.value = 'Seattle';
        cityInput.dispatchEvent(new CustomEvent('change'));
        element.shadowRoot.querySelector('form').dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true })
        );
        await flushPromises();
        await flushPromises();

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(element.shadowRoot.textContent).toContain('Seattle, Washington, United States');
        expect(element.shadowRoot.textContent).toContain('Partly cloudy');
        expect(element.shadowRoot.textContent).toContain('18°C');
        expect(element.shadowRoot.querySelector('lightning-map').mapMarkers).toEqual([
            {
                location: { Latitude: 47.6062, Longitude: -122.3321 },
                title: 'Seattle, Washington, United States',
                description: 'Partly cloudy - 18°C'
            }
        ]);
    });

    it('shows a helpful message when no matching city is found', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] })
        });

        const element = createElement('c-weather-map', { is: WeatherMap });
        document.body.appendChild(element);
        const cityInput = element.shadowRoot.querySelector('lightning-input');
        cityInput.value = 'No Such City';
        cityInput.dispatchEvent(new CustomEvent('change'));
        element.shadowRoot.querySelector('form').dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true })
        );
        await flushPromises();

        expect(element.shadowRoot.querySelector('[role="alert"]').textContent).toContain(
            'No location found'
        );
    });
});
