import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, XCircle, Clock, Settings, TrendingUp, CloudSnow, Zap, Eye, Calendar } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';

interface WeatherForecast {
  time: string;
  temp: number;
  condition: string;
  windSpeed: number;
  windGust: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
}

interface TradeImpact {
  score: number;
  label: string;
  color: string;
  risks: string[];
  recommendations: string[];
}

const TRADE_TYPES = [
  { id: 'roofing', label: 'Roofing', icon: '🏠' },
  { id: 'painting', label: 'Painting', icon: '🎨' },
  { id: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { id: 'concrete', label: 'Concrete', icon: '🏗️' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪚' },
  { id: 'bricklaying', label: 'Bricklaying', icon: '🧱' },
  { id: 'scaffolding', label: 'Scaffolding', icon: '🏗️' },
  { id: 'hvac', label: 'HVAC', icon: '❄️' },
];

export const TradeWeatherImpact: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<string>('roofing');
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [location, setLocation] = useState('Auckland, NZ');
  const [workStartTime, setWorkStartTime] = useState('07:00');
  const [workEndTime, setWorkEndTime] = useState('17:00');
  const [outdoorPercentage, setOutdoorPercentage] = useState(80);

  useEffect(() => {
    loadWeatherForecast();
  }, []);

  const loadWeatherForecast = async () => {
    setLoading(true);

    setTimeout(() => {
      const mockForecast: WeatherForecast[] = [
        { time: '06:00', temp: 12, condition: 'Partly Cloudy', windSpeed: 15, windGust: 25, humidity: 75, precipitation: 10, uvIndex: 2, visibility: 10 },
        { time: '09:00', temp: 16, condition: 'Sunny', windSpeed: 20, windGust: 30, humidity: 65, precipitation: 5, uvIndex: 5, visibility: 15 },
        { time: '12:00', temp: 20, condition: 'Sunny', windSpeed: 25, windGust: 35, humidity: 55, precipitation: 0, uvIndex: 8, visibility: 20 },
        { time: '15:00', temp: 19, condition: 'Partly Cloudy', windSpeed: 22, windGust: 32, humidity: 60, precipitation: 15, uvIndex: 6, visibility: 15 },
        { time: '18:00', temp: 15, condition: 'Cloudy', windSpeed: 18, windGust: 28, humidity: 70, precipitation: 30, uvIndex: 2, visibility: 12 },
      ];
      setForecast(mockForecast);
      setLoading(false);
    }, 1000);
  };

  const calculateTradeImpact = (weather: WeatherForecast): TradeImpact => {
    let score = 100;
    const risks: string[] = [];
    const recommendations: string[] = [];

    switch (selectedTrade) {
      case 'roofing':
        if (weather.windSpeed > 20) {
          score -= 30;
          risks.push('High winds - dangerous for roof work');
          recommendations.push('Postpone work if wind gusts exceed 40 km/h');
        }
        if (weather.precipitation > 20) {
          score -= 40;
          risks.push('Rain makes surfaces slippery');
          recommendations.push('Wait for dry conditions');
        }
        if (weather.temp > 30) {
          score -= 15;
          risks.push('Extreme heat on roof surface');
          recommendations.push('Start early, take frequent breaks');
        }
        if (weather.temp < 5) {
          score -= 20;
          risks.push('Cold affects material flexibility');
          recommendations.push('Use cold-weather approved materials');
        }
        break;

      case 'painting':
        if (weather.humidity > 70) {
          score -= 35;
          risks.push('High humidity slows drying time');
          recommendations.push('Use fast-dry paint or wait for better conditions');
        }
        if (weather.precipitation > 10) {
          score -= 50;
          risks.push('Rain will ruin fresh paint');
          recommendations.push('Avoid outdoor painting');
        }
        if (weather.temp < 10 || weather.temp > 35) {
          score -= 25;
          risks.push('Temperature outside ideal range');
          recommendations.push('Ideal painting temp is 15-25°C');
        }
        if (weather.windSpeed > 15) {
          score -= 15;
          risks.push('Wind can blow debris onto wet paint');
          recommendations.push('Use drop sheets and shields');
        }
        break;

      case 'concrete':
        if (weather.precipitation > 20) {
          score -= 45;
          risks.push('Rain damages fresh concrete');
          recommendations.push('Cover with plastic sheeting or delay pour');
        }
        if (weather.temp > 32) {
          score -= 30;
          risks.push('Heat causes rapid drying and cracking');
          recommendations.push('Pour early morning, use retarders, keep moist');
        }
        if (weather.temp < 5) {
          score -= 35;
          risks.push('Cold slows curing, risk of freezing');
          recommendations.push('Use blankets and heated enclosures');
        }
        if (weather.windSpeed > 25) {
          score -= 20;
          risks.push('Wind accelerates surface drying');
          recommendations.push('Use windbreaks and spray mist');
        }
        break;

      case 'landscaping':
        if (weather.precipitation > 40) {
          score -= 30;
          risks.push('Heavy rain makes ground too muddy');
          recommendations.push('Wait 24-48 hours after rain');
        }
        if (weather.temp > 28) {
          score -= 20;
          risks.push('Heat stress for workers and plants');
          recommendations.push('Work morning/evening, hydrate frequently');
        }
        if (weather.windSpeed > 30) {
          score -= 15;
          risks.push('Strong winds difficult for planting');
          recommendations.push('Stake new plants immediately');
        }
        break;

      case 'electrical':
        if (weather.precipitation > 15) {
          score -= 40;
          risks.push('Water and electricity - extreme danger');
          recommendations.push('Only work on covered/dry areas');
        }
        if (weather.condition.includes('Thunder') || weather.condition.includes('Storm')) {
          score -= 60;
          risks.push('Lightning risk - life threatening');
          recommendations.push('Stop all outdoor electrical work immediately');
        }
        if (weather.humidity > 80) {
          score -= 20;
          risks.push('High humidity affects connections');
          recommendations.push('Use moisture-resistant materials');
        }
        break;

      case 'scaffolding':
        if (weather.windSpeed > 18) {
          score -= 45;
          risks.push('High winds dangerous on scaffolding');
          recommendations.push('Do not work above ground in strong winds');
        }
        if (weather.precipitation > 20) {
          score -= 35;
          risks.push('Slippery surfaces increase fall risk');
          recommendations.push('Wait for surfaces to dry completely');
        }
        if (weather.visibility < 10) {
          score -= 25;
          risks.push('Poor visibility hazardous at height');
          recommendations.push('Ensure proper lighting and clear conditions');
        }
        break;

      default:
        if (weather.precipitation > 30) score -= 25;
        if (weather.windSpeed > 25) score -= 20;
    }

    score = Math.max(0, Math.min(100, score));

    let label: string;
    let color: string;
    if (score >= 80) {
      label = 'Excellent';
      color = '#10B981';
    } else if (score >= 60) {
      label = 'Good';
      color = '#14B8A6';
    } else if (score >= 40) {
      label = 'Fair';
      color = '#F59E0B';
    } else if (score >= 20) {
      label = 'Poor';
      color = '#EF4444';
    } else {
      label = 'Dangerous';
      color = '#DC2626';
    }

    if (risks.length === 0) {
      recommendations.push('Conditions are favorable for work');
    }

    return { score, label, color, risks, recommendations };
  };

  const getWeatherIcon = (condition: string, size: number = 32) => {
    const lower = condition.toLowerCase();
    if (lower.includes('sun') || lower.includes('clear')) {
      return <Sun color="#F59E0B" size={size} />;
    } else if (lower.includes('rain') || lower.includes('shower')) {
      return <CloudRain color="#3B82F6" size={size} />;
    } else if (lower.includes('snow')) {
      return <CloudSnow color="#60A5FA" size={size} />;
    } else if (lower.includes('cloud')) {
      return <Cloud color="#94A3B8" size={size} />;
    } else if (lower.includes('storm') || lower.includes('thunder')) {
      return <Zap color="#EF4444" size={size} />;
    }
    return <Cloud color="#94A3B8" size={size} />;
  };

  const getWorkHoursForecast = () => {
    const startHour = parseInt(workStartTime.split(':')[0]);
    const endHour = parseInt(workEndTime.split(':')[0]);

    return forecast.filter(f => {
      const hour = parseInt(f.time.split(':')[0]);
      return hour >= startHour && hour <= endHour;
    });
  };

  const workHoursForecast = getWorkHoursForecast();
  const avgImpact = workHoursForecast.length > 0
    ? workHoursForecast.reduce((sum, f) => sum + calculateTradeImpact(f).score, 0) / workHoursForecast.length
    : 0;

  return (
    <View style={styles.container}>
      <GlassCard variant="cyan" style={styles.mainCard}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AlertTriangle color="#06B6D4" size={24} />
            <Text style={styles.title}>Weather Impact</Text>
          </View>
          <Pressable onPress={() => setShowSettings(true)} style={styles.settingsButton}>
            <Settings color="#94A3B8" size={20} />
          </Pressable>
        </View>

        <Text style={styles.subtitle}>{location}</Text>

        <View style={styles.tradeSelector}>
          <Text style={styles.sectionLabel}>SELECT YOUR TRADE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tradeList}>
            {TRADE_TYPES.map((trade) => (
              <Pressable
                key={trade.id}
                style={[styles.tradeChip, selectedTrade === trade.id && styles.tradeChipActive]}
                onPress={() => setSelectedTrade(trade.id)}
              >
                <Text style={styles.tradeEmoji}>{trade.icon}</Text>
                <Text style={[styles.tradeLabel, selectedTrade === trade.id && styles.tradeLabelActive]}>
                  {trade.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06B6D4" />
            <Text style={styles.loadingText}>Loading forecast...</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Today's Work Conditions</Text>
                <Text style={styles.workHours}>
                  <Clock color="#64748B" size={14} /> {workStartTime} - {workEndTime}
                </Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreValue, { color: avgImpact >= 60 ? '#10B981' : avgImpact >= 40 ? '#F59E0B' : '#EF4444' }]}>
                  {avgImpact.toFixed(0)}
                </Text>
                <Text style={styles.scoreLabel}>Work Safety Score</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>HOURLY FORECAST</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
              {forecast.map((weather, index) => {
                const impact = calculateTradeImpact(weather);
                const isWorkHour = workHoursForecast.includes(weather);

                return (
                  <View key={index} style={[styles.forecastCard, isWorkHour && styles.forecastCardWorkHour]}>
                    <Text style={styles.forecastTime}>{weather.time}</Text>
                    {getWeatherIcon(weather.condition, 28)}
                    <Text style={styles.forecastTemp}>{weather.temp}°C</Text>

                    <View style={styles.forecastDetails}>
                      <View style={styles.forecastDetailRow}>
                        <Wind color="#64748B" size={12} />
                        <Text style={styles.forecastDetailText}>{weather.windSpeed}</Text>
                      </View>
                      <View style={styles.forecastDetailRow}>
                        <Droplets color="#64748B" size={12} />
                        <Text style={styles.forecastDetailText}>{weather.precipitation}%</Text>
                      </View>
                    </View>

                    <View style={[styles.impactBadge, { backgroundColor: impact.color + '20', borderColor: impact.color }]}>
                      <Text style={[styles.impactScore, { color: impact.color }]}>
                        {impact.score}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {workHoursForecast.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>RISKS & RECOMMENDATIONS</Text>
                <View style={styles.impactDetails}>
                  {workHoursForecast.map((weather, index) => {
                    const impact = calculateTradeImpact(weather);

                    if (impact.risks.length === 0 && impact.recommendations.length === 0) {
                      return null;
                    }

                    return (
                      <View key={index} style={styles.riskCard}>
                        <View style={styles.riskHeader}>
                          <Text style={styles.riskTime}>{weather.time}</Text>
                          <View style={[styles.riskBadge, { backgroundColor: impact.color + '20' }]}>
                            <Text style={[styles.riskBadgeText, { color: impact.color }]}>
                              {impact.label}
                            </Text>
                          </View>
                        </View>

                        {impact.risks.length > 0 && (
                          <View style={styles.riskSection}>
                            {impact.risks.map((risk, riskIndex) => (
                              <View key={riskIndex} style={styles.riskItem}>
                                <XCircle color="#EF4444" size={16} />
                                <Text style={styles.riskText}>{risk}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {impact.recommendations.length > 0 && (
                          <View style={styles.recommendationSection}>
                            {impact.recommendations.map((rec, recIndex) => (
                              <View key={recIndex} style={styles.recommendationItem}>
                                <CheckCircle color="#14B8A6" size={16} />
                                <Text style={styles.recommendationText}>{rec}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </>
        )}
      </GlassCard>

      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Weather Settings</Text>
              <Pressable onPress={() => setShowSettings(false)}>
                <Text style={styles.closeButton}>Done</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Location</Text>
                <TextInput
                  style={styles.settingInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter location"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Work Start Time</Text>
                <TextInput
                  style={styles.settingInput}
                  value={workStartTime}
                  onChangeText={setWorkStartTime}
                  placeholder="07:00"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Work End Time</Text>
                <TextInput
                  style={styles.settingInput}
                  value={workEndTime}
                  onChangeText={setWorkEndTime}
                  placeholder="17:00"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Outdoor Work Percentage</Text>
                <TextInput
                  style={styles.settingInput}
                  value={outdoorPercentage.toString()}
                  onChangeText={(text) => setOutdoorPercentage(parseInt(text) || 0)}
                  placeholder="80"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                />
                <Text style={styles.settingHint}>How much of your work is done outdoors?</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 20,
  },
  tradeSelector: {
    marginTop: 8,
  },
  tradeList: {
    flexDirection: 'row',
  },
  tradeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginRight: 8,
  },
  tradeChipActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06B6D4',
  },
  tradeEmoji: {
    fontSize: 18,
  },
  tradeLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  tradeLabelActive: {
    color: '#06B6D4',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  workHours: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
  },
  scoreLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginTop: 4,
  },
  forecastScroll: {
    marginBottom: 8,
  },
  forecastCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  forecastCardWorkHour: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  forecastTime: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  forecastTemp: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 8,
  },
  forecastDetails: {
    gap: 6,
    marginTop: 10,
    width: '100%',
  },
  forecastDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  forecastDetailText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  impactBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  impactScore: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  impactDetails: {
    gap: 12,
  },
  riskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTime: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#E2E8F0',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  riskSection: {
    gap: 10,
    marginBottom: 12,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  riskText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#F87171',
    lineHeight: 18,
  },
  recommendationSection: {
    gap: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#5EEAD4',
    lineHeight: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1b3a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
  },
  modalBody: {
    gap: 20,
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  settingInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
  },
  settingHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 6,
  },
});
