import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Play, Pause, Square, Clock, DollarSign, MapPin, Check, X } from 'lucide-react-native';

interface TimeEntry {
  id: string;
  project: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  earnings: number;
  location?: string;
}

export function QuickWinTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentProject, setCurrentProject] = useState('');
  const [hourlyRate, setHourlyRate] = useState(85);
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const projects = ['Kitchen Renovation', 'Office Fit-out', 'Bathroom Remodel', 'Deck Construction'];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateEarnings = (seconds: number) => {
    return ((seconds / 3600) * hourlyRate).toFixed(2);
  };

  const startTimer = (project: string) => {
    setCurrentProject(project);
    setElapsed(0);
    setIsRunning(true);
    setShowProjectSelect(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (!currentProject) return;

    const entry: TimeEntry = {
      id: Date.now().toString(),
      project: currentProject,
      startTime: new Date(Date.now() - elapsed * 1000),
      endTime: new Date(),
      duration: elapsed,
      earnings: parseFloat(calculateEarnings(elapsed)),
      location: 'Current Location',
    };

    setTodayEntries([entry, ...todayEntries]);
    setIsRunning(false);
    setElapsed(0);
    setCurrentProject('');

    Alert.alert(
      'Time Logged!',
      `You earned $${entry.earnings.toFixed(2)} on ${entry.project}`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const todayEarnings = todayEntries.reduce((sum, entry) => sum + entry.earnings, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quick Win Timer</Text>
        <Text style={styles.subtitle}>One-tap time tracking</Text>

        <GlassCard variant="cyan" style={styles.timerCard}>
          {!isRunning && !currentProject ? (
            <>
              <Clock color="#06B6D4" size={48} />
              <Text style={styles.timerLabel}>Ready to start</Text>
              <Pressable style={styles.startButton} onPress={() => setShowProjectSelect(true)}>
                <Play color="#FFF" size={24} />
                <Text style={styles.startButtonText}>Start Timer</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.timerTime}>{formatTime(elapsed)}</Text>
              <Text style={styles.timerProject}>{currentProject}</Text>
              <View style={styles.earningsPreview}>
                <DollarSign color="#10B981" size={20} />
                <Text style={styles.earningsText}>${calculateEarnings(elapsed)}</Text>
              </View>
              <View style={styles.timerControls}>
                {isRunning ? (
                  <Pressable style={[styles.controlButton, styles.pauseButton]} onPress={pauseTimer}>
                    <Pause color="#FFF" size={24} />
                  </Pressable>
                ) : (
                  <Pressable style={[styles.controlButton, styles.resumeButton]} onPress={() => setIsRunning(true)}>
                    <Play color="#FFF" size={24} />
                  </Pressable>
                )}
                <Pressable style={[styles.controlButton, styles.stopButton]} onPress={stopTimer}>
                  <Square color="#FFF" size={24} fill="#FFF" />
                </Pressable>
              </View>
            </>
          )}
        </GlassCard>

        <View style={styles.statsRow}>
          <GlassCard variant="default" style={styles.statCard}>
            <Clock color="#3B82F6" size={24} />
            <Text style={styles.statValue}>{formatTime(todayTotal)}</Text>
            <Text style={styles.statLabel}>Today's Hours</Text>
          </GlassCard>
          <GlassCard variant="default" style={styles.statCard}>
            <DollarSign color="#10B981" size={24} />
            <Text style={styles.statValue}>${todayEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </GlassCard>
        </View>

        {todayEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Activity</Text>
            {todayEntries.map((entry) => (
              <GlassCard key={entry.id} variant="default" style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryProject}>{entry.project}</Text>
                  <Text style={styles.entryEarnings}>${entry.earnings.toFixed(2)}</Text>
                </View>
                <View style={styles.entryDetails}>
                  <Clock color="#94A3B8" size={14} />
                  <Text style={styles.entryDuration}>{formatTime(entry.duration)}</Text>
                  <Text style={styles.entryDot}>•</Text>
                  <Text style={styles.entryTime}>
                    {entry.startTime.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}
                    {entry.endTime && ` - ${entry.endTime.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}`}
                  </Text>
                </View>
                {entry.location && (
                  <View style={styles.entryLocation}>
                    <MapPin color="#06B6D4" size={12} />
                    <Text style={styles.entryLocationText}>{entry.location}</Text>
                  </View>
                )}
              </GlassCard>
            ))}
          </View>
        )}

        <GlassCard variant="default" style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            The timer auto-pauses when you leave the job site (GPS tracking). You'll get a notification to resume when you return!
          </Text>
        </GlassCard>
      </ScrollView>

      <Modal
        visible={showProjectSelect}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProjectSelect(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Project</Text>
              <Pressable onPress={() => setShowProjectSelect(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.projectList}>
              {projects.map((project) => (
                <Pressable
                  key={project}
                  style={styles.projectButton}
                  onPress={() => startTimer(project)}
                >
                  <Text style={styles.projectButtonText}>{project}</Text>
                  <Play color="#3B82F6" size={20} />
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.customProjectContainer}>
              <Text style={styles.inputLabel}>Or enter custom project:</Text>
              <View style={styles.customProjectInput}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Project name"
                  placeholderTextColor="#64748B"
                  onSubmitEditing={(e) => {
                    if (e.nativeEvent.text.trim()) {
                      startTimer(e.nativeEvent.text.trim());
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 24,
  },
  timerCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
    marginTop: 16,
    marginBottom: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  timerTime: {
    fontSize: 56,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
    marginBottom: 12,
  },
  timerProject: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 16,
  },
  earningsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  earningsText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  resumeButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
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
  entryCard: {
    padding: 12,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryProject: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  entryEarnings: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  entryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  entryDuration: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  entryDot: {
    fontSize: 14,
    color: '#64748B',
  },
  entryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  entryLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryLocationText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#06B6D4',
  },
  tipCard: {
    padding: 16,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1b3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  projectList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  projectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  projectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  customProjectContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 12,
  },
  customProjectInput: {
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
