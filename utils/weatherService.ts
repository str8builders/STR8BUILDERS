import { LocationData } from './locationService';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  workSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  feelsLike: number;
  description: string;
}

const calculateWorkSuitability = (
  temp: number,
  windSpeed: number,
  condition: string
): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
  let score = 100;

  if (temp < 0 || temp > 35) score -= 30;
  else if (temp < 5 || temp > 30) score -= 20;
  else if (temp < 10 || temp > 28) score -= 10;

  if (windSpeed > 40) score -= 30;
  else if (windSpeed > 30) score -= 20;
  else if (windSpeed > 20) score -= 10;

  const badConditions = ['rain', 'storm', 'thunderstorm', 'snow', 'hail'];
  if (badConditions.some(c => condition.toLowerCase().includes(c))) {
    score -= 25;
  }

  if (score >= 75) return 'Excellent';
  if (score >= 50) return 'Good';
  if (score >= 30) return 'Fair';
  return 'Poor';
};

export const getWeatherData = async (
  location: LocationData
): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    const current = data.current;

    const weatherCode = current.weather_code;
    const condition = getWeatherCondition(weatherCode);
    const locationString = location.city
      ? `${location.city}, ${location.country}`
      : location.country || 'Current Location';

    return {
      location: locationString,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: condition,
      description: getWeatherDescription(weatherCode),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      workSuitability: calculateWorkSuitability(
        current.temperature_2m,
        current.wind_speed_10m,
        condition
      ),
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rainy';
  if (code <= 86) return 'Snowy';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Fog';
  if (code <= 57) return 'Light drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown conditions';
};
