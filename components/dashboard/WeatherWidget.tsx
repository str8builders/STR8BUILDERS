import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  workSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun color="#F59E0B" size={32} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud color="#94A3B8" size={32} />;
      case 'rainy':
        return <CloudRain color="#3B82F6" size={32} />;
      default:
        return <Cloud color="#94A3B8" size={32} />;
    }
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
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      ) : weather ? (
        <>
          <Text style={styles.location}>{weather.location}</Text>
          
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weather.humidity}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Wind color="#94A3B8" size={16} />
              <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
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
    margin: 16,
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
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  tempContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
  },
  condition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
  },
  loadingText: {
    fontSize: 14,
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