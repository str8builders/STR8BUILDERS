import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sun, Cloud, CloudRain, AlertTriangle, MapPin, Clock, DollarSign, CheckCircle, TrendingUp } from 'lucide-react-native';

interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  suitable: boolean;
}

interface TodayTask {
  id: string;
  title: string;
  project: string;
  time?: string;
  urgent: boolean;
}

export function MorningBriefing() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const weather: WeatherData[] = [
    {
      location: 'Tauranga Central',
      temp: 18,
      condition: 'sunny',
      suitable: true,
    },
    {
      location: 'Mount Maunganui',
      temp: 16,
      condition: 'cloudy',
      suitable: true,
    },
    {
      location: 'Papamoa',
      temp: 19,
      condition: 'rainy',
      suitable: false,
    },
  ];

  const todaysTasks: TodayTask[] = [
    {
      id: '1',
      title: 'Complete framing inspection',
      project: 'Kitchen Renovation',
      time: '9:00 AM',
      urgent: true,
    },
    {
      id: '2',
      title: 'Material delivery - sign off',
      project: 'Office Fit-out',
      time: '11:30 AM',
      urgent: false,
    },
    {
      id: '3',
      title: 'Client meeting - final walkthrough',
      project: 'Bathroom Remodel',
      time: '2:00 PM',
      urgent: false,
    },
    {
      id: '4',
      title: 'Update project photos',
      project: 'Deck Construction',
      urgent: false,
    },
  ];

  const outstandingFromYesterday = [
    { id: '1', task: 'Send invoice to Bay Commercial', amount: 28750 },
    { id: '2', task: 'Order bathroom fixtures', amount: 0 },
    { id: '3', task: 'Log hours for kitchen project', amount: 0 },
  ];

  const cashFlowToday = {
    incoming: 12500,
    outgoing: 3200,
    net: 9300,
  };

  const safetyReminder = {
    title: 'Roof Work Safety',
    message: 'Today involves elevated work. Ensure harnesses and guardrails are in place.',
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun color="#F59E0B" size={24} />;
      case 'cloudy':
        return <Cloud color="#94A3B8" size={24} />;
      case 'rainy':
        return <CloudRain color="#3B82F6" size={24} />;
      default:
        return <Sun color="#F59E0B" size={24} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, C.SAMU</Text>
        <Text style={styles.date}>
          {currentTime.toLocaleDateString('en-NZ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      <GlassCard variant="cyan" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{todaysTasks.length}</Text>
            <Text style={styles.summaryLabel}>Tasks Today</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{outstandingFromYesterday.length}</Text>
            <Text style={styles.summaryLabel}>Outstanding</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${cashFlowToday.net.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Net Today</Text>
          </View>
        </View>
      </GlassCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather at Job Sites</Text>
        <View style={styles.weatherGrid}>
          {weather.map((site, index) => (
            <GlassCard key={index} variant="default" style={styles.weatherCard}>
              <View style={styles.weatherHeader}>
                <MapPin color="#06B6D4" size={16} />
                <Text style={styles.weatherLocation}>{site.location}</Text>
              </View>
              <View style={styles.weatherBody}>
                {getWeatherIcon(site.condition)}
                <Text style={styles.weatherTemp}>{site.temp}°C</Text>
              </View>
              <View style={[styles.suitabilityBadge, site.suitable ? styles.suitableYes : styles.suitableNo]}>
                <Text style={[styles.suitabilityText, site.suitable ? styles.suitableYesText : styles.suitableNoText]}>
                  {site.suitable ? 'Good for work' : 'Weather warning'}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>
      </View>

      {safetyReminder && (
        <GlassCard variant="default" style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <AlertTriangle color="#EF4444" size={24} />
            <Text style={styles.safetyTitle}>Safety Reminder</Text>
          </View>
          <Text style={styles.safetyMessage}>{safetyReminder.message}</Text>
        </GlassCard>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todaysTasks.map((task) => (
          <Pressable key={task.id} style={styles.taskCard}>
            <GlassCard variant="default" style={styles.taskCardInner}>
              <View style={styles.taskLeft}>
                {task.urgent && (
                  <View style={styles.urgentBadge}>
                    <AlertTriangle color="#EF4444" size={14} />
                  </View>
                )}
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskProject}>{task.project}</Text>
                </View>
              </View>
              {task.time && (
                <View style={styles.taskTime}>
                  <Clock color="#3B82F6" size={16} />
                  <Text style={styles.taskTimeText}>{task.time}</Text>
                </View>
              )}
            </GlassCard>
          </Pressable>
        ))}
      </View>

      {outstandingFromYesterday.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outstanding from Yesterday</Text>
          {outstandingFromYesterday.map((item) => (
            <Pressable
              key={item.id}
              style={styles.outstandingCard}
              onPress={() => Alert.alert('Complete Task', item.task)}
            >
              <GlassCard variant="default" style={styles.outstandingCardInner}>
                <Text style={styles.outstandingTask}>{item.task}</Text>
                {item.amount > 0 && (
                  <View style={styles.amountBadge}>
                    <DollarSign color="#10B981" size={14} />
                    <Text style={styles.amountText}>{item.amount.toLocaleString()}</Text>
                  </View>
                )}
              </GlassCard>
            </Pressable>
          ))}
        </View>
      )}

      <GlassCard variant="default" style={styles.cashFlowCard}>
        <Text style={styles.cashFlowTitle}>Cash Flow Today</Text>
        <View style={styles.cashFlowRow}>
          <View style={styles.cashFlowItem}>
            <TrendingUp color="#10B981" size={20} />
            <Text style={styles.cashFlowLabel}>Incoming</Text>
            <Text style={[styles.cashFlowValue, { color: '#10B981' }]}>
              ${cashFlowToday.incoming.toLocaleString()}
            </Text>
          </View>
          <View style={styles.cashFlowItem}>
            <TrendingUp color="#EF4444" size={20} style={{ transform: [{ rotate: '180deg' }] }} />
            <Text style={styles.cashFlowLabel}>Outgoing</Text>
            <Text style={[styles.cashFlowValue, { color: '#EF4444' }]}>
              ${cashFlowToday.outgoing.toLocaleString()}
            </Text>
          </View>
          <View style={styles.cashFlowItem}>
            <DollarSign color="#06B6D4" size={20} />
            <Text style={styles.cashFlowLabel}>Net</Text>
            <Text style={[styles.cashFlowValue, { color: '#06B6D4' }]}>
              ${cashFlowToday.net.toLocaleString()}
            </Text>
          </View>
        </View>
      </GlassCard>

      <Pressable style={styles.dismissButton}>
        <Text style={styles.dismissButtonText}>Start Your Day</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  summaryCard: {
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  weatherGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  weatherCard: {
    flex: 1,
    minWidth: 100,
    padding: 12,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  weatherLocation: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    flex: 1,
  },
  weatherBody: {
    alignItems: 'center',
    marginVertical: 12,
  },
  weatherTemp: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 8,
  },
  suitabilityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  suitableYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  suitableNo: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  suitabilityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  suitableYesText: {
    color: '#10B981',
  },
  suitableNoText: {
    color: '#EF4444',
  },
  safetyCard: {
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  safetyMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 20,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskCardInner: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  urgentBadge: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 4,
  },
  taskProject: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  taskTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  outstandingCard: {
    marginBottom: 12,
  },
  outstandingCardInner: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outstandingTask: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    flex: 1,
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  amountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  cashFlowCard: {
    padding: 20,
    marginBottom: 24,
  },
  cashFlowTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  cashFlowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cashFlowItem: {
    alignItems: 'center',
    gap: 8,
  },
  cashFlowLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  cashFlowValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  dismissButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  dismissButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
});
