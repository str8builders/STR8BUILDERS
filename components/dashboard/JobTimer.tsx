import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import { Play, Pause, Square, Settings, DollarSign, Clock, User, CreditCard as Edit3, Check, X } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { useAppData } from '@/hooks/useAppData';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const JobTimer: React.FC = () => {
  const { clients, projects, addTimesheetEntry } = useAppData();
  
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [editingRate, setEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState('85');
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(85);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  
  const scale = useSharedValue(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentEarnings = () => {
    if (!currentProject) return 0;
    const hours = seconds / 3600;
    return hours * currentProject.hourlyRate;
  };

  const toggleTimer = () => {
    if (!currentProject) {
      setShowProjectSelector(true);
      return;
    }

    if (!isRunning) {
      setStartTime(new Date());
    } else {
      // Calculate earnings for this session
      const sessionEarnings = getCurrentEarnings();
      
      // Save timesheet entry
      if (currentProject && startTime) {
        const endTime = new Date();
        const hours = seconds / 3600;
        
        addTimesheetEntry({
          clientId: currentProject.clientId,
          projectId: currentProject.id,
          projectName: currentProject.name,
          clientName: currentProject.client,
          date: startTime.toISOString().split('T')[0],
          startTime: startTime.toLocaleTimeString(),
          endTime: endTime.toLocaleTimeString(),
          hours: parseFloat(hours.toFixed(2)),
          rate: currentProject.hourlyRate,
          description: `Work on ${currentProject.name}`,
          invoiced: false,
        });
      }
      
      setTodayEarnings(prev => prev + sessionEarnings);
      setWeekEarnings(prev => prev + sessionEarnings);
    }

    setIsRunning(!isRunning);
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const stopTimer = () => {
    if (isRunning) {
      const sessionEarnings = getCurrentEarnings();
      
      // Save timesheet entry
      if (currentProject && startTime) {
        const endTime = new Date();
        const hours = seconds / 3600;
        
        addTimesheetEntry({
          clientId: currentProject.clientId,
          projectId: currentProject.id,
          projectName: currentProject.name,
          clientName: currentProject.client,
          date: startTime.toISOString().split('T')[0],
          startTime: startTime.toLocaleTimeString(),
          endTime: endTime.toLocaleTimeString(),
          hours: parseFloat(hours.toFixed(2)),
          rate: currentProject.hourlyRate,
          description: `Work on ${currentProject.name}`,
          invoiced: false,
        });
      }
      
      setTodayEarnings(prev => prev + sessionEarnings);
      setWeekEarnings(prev => prev + sessionEarnings);
    }
    
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
  };

  const selectProject = (project: any) => {
    setCurrentProject(project);
    setShowProjectSelector(false);
  };

  const saveHourlyRate = () => {
    const newRate = parseFloat(tempRate);
    if (newRate > 0) {
      setDefaultHourlyRate(newRate);
      if (currentProject) {
        setCurrentProject({ ...currentProject, hourlyRate: newRate });
      }
    }
    setEditingRate(false);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <>
      <GlassCard variant="electric" style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Job Timer</Text>
          <View style={styles.headerRight}>
            <View style={[styles.indicator, { backgroundColor: isRunning ? '#10B981' : '#EF4444' }]} />
            <Pressable style={styles.settingsButton} onPress={() => setShowSettings(true)}>
              <Settings color="#94A3B8" size={16} />
            </Pressable>
          </View>
        </View>
        
        <Pressable 
          style={styles.projectSelector}
          onPress={() => setShowProjectSelector(true)}
        >
          <View style={styles.projectInfo}>
            <User color="#94A3B8" size={16} />
            <View style={styles.projectDetails}>
              <Text style={styles.projectName}>
                {currentProject ? currentProject.name : 'Select Project'}
              </Text>
              {currentProject && (
                <Text style={styles.clientName}>{currentProject.client}</Text>
              )}
            </View>
          </View>
          <View style={styles.rateInfo}>
            <DollarSign color="#3B82F6" size={16} />
            <Text style={styles.rateText}>
              ${currentProject ? currentProject.hourlyRate : defaultHourlyRate}/hr
            </Text>
          </View>
        </Pressable>
        
        <View style={styles.timerContainer}>
          <Text style={styles.time}>{formatTime(seconds)}</Text>
          {startTime && (
            <Text style={styles.startTime}>
              Started: {startTime.toLocaleTimeString()}
            </Text>
          )}
        </View>

        <View style={styles.earningsContainer}>
          <Text style={styles.currentEarnings}>
            Current Session: ${getCurrentEarnings().toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.controls}>
          <Animated.View style={animatedStyle}>
            <Pressable 
              style={[styles.button, styles.playButton]} 
              onPress={toggleTimer}
            >
              {isRunning ? (
                <Pause color="#FFF" size={24} />
              ) : (
                <Play color="#FFF" size={24} />
              )}
            </Pressable>
          </Animated.View>
          
          <Pressable 
            style={[styles.button, styles.stopButton]} 
            onPress={stopTimer}
          >
            <Square color="#FFF" size={20} />
          </Pressable>
        </View>

        <View style={styles.dailyStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>${todayEarnings.toFixed(2)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>${weekEarnings.toFixed(2)}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Project Selector Modal */}
      <Modal
        visible={showProjectSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProjectSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Project</Text>
              <Pressable onPress={() => setShowProjectSelector(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.projectList}>
              {projects.length === 0 ? (
                <View style={styles.emptyProjectState}>
                  <Text style={styles.emptyProjectTitle}>No Projects Yet</Text>
                  <Text style={styles.emptyProjectDescription}>
                    You need to add a client and create a project first.
                  </Text>
                  <Text style={styles.emptyProjectHint}>
                    Go to the Clients tab to get started.
                  </Text>
                </View>
              ) : (
                projects.map((project) => (
                  <Pressable
                    key={project.id}
                    style={[
                      styles.projectItem,
                      currentProject?.id === project.id && styles.selectedProject
                    ]}
                    onPress={() => selectProject(project)}
                  >
                    <View style={styles.projectItemInfo}>
                      <Text style={styles.projectItemName}>{project.name}</Text>
                      <Text style={styles.projectItemClient}>{project.client}</Text>
                    </View>
                    <Text style={styles.projectItemRate}>${project.hourlyRate}/hr</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Timer Settings</Text>
              <Pressable onPress={() => setShowSettings(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Default Hourly Rate</Text>
              <View style={styles.rateEditor}>
                {editingRate ? (
                  <View style={styles.rateEditContainer}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.rateInput}
                      value={tempRate}
                      onChangeText={setTempRate}
                      keyboardType="numeric"
                      autoFocus
                    />
                    <Pressable style={styles.saveButton} onPress={saveHourlyRate}>
                      <Check color="#10B981" size={16} />
                    </Pressable>
                    <Pressable style={styles.cancelButton} onPress={() => setEditingRate(false)}>
                      <X color="#EF4444" size={16} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable 
                    style={styles.rateDisplay}
                    onPress={() => {
                      setTempRate(defaultHourlyRate.toString());
                      setEditingRate(true);
                    }}
                  >
                    <Text style={styles.rateDisplayText}>${defaultHourlyRate}/hr</Text>
                    <Edit3 color="#94A3B8" size={16} />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Session Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>Today's Earnings</Text>
                  <Text style={styles.statCardValue}>${todayEarnings.toFixed(2)}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>Week's Earnings</Text>
                  <Text style={styles.statCardValue}>${weekEarnings.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  settingsButton: {
    padding: 4,
  },
  projectSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectDetails: {
    marginLeft: 12,
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  time: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  startTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  earningsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentEarnings: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#3B82F6',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  dailyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
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
    maxHeight: '80%',
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
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedProject: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  projectItemInfo: {
    flex: 1,
  },
  projectItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  projectItemClient: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  projectItemRate: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 12,
  },
  rateEditor: {
    marginBottom: 8,
  },
  rateEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dollarSign: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  rateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    flex: 1,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  saveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  rateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rateDisplayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statCardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  emptyProjectState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyProjectTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyProjectDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  emptyProjectHint: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    textAlign: 'center',
  },
});