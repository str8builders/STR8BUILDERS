import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, MapPin, Clock, User, TrendingUp, FolderOpen } from 'lucide-react-native';

export default function Projects() {
  const projects: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return '#3B82F6';
      case 'Nearly Complete':
        return '#10B981';
      case 'Completed':
        return '#6B7280';
      default:
        return '#F59E0B';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Projects</Text>
          <Pressable style={styles.addButton}>
            <Plus color="#FFF" size={20} />
          </Pressable>
        </View>
        
        {projects.length === 0 ? (
          <GlassCard variant="electric" style={styles.emptyState}>
            <FolderOpen color="#3B82F6" size={48} />
            <Text style={styles.emptyTitle}>No Projects Yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first project to start tracking progress and managing construction work.
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.projectsList}>
            {projects.map((project) => (
              <GlassCard key={project.id} variant="electric" style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <View style={styles.projectTitleContainer}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                      <Text style={styles.statusText}>{project.status}</Text>
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={[styles.progressText, { color: getProgressColor(project.progress) }]}>
                      {project.progress}%
                    </Text>
                  </View>
                </View>
                
                <View style={styles.projectDetails}>
                  <View style={styles.detailRow}>
                    <User color="#94A3B8" size={16} />
                    <Text style={styles.detailText}>{project.client}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MapPin color="#94A3B8" size={16} />
                    <Text style={styles.detailText}>{project.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Clock color="#94A3B8" size={16} />
                    <Text style={styles.detailText}>Due: {project.estimatedCompletion}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <TrendingUp color="#94A3B8" size={16} />
                    <Text style={styles.detailText}>${project.hourlyRate}/hr</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
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
                </View>
              </GlassCard>
            ))}
          </View>
        )}
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectsList: {
    gap: 16,
  },
  projectCard: {
    marginVertical: 0,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectTitleContainer: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  projectDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});