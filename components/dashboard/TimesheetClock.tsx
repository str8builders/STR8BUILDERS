import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Clock, Play, Pause, Square, X } from 'lucide-react-native';

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  notes?: string;
}

interface TimesheetClockProps {
  isEditMode?: boolean;
  onRemove?: () => void;
}

export function TimesheetClock({ isEditMode, onRemove }: TimesheetClockProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStartTime(new Date());
    setIsRunning(true);
    setCurrentTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (startTime) {
      const duration = currentTime;
      setTodayTotal(todayTotal + duration);
      setIsRunning(false);
      setCurrentTime(0);
      setStartTime(null);
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard variant="default" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Clock color="#3B82F6" size={20} />
            <Text style={styles.title}>Timesheet Clock</Text>
          </View>
          {isEditMode && onRemove && (
            <Pressable onPress={onRemove}>
              <X color="#EF4444" size={20} />
            </Pressable>
          )}
        </View>

        <View style={styles.clockDisplay}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.statusText}>
            {isRunning ? 'Clocked In' : 'Not Clocked In'}
          </Text>
        </View>

        <View style={styles.controls}>
          {!isRunning && currentTime === 0 && (
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Play color="#FFF" size={20} fill="#FFF" />
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          )}

          {isRunning && (
            <Pressable style={styles.pauseButton} onPress={handlePause}>
              <Pause color="#FFF" size={20} fill="#FFF" />
              <Text style={styles.buttonText}>Pause</Text>
            </Pressable>
          )}

          {(isRunning || currentTime > 0) && (
            <Pressable style={styles.stopButton} onPress={handleStop}>
              <Square color="#FFF" size={20} fill="#FFF" />
              <Text style={styles.buttonText}>Stop</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Today's Total</Text>
            <Text style={styles.summaryValue}>{formatTime(todayTotal)}</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  clockDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  timeText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    letterSpacing: 2,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
  },
  stopButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  summary: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
});
