import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Modal } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Mic, Square, Play, Pause, Trash2, Check, X } from 'lucide-react-native';

interface VoiceNote {
  id: string;
  duration: number;
  transcription: string;
  timestamp: Date;
  project?: string;
}

export function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([
    {
      id: '1',
      duration: 45,
      transcription: 'Completed framing on the north wall. Need to order additional studs for the south side. Client approved the beam placement.',
      timestamp: new Date(Date.now() - 3600000),
      project: 'Kitchen Renovation',
    },
    {
      id: '2',
      duration: 28,
      transcription: 'Subbie called in sick. Rescheduled electrical work to Thursday. Updated timeline with client.',
      timestamp: new Date(Date.now() - 7200000),
      project: 'Office Fit-out',
    },
  ]);
  const [showTranscription, setShowTranscription] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    Alert.alert('Recording Started', 'Tap the stop button when finished');
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const mockTranscription = 'This is a simulated transcription of your voice note. In production, this would use speech-to-text API.';

    const newNote: VoiceNote = {
      id: Date.now().toString(),
      duration: recordingTime,
      transcription: mockTranscription,
      timestamp: new Date(),
    };

    setVoiceNotes([newNote, ...voiceNotes]);
    setRecordingTime(0);
    Alert.alert('Recording Saved', 'Voice note saved and transcribed!');
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'Delete Voice Note',
      'Are you sure you want to delete this voice note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setVoiceNotes(voiceNotes.filter(note => note.id !== id)),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Notes</Text>
        <Text style={styles.subtitle}>Quick voice-to-text for updates</Text>
      </View>

      <GlassCard variant="default" style={styles.recorderCard}>
        <View style={styles.recorderContent}>
          {!isRecording ? (
            <>
              <Pressable style={styles.recordButton} onPress={startRecording}>
                <Mic color="#FFF" size={32} />
              </Pressable>
              <Text style={styles.recordLabel}>Tap to Record</Text>
              <Text style={styles.recordHint}>
                Say project updates, measurements, or reminders
              </Text>
            </>
          ) : (
            <>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingPulse} />
                <Mic color="#EF4444" size={32} />
              </View>
              <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              <Pressable style={styles.stopButton} onPress={stopRecording}>
                <Square color="#FFF" size={24} fill="#FFF" />
              </Pressable>
              <Text style={styles.stopLabel}>Tap to Stop</Text>
            </>
          )}
        </View>
      </GlassCard>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Commands</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.commandsScroll}>
          <Pressable style={styles.commandChip}>
            <Text style={styles.commandText}>Log hours</Text>
          </Pressable>
          <Pressable style={styles.commandChip}>
            <Text style={styles.commandText}>Add expense</Text>
          </Pressable>
          <Pressable style={styles.commandChip}>
            <Text style={styles.commandText}>Project update</Text>
          </Pressable>
          <Pressable style={styles.commandChip}>
            <Text style={styles.commandText}>Material order</Text>
          </Pressable>
        </ScrollView>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Recent Voice Notes</Text>
        <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
          {voiceNotes.map((note) => (
            <GlassCard key={note.id} variant="default" style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteDuration}>{formatTime(note.duration)}</Text>
                  <Text style={styles.noteTimestamp}>{formatTimestamp(note.timestamp)}</Text>
                </View>
                <View style={styles.noteActions}>
                  <Pressable
                    style={styles.noteAction}
                    onPress={() => setShowTranscription(note.id)}
                  >
                    <Play color="#3B82F6" size={16} />
                  </Pressable>
                  <Pressable
                    style={styles.noteAction}
                    onPress={() => deleteNote(note.id)}
                  >
                    <Trash2 color="#EF4444" size={16} />
                  </Pressable>
                </View>
              </View>
              {note.project && (
                <Text style={styles.noteProject}>{note.project}</Text>
              )}
              <Text style={styles.noteTranscription} numberOfLines={2}>
                {note.transcription}
              </Text>
              <Pressable onPress={() => setShowTranscription(note.id)}>
                <Text style={styles.readMore}>Read more</Text>
              </Pressable>
            </GlassCard>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={showTranscription !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTranscription(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voice Note Transcription</Text>
              <Pressable onPress={() => setShowTranscription(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            {showTranscription && (
              <>
                <ScrollView style={styles.transcriptionScroll}>
                  <Text style={styles.transcriptionText}>
                    {voiceNotes.find(n => n.id === showTranscription)?.transcription}
                  </Text>
                </ScrollView>
                <View style={styles.modalActions}>
                  <Pressable style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Convert to Task</Text>
                  </Pressable>
                  <Pressable style={[styles.modalButton, styles.modalButtonPrimary]}>
                    <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                      Save to Project
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  recorderCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  recorderContent: {
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  recordLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  recordHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  recordingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  recordingPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  recordingTime: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 16,
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stopLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  commandsScroll: {
    gap: 8,
  },
  commandChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  commandText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  notesSection: {
    flex: 1,
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteDuration: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  noteTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  noteAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteProject: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 8,
  },
  noteTranscription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
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
  transcriptionScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  transcriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalButtonPrimary: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  modalButtonTextPrimary: {
    color: '#FFF',
  },
});
