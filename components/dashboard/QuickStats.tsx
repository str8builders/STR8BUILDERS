import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, Clock, Users, TrendingUp } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { useAppData } from '@/hooks/useAppData';

export const QuickStats: React.FC = () => {
  const { clients, timesheets, invoices } = useAppData();

  const totalUnbilledAmount = timesheets
    .filter(entry => !entry.invoiced)
    .reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);

  const totalUnbilledHours = timesheets
    .filter(entry => !entry.invoiced)
    .reduce((sum, entry) => sum + entry.hours, 0);

  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const activeClients = clients.filter(client => client.status === 'Active').length;

  const stats = [
    {
      icon: <DollarSign color="#10B981" size={24} />,
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      icon: <Clock color="#F59E0B" size={24} />,
      label: 'Unbilled',
      value: `$${totalUnbilledAmount.toFixed(0)}`,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: <Users color="#3B82F6" size={24} />,
      label: 'Clients',
      value: activeClients.toString(),
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      icon: <TrendingUp color="#06B6D4" size={24} />,
      label: 'Hours',
      value: totalUnbilledHours.toFixed(1),
      color: '#06B6D4',
      bgColor: 'rgba(6, 182, 212, 0.1)',
    },
  ];

  return (
    <GlassCard variant="electric" style={styles.container}>
      <Text style={styles.title}>Quick Stats</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
              {stat.icon}
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 0,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
});