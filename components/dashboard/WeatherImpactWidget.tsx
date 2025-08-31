import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';

export const WeatherImpactWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: '15',
    windSpeed: '10',
    humidity: '60',
    precipitation: '0',
    condition: 'sunny'
  });
  const [selectedTrades, setSelectedTrades] = useState<string[]>(['general']);

  const trades = [
    { id: 'general', name: 'General Construction', icon: '🔨' },
    { id: 'roofing', name: 'Roofing', icon: '🏠' },
    { id: 'painting', name: 'Painting (Exterior)', icon: '🎨' },
    { id: 'concrete', name: 'Concrete Work', icon: '🏗️' },
    { id: 'electrical', name: 'Electrical (Outdoor)', icon: '⚡' },
    { id: 'plumbing', name: 'Plumbing (Outdoor)', icon: '🔧' },
    { id: 'landscaping', name: 'Landscaping', icon: '🌱' },
    { id: 'demolition', name: 'Demolition', icon: '🔨' },
  ];

  const assessWeatherImpact = (tradeId: string) => {
    const temp = parseFloat(weatherData.temperature);
    const wind = parseFloat(weatherData.windSpeed);
    const humidity = parseFloat(weatherData.humidity);
    const rain = parseFloat(weatherData.precipitation);
    
    let score = 100;
    let issues: string[] = [];
    
    // Trade-specific assessments
    switch (tradeId) {
      case 'roofing':
        if (wind > 25) { score -= 40; issues.push('High wind risk'); }
        if (rain > 0.5) { score -= 50; issues.push('Wet surfaces dangerous'); }
        if (temp < 5) { score -= 30; issues.push('Cold affects materials'); }
        break;
        
      case 'painting':
        if (humidity > 80) { score -= 35; issues.push('High humidity affects drying'); }
        if (rain > 0) { score -= 60; issues.push('Rain will ruin paint job'); }
        if (temp < 10 || temp > 30) { score -= 25; issues.push('Temperature outside ideal range'); }
        if (wind > 20) { score -= 20; issues.push('Wind affects spray application'); }
        break;
        
      case 'concrete':
        if (temp < 5) { score -= 45; issues.push('Concrete may freeze'); }
        if (temp > 30) { score -= 30; issues.push('Too hot - rapid curing'); }
        if (rain > 2) { score -= 40; issues.push('Rain affects concrete finish'); }
        if (wind > 30) { score -= 20; issues.push('Wind causes rapid moisture loss'); }
        break;
        
      case 'electrical':
        if (rain > 0) { score -= 70; issues.push('Electrical safety risk'); }
        if (weatherData.condition === 'stormy') { score -= 80; issues.push('Lightning risk'); }
        if (humidity > 85) { score -= 25; issues.push('High humidity electrical risk'); }
        break;
        
      case 'general':
        if (rain > 5) { score -= 30; issues.push('Heavy rain limits work'); }
        if (wind > 35) { score -= 25; issues.push('Strong winds unsafe'); }
        if (temp < 0) { score -= 35; issues.push('Freezing conditions'); }
        break;
        
      case 'plumbing':
        if (temp < 0) { score -= 40; issues.push('Pipes may freeze'); }
        if (rain > 10) { score -= 20; issues.push('Heavy rain complicates outdoor work'); }
        break;
        
      case 'landscaping':
        if (rain > 1) { score -= 25; issues.push('Wet soil conditions'); }
        if (wind > 25) { score -= 20; issues.push('Wind affects planting'); }
        if (temp < 5) { score -= 30; issues.push('Plants vulnerable to cold'); }
        break;
        
      case 'demolition':
        if (wind > 30) { score -= 30; issues.push('Dust and debris spread'); }
        if (rain > 2) { score -= 15; issues.push('Slippery conditions'); }
        break;
    }
    
    // General weather impacts
    if (weatherData.condition === 'stormy') {
      score -= 60;
      issues.push('Storm conditions unsafe');
    }
    
    score = Math.max(0, Math.min(100, score));
    
    let suitability: string;
    if (score >= 80) suitability = 'Excellent';
    else if (score >= 60) suitability = 'Good';
    else if (score >= 40) suitability = 'Fair';
    else if (score >= 20) suitability = 'Poor';
    else suitability = 'Dangerous';
    
    return { score, suitability, issues };
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent': return '#10B981';
      case 'Good': return '#22C55E';
      case 'Fair': return '#F59E0B';
      case 'Poor': return '#EF4444';
      case 'Dangerous': return '#DC2626';
      default: return '#94A3B8';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun color="#F59E0B" size={16} />;
      case 'cloudy': return <Cloud color="#94A3B8" size={16} />;
      case 'rainy': return <CloudRain color="#3B82F6" size={16} />;
      default: return <Cloud color="#94A3B8" size={16} />;
    }
  };

  return (
    <GlassCard variant="purple" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather Impact</Text>
        <Eye color="#8B5CF6" size={20} />
      </View>
      
      {/* Quick Weather Input */}
      <View style={styles.quickWeatherInput}>
        <View style={styles.weatherInputRow}>
          <View style={styles.weatherInputItem}>
            <Thermometer color="#F59E0B" size={16} />
            <TextInput
              style={styles.weatherInput}
              value={weatherData.temperature}
              onChangeText={(text) => setWeatherData(prev => ({ ...prev, temperature: text }))}
              placeholder="15"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
            />
            <Text style={styles.weatherUnit}>°C</Text>
          </View>
          
          <View style={styles.weatherInputItem}>
            <Wind color="#06B6D4" size={16} />
            <TextInput
              style={styles.weatherInput}
              value={weatherData.windSpeed}
              onChangeText={(text) => setWeatherData(prev => ({ ...prev, windSpeed: text }))}
              placeholder="10"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
            />
            <Text style={styles.weatherUnit}>km/h</Text>
          </View>
          
          <View style={styles.weatherInputItem}>
            <Droplets color="#3B82F6" size={16} />
            <TextInput
              style={styles.weatherInput}
              value={weatherData.precipitation}
              onChangeText={(text) => setWeatherData(prev => ({ ...prev, precipitation: text }))}
              placeholder="0"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
            />
            <Text style={styles.weatherUnit}>mm</Text>
          </View>
        </View>
        
        {/* Weather Condition Selector */}
        <View style={styles.conditionSelector}>
          {['sunny', 'cloudy', 'rainy'].map((condition) => (
            <Pressable
              key={condition}
              style={[
                styles.conditionOption,
                weatherData.condition === condition && styles.selectedCondition
              ]}
              onPress={() => setWeatherData(prev => ({ ...prev, condition }))}
            >
              {getWeatherIcon(condition)}
              <Text style={[
                styles.conditionText,
                weatherData.condition === condition && styles.selectedConditionText
              ]}>
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      {/* Trade Selection */}
      <View style={styles.tradeSelection}>
        <Text style={styles.sectionTitle}>Select Trades:</Text>
        <View style={styles.tradesGrid}>
          {trades.slice(0, 4).map((trade) => (
            <Pressable
              key={trade.id}
              style={[
                styles.tradeOption,
                selectedTrades.includes(trade.id) && styles.selectedTrade
              ]}
              onPress={() => {
                if (selectedTrades.includes(trade.id)) {
                  setSelectedTrades(prev => prev.filter(id => id !== trade.id));
                } else {
                  setSelectedTrades(prev => [...prev, trade.id]);
                }
              }}
            >
              <Text style={styles.tradeIcon}>{trade.icon}</Text>
              <Text style={[
                styles.tradeName,
                selectedTrades.includes(trade.id) && styles.selectedTradeName
              ]}>
                {trade.name.split(' ')[0]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      {/* Assessment Results */}
      {selectedTrades.length > 0 && (
        <View style={styles.assessmentResults}>
          {selectedTrades.slice(0, 2).map((tradeId) => {
            const trade = trades.find(t => t.id === tradeId);
            const assessment = assessWeatherImpact(tradeId);
            
            return (
              <View key={tradeId} style={styles.assessmentItem}>
                <View style={styles.assessmentHeader}>
                  <Text style={styles.assessmentTrade}>{trade?.icon} {trade?.name.split(' ')[0]}</Text>
                  <Text style={[
                    styles.suitabilityText,
                    { color: getSuitabilityColor(assessment.suitability) }
                  ]}>
                    {assessment.suitability}
                  </Text>
                </View>
                
                {assessment.issues.length > 0 && (
                  <Text style={styles.issuesSummary}>
                    {assessment.issues.slice(0, 1).join(', ')}
                    {assessment.issues.length > 1 && '...'}
                  </Text>
                )}
              </View>
            );
          })}
          
          {selectedTrades.length > 2 && (
            <Text style={styles.moreResults}>
              +{selectedTrades.length - 2} more trades assessed
            </Text>
          )}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  quickWeatherInput: {
    marginBottom: 16,
  },
  weatherInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  weatherInputItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  weatherInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    textAlign: 'center',
  },
  weatherUnit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  conditionSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  conditionOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCondition: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  conditionText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedConditionText: {
    color: '#FFF',
  },
  tradeSelection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  tradesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tradeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: '22%',
  },
  selectedTrade: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tradeIcon: {
    fontSize: 14,
  },
  tradeName: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    flex: 1,
  },
  selectedTradeName: {
    color: '#FFF',
  },
  assessmentResults: {
    gap: 8,
  },
  assessmentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  assessmentTrade: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  suitabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  issuesSummary: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
  moreResults: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});