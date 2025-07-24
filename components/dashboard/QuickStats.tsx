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
      icon: <DollarSign color="#10B981" size={20} />,
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      color: '#10B981',
    },
    {
      icon: <Clock color="#F59E0B" size={20} />,
      label: 'Unbilled',
      value: `$${totalUnbilledAmount.toFixed(0)}`,
      color: '#F59E0B',
    },
    {
      icon: <Users color="#3B82F6" size={20} />,
      label: 'Clients',
      value: activeClients.toString(),
      color: '#3B82F6',
    },
    {
      icon: <TrendingUp color="#06B6D4" size={20} />,
      label: 'Hours',
      value: totalUnbilledHours.toFixed(1),
      color: '#06B6D4',
    },
  ];

  return (
    <GlassCard variant="electric" style={styles.container}>
      <Text style={styles.title}>Quick Stats</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statIcon}>
              {stat.icon}
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  title: {
    fontSize: 16,
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
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
});