import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, FileText, User, DollarSign, Play, Pause } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { useAppData } from '@/hooks/useAppData';

interface Activity {
  id: string;
  type: 'timesheet' | 'invoice' | 'client' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

export const RecentActivity: React.FC = () => {
  const { timesheets, invoices, clients } = useAppData();

  const generateRecentActivity = (): Activity[] => {
    const activities: Activity[] = [];

    // Add recent timesheet entries
    timesheets
      .slice(-5)
      .forEach(entry => {
        activities.push({
          id: `timesheet-${entry.id}`,
          type: 'timesheet',
          title: 'Time Entry Logged',
          description: `${entry.hours}h on ${entry.projectName}`,
          timestamp: entry.createdAt,
          amount: entry.hours * entry.rate,
        });
      });

    // Add recent invoices
    invoices
      .slice(-3)
      .forEach(invoice => {
        activities.push({
          id: `invoice-${invoice.id}`,
          type: 'invoice',
          title: 'Invoice Created',
          description: `${invoice.invoiceNumber} for ${invoice.clientName}`,
          timestamp: invoice.createdAt,
          amount: invoice.amount,
        });
      });

    // Add recent clients
    clients
      .slice(-2)
      .forEach(client => {
        activities.push({
          id: `client-${client.id}`,
          type: 'client',
          title: 'New Client Added',
          description: client.name,
          timestamp: client.createdAt,
        });
      });

    // Add some sample payment activities
    const samplePayments: Activity[] = [
      {
        id: 'payment-1',
        type: 'payment',
        title: 'Payment Received',
        description: 'Bay Park Renovation - Invoice #2025-0001',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        amount: 2850,
      },
      {
        id: 'payment-2',
        type: 'payment',
        title: 'Payment Received',
        description: 'Omokoroa Deck - Invoice #2025-0002',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        amount: 1200,
      },
    ];

    return [...activities, ...samplePayments]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 8);
  };

  const activities = generateRecentActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'timesheet':
        return <Clock color="#10B981" size={16} />;
      case 'invoice':
        return <FileText color="#3B82F6" size={16} />;
      case 'client':
        return <User color="#06B6D4" size={16} />;
      case 'payment':
        return <DollarSign color="#F59E0B" size={16} />;
      default:
        return <Clock color="#94A3B8" size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'timesheet':
        return '#10B981';
      case 'invoice':
        return '#3B82F6';
      case 'client':
        return '#06B6D4';
      case 'payment':
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <GlassCard variant="teal" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        <Play color="#14B8A6" size={20} />
      </View>
      
      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent activity</Text>
          <Text style={styles.emptySubtext}>Start working to see activity here</Text>
        </View>
      ) : (
        <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={[styles.activityIcon, { backgroundColor: `${getActivityColor(activity.type)}20` }]}>
                  {getActivityIcon(activity.type)}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <View style={styles.activityMeta}>
                  {activity.amount && (
                    <Text style={[styles.activityAmount, { color: getActivityColor(activity.type) }]}>
                      ${activity.amount.toFixed(0)}
                    </Text>
                  )}
                  <Text style={styles.activityTime}>
                    {formatTimestamp(activity.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    maxHeight: 400,
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
  activitiesList: {
    flex: 1,
  },
  activityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
  },
});