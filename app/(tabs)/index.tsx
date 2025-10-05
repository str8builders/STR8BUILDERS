import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { JobTimer } from '@/components/dashboard/JobTimer';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { TimesheetClock } from '@/components/dashboard/TimesheetClock';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Edit2, X } from 'lucide-react-native';

interface CustomWidget {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'stat';
}

export default function Dashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customWidgets, setCustomWidgets] = useState<CustomWidget[]>([]);
  const [newWidget, setNewWidget] = useState({ title: '', content: '', type: 'note' as 'note' | 'stat' });
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);

  const addCustomWidget = () => {
    if (newWidget.title.trim()) {
      const widget: CustomWidget = {
        id: Date.now().toString(),
        title: newWidget.title,
        content: newWidget.content,
        type: newWidget.type,
      };
      setCustomWidgets([...customWidgets, widget]);
      setNewWidget({ title: '', content: '', type: 'note' });
      setShowAddModal(false);
    }
  };

  const removeWidget = (id: string) => {
    setCustomWidgets(customWidgets.filter(w => w.id !== id));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    if (hiddenWidgets.includes(widgetId)) {
      setHiddenWidgets(hiddenWidgets.filter(id => id !== widgetId));
    } else {
      setHiddenWidgets([...hiddenWidgets, widgetId]);
    }
  };

  const isWidgetVisible = (widgetId: string) => !hiddenWidgets.includes(widgetId);

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>STR8 BUILD</Text>
          <Text style={styles.subtitle}>Construction Dashboard</Text>
          <View style={styles.headerButtons}>
            <Pressable
              style={[styles.editButton, isEditMode && styles.editButtonActive]}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Edit2 color={isEditMode ? "#3B82F6" : "#94A3B8"} size={20} />
              <Text style={[styles.editButtonText, isEditMode && styles.editButtonTextActive]}>
                {isEditMode ? 'Done' : 'Edit'}
              </Text>
            </Pressable>
            {isEditMode && (
              <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
                <Plus color="#FFF" size={20} />
                <Text style={styles.addButtonText}>Add Widget</Text>
              </Pressable>
            )}
          </View>
        </View>

        {isWidgetVisible('jobTimer') && (
          <View style={styles.widgetWrapper}>
            <JobTimer />
            {isEditMode && (
              <Pressable
                style={styles.widgetDeleteButton}
                onPress={() => toggleWidgetVisibility('jobTimer')}
              >
                <X color="#EF4444" size={18} />
              </Pressable>
            )}
          </View>
        )}

        {isWidgetVisible('timesheetClock') && (
          <View style={styles.widgetWrapper}>
            <TimesheetClock
              isEditMode={isEditMode}
              onRemove={() => toggleWidgetVisibility('timesheetClock')}
            />
          </View>
        )}

        <View style={styles.row}>
          {isWidgetVisible('weather') && (
            <View style={[styles.halfWidth, styles.widgetWrapper]}>
              <WeatherWidget />
              {isEditMode && (
                <Pressable
                  style={styles.widgetDeleteButton}
                  onPress={() => toggleWidgetVisibility('weather')}
                >
                  <X color="#EF4444" size={18} />
                </Pressable>
              )}
            </View>
          )}
          {isWidgetVisible('quickStats') && (
            <View style={[styles.halfWidth, styles.widgetWrapper]}>
              <QuickStats />
              {isEditMode && (
                <Pressable
                  style={styles.widgetDeleteButton}
                  onPress={() => toggleWidgetVisibility('quickStats')}
                >
                  <X color="#EF4444" size={18} />
                </Pressable>
              )}
            </View>
          )}
        </View>

        {customWidgets.map((widget) => (
          <View key={widget.id} style={styles.customWidgetContainer}>
            <GlassCard variant="default" style={styles.customWidget}>
              <View style={styles.customWidgetHeader}>
                <Text style={styles.customWidgetTitle}>{widget.title}</Text>
                {isEditMode && (
                  <Pressable onPress={() => removeWidget(widget.id)}>
                    <X color="#EF4444" size={20} />
                  </Pressable>
                )}
              </View>
              <Text style={styles.customWidgetContent}>{widget.content}</Text>
            </GlassCard>
          </View>
        ))}

        {isWidgetVisible('quickActions') && (
          <View style={styles.widgetWrapper}>
            <QuickActions />
            {isEditMode && (
              <Pressable
                style={styles.widgetDeleteButton}
                onPress={() => toggleWidgetVisibility('quickActions')}
              >
                <X color="#EF4444" size={18} />
              </Pressable>
            )}
          </View>
        )}

        {isWidgetVisible('activeProjects') && (
          <View style={styles.widgetWrapper}>
            <ActiveProjects />
            {isEditMode && (
              <Pressable
                style={styles.widgetDeleteButton}
                onPress={() => toggleWidgetVisibility('activeProjects')}
              >
                <X color="#EF4444" size={18} />
              </Pressable>
            )}
          </View>
        )}

        {isWidgetVisible('upcomingDeadlines') && (
          <View style={styles.widgetWrapper}>
            <UpcomingDeadlines />
            {isEditMode && (
              <Pressable
                style={styles.widgetDeleteButton}
                onPress={() => toggleWidgetVisibility('upcomingDeadlines')}
              >
                <X color="#EF4444" size={18} />
              </Pressable>
            )}
          </View>
        )}

        {isWidgetVisible('recentActivity') && (
          <View style={styles.widgetWrapper}>
            <RecentActivity />
            {isEditMode && (
              <Pressable
                style={styles.widgetDeleteButton}
                onPress={() => toggleWidgetVisibility('recentActivity')}
              >
                <X color="#EF4444" size={18} />
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Widget</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={newWidget.title}
                onChangeText={(text) => setNewWidget({...newWidget, title: text})}
                placeholder="Widget Title"
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newWidget.content}
                onChangeText={(text) => setNewWidget({...newWidget, content: text})}
                placeholder="Widget Content"
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.typeButtons}>
              <Pressable
                style={[styles.typeButton, newWidget.type === 'note' && styles.typeButtonActive]}
                onPress={() => setNewWidget({...newWidget, type: 'note'})}
              >
                <Text style={[styles.typeButtonText, newWidget.type === 'note' && styles.typeButtonTextActive]}>
                  Note
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typeButton, newWidget.type === 'stat' && styles.typeButtonActive]}
                onPress={() => setNewWidget({...newWidget, type: 'stat'})}
              >
                <Text style={[styles.typeButtonText, newWidget.type === 'stat' && styles.typeButtonTextActive]}>
                  Stat
                </Text>
              </Pressable>
            </View>

            <Pressable style={styles.submitButton} onPress={addCustomWidget}>
              <Text style={styles.submitButtonText}>Add Widget</Text>
            </Pressable>
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
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  editButtonTextActive: {
    color: '#3B82F6',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  halfWidth: {
    flex: 1,
  },
  widgetWrapper: {
    position: 'relative',
  },
  widgetDeleteButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 12,
    padding: 6,
    zIndex: 10,
  },
  customWidgetContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  customWidget: {
    padding: 16,
  },
  customWidgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customWidgetTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  customWidgetContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  typeButtonTextActive: {
    color: '#3B82F6',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
});