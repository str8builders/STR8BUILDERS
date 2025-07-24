import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus, FileText, Clock, Calculator, Users, Wrench } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { router } from 'expo-router';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: <Plus color="#10B981" size={20} />,
      label: 'New Client',
      color: '#10B981',
      onPress: () => router.push('/clients'),
    },
    {
      icon: <FileText color="#3B82F6" size={20} />,
      label: 'Create Invoice',
      color: '#3B82F6',
      onPress: () => router.push('/clients'),
    },
    {
      icon: <Clock color="#F59E0B" size={20} />,
      label: 'Time Entry',
      color: '#F59E0B',
      onPress: () => {}, // Timer is on dashboard
    },
    {
      icon: <Calculator color="#06B6D4" size={20} />,
      label: 'Calculator',
      color: '#06B6D4',
      onPress: () => router.push('/tools'),
    },
    {
      icon: <Users color="#8B5CF6" size={20} />,
      label: 'View Clients',
      color: '#8B5CF6',
      onPress: () => router.push('/clients'),
    },
    {
      icon: <Wrench color="#EF4444" size={20} />,
      label: 'Tools',
      color: '#EF4444',
      onPress: () => router.push('/tools'),
    },
  ];

  return (
    <GlassCard variant="default" style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <Pressable
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
              {action.icon}
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    textAlign: 'center',
  },
});