import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { JobTimer } from '@/components/dashboard/JobTimer';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>STR8 BUILD</Text>
          <Text style={styles.subtitle}>Construction Dashboard</Text>
        </View>
        
        <JobTimer />
        
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <WeatherWidget />
          </View>
          <View style={styles.halfWidth}>
            <QuickStats />
          </View>
        </View>
        
        <QuickActions />
        <ActiveProjects />
        <UpcomingDeadlines />
        <RecentActivity />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  halfWidth: {
    flex: 1,
  },
});