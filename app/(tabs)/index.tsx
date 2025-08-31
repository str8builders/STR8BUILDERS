import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { JobTimer } from '@/components/dashboard/JobTimer';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { WeatherImpactWidget } from '@/components/dashboard/WeatherImpactWidget';
import { User } from 'lucide-react-native';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <User color="#3B82F6" size={24} />
            </View>
            <View>
              <Text style={styles.title}>STR8 BUILD</Text>
              <Text style={styles.subtitle}>Welcome back, C.SAMU</Text>
            </View>
          </View>
        </View>
        
        <JobTimer />
        
        <QuickStats />
        
        <WeatherImpactWidget />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
});