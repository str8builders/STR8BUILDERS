import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Cloud, Sun, CloudRain, Wind, MapPin, Droplets } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { getCurrentLocation } from '../../utils/locationService';
import { getWeatherData, WeatherData } from '../../utils/weatherService';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      if (!location) {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const weatherData = await getWeatherData(location);
      if (!weatherData) {
        setError('Failed to fetch weather data');
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Unable to load weather');
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) return <Sun color="#F59E0B" size={32} />;
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunder'))
      return <CloudRain color="#3B82F6" size={32} />;
    if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog'))
      return <Cloud color="#94A3B8" size={32} />;
    if (cond.includes('snow')) return <Cloud color="#60A5FA" size={32} />;
    return <Cloud color="#94A3B8" size={32} />;
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent':
        return '#10B981';
      case 'Good':
        return '#F59E0B';
      case 'Fair':
        return '#EF4444';
      case 'Poor':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  return (
    <GlassCard variant="cyan" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
        {loading ? (
          <Cloud color="#94A3B8" size={32} />
        ) : weather ? (
          getWeatherIcon(weather.condition)
        ) : (
          <Cloud color="#94A3B8" size={32} />
        )}
      </View>
      
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Weather data unavailable</Text>
          <Text style={styles.emptySubtext}>{error}. Enable location services to get weather updates</Text>
        </View>
      ) : weather ? (
        <>
          <View style={styles.locationRow}>
            <MapPin color="#06B6D4" size={14} />
            <Text style={styles.location}>{weather.location}</Text>
          </View>

          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
            <Text style={styles.description}>{weather.description}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Droplets color="#3B82F6" size={16} />
              <View>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Wind color="#10B981" size={16} />
              <View>
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
              </View>
            </View>
          </View>

          <View style={styles.suitability}>
            <Text style={styles.suitabilityLabel}>Work Conditions:</Text>
            <Text style={[styles.suitabilityValue, { color: getSuitabilityColor(weather.workSuitability) }]}>
              {weather.workSuitability}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Weather data unavailable</Text>
          <Text style={styles.emptySubtext}>Enable location services to get weather updates</Text>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#06B6D4',
  },
  tempContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  condition: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#E2E8F0',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  suitability: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  suitabilityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  suitabilityValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});