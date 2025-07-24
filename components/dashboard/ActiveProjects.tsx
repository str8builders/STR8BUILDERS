import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Calendar, TrendingUp } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';

interface Project {
  id: string;
  name: string;
  location: string;
  progress: number;
  deadline: string;
  client: string;
}

export const ActiveProjects: React.FC = () => {
  const projects: Project[] = [];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <GlassCard variant="teal" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Projects</Text>
        <TrendingUp color="#14B8A6" size={20} />
      </View>
      
      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active projects</Text>
          <Text style={styles.emptySubtext}>Start a new project to see it here</Text>
        </View>
      ) : (
        <ScrollView style={styles.projectsList} showsVerticalScrollIndicator={false}>
          {projects.map((project) => (
            <View key={project.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={styles.progressContainer}>
                  <Text style={[styles.progressText, { color: getProgressColor(project.progress) }]}>
                    {project.progress}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.projectDetails}>
                <View style={styles.detailRow}>
                  <MapPin color="#94A3B8" size={14} />
                  <Text style={styles.detailText}>{project.location}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Calendar color="#94A3B8" size={14} />
                  <Text style={styles.detailText}>{project.deadline}</Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${project.progress}%`,
                      backgroundColor: getProgressColor(project.progress)
                    }
                  ]} 
                />
              </View>
              
              <Text style={styles.clientName}>{project.client}</Text>
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
  projectsList: {
    flex: 1,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    flex: 1,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  projectDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
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