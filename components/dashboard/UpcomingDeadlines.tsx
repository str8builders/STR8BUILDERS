import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { useAppData } from '@/hooks/useAppData';

interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'project' | 'invoice' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  daysUntil: number;
}

export const UpcomingDeadlines: React.FC = () => {
  const { projects, invoices } = useAppData();

  // Generate deadlines from projects and invoices
  const generateDeadlines = (): Deadline[] => {
    const deadlines: Deadline[] = [];
    const today = new Date();

    // Add project deadlines
    projects.forEach(project => {
      const deadline = new Date(project.deadline);
      const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil >= 0 && daysUntil <= 30) {
        deadlines.push({
          id: `project-${project.id}`,
          title: `${project.name} Completion`,
          date: project.deadline,
          type: 'project',
          priority: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low',
          daysUntil,
        });
      }
    });

    // Add invoice due dates
    invoices
      .filter(invoice => invoice.status === 'Sent')
      .forEach(invoice => {
        const dueDate = new Date(invoice.dueDate);
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil >= 0 && daysUntil <= 30) {
          deadlines.push({
            id: `invoice-${invoice.id}`,
            title: `Invoice ${invoice.invoiceNumber} Due`,
            date: invoice.dueDate,
            type: 'invoice',
            priority: daysUntil <= 3 ? 'high' : daysUntil <= 7 ? 'medium' : 'low',
            daysUntil,
          });
        }
      });

    // Add some sample meetings/appointments
    const sampleDeadlines: Deadline[] = [
      {
        id: 'meeting-1',
        title: 'Site Inspection - Bay Park',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'meeting',
        priority: 'medium',
        daysUntil: 2,
      },
      {
        id: 'meeting-2',
        title: 'Material Delivery - Omokoroa',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'meeting',
        priority: 'low',
        daysUntil: 5,
      },
    ];

    return [...deadlines, ...sampleDeadlines].sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const deadlines = generateDeadlines();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#94A3B8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Calendar color="#3B82F6" size={16} />;
      case 'invoice':
        return <Clock color="#06B6D4" size={16} />;
      case 'meeting':
        return <AlertTriangle color="#F59E0B" size={16} />;
      default:
        return <Calendar color="#94A3B8" size={16} />;
    }
  };

  const formatDaysUntil = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  return (
    <GlassCard variant="purple" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Deadlines</Text>
        <Calendar color="#8B5CF6" size={20} />
      </View>
      
      {deadlines.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No upcoming deadlines</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <ScrollView style={styles.deadlinesList} showsVerticalScrollIndicator={false}>
          {deadlines.slice(0, 5).map((deadline) => (
            <View key={deadline.id} style={styles.deadlineCard}>
              <View style={styles.deadlineHeader}>
                <View style={styles.deadlineInfo}>
                  {getTypeIcon(deadline.type)}
                  <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(deadline.priority) }]}>
                  <Text style={styles.priorityText}>
                    {deadline.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.deadlineFooter}>
                <Text style={styles.deadlineDate}>{deadline.date}</Text>
                <Text style={[
                  styles.daysUntil,
                  { color: deadline.daysUntil <= 3 ? '#EF4444' : '#94A3B8' }
                ]}>
                  {formatDaysUntil(deadline.daysUntil)}
                </Text>
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
    maxHeight: 350,
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
  deadlinesList: {
    flex: 1,
  },
  deadlineCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  deadlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  deadlineTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  deadlineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  daysUntil: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
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