import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, MapPin, Clock, User, TrendingUp, FolderOpen, X, Calendar } from 'lucide-react-native';
import { useAppData } from '@/hooks/useAppData';

export default function Projects() {
  const { projects, clients, addProject } = useAppData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: '',
    location: '',
    deadline: '',
    hourlyRate: '85',
    status: 'Planning' as 'Planning' | 'In Progress' | 'Nearly Complete' | 'Completed',
    progress: '0',
  });

  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    if (!newProject.clientId) {
      Alert.alert('Error', 'Please select a client');
      return;
    }

    const selectedClient = clients.find(c => c.id === newProject.clientId);
    if (!selectedClient) {
      Alert.alert('Error', 'Invalid client selected');
      return;
    }

    const project = addProject({
      name: newProject.name,
      client: selectedClient.name,
      clientId: newProject.clientId,
      location: newProject.location || 'Not specified',
      progress: parseInt(newProject.progress) || 0,
      deadline: newProject.deadline || new Date().toISOString().split('T')[0],
      hourlyRate: parseFloat(newProject.hourlyRate) || 85,
      status: newProject.status,
      estimatedCompletion: newProject.deadline || new Date().toISOString().split('T')[0],
    });

    if (project) {
      setNewProject({
        name: '',
        clientId: '',
        location: '',
        deadline: '',
        hourlyRate: '85',
        status: 'Planning',
        progress: '0',
      });
      setShowAddModal(false);
      Alert.alert('Success', 'Project created successfully!');
    }
  };

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

  const statusOptions: Array<'Planning' | 'In Progress' | 'Nearly Complete' | 'Completed'> = [
    'Planning',
    'In Progress',
    'Nearly Complete',
    'Completed'
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Projects</Text>
          <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
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

      {/* Add Project Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Project</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              {clients.length === 0 ? (
                <View style={styles.noClientsWarning}>
                  <Text style={styles.warningText}>
                    You need to add a client first before creating a project.
                  </Text>
                  <Text style={styles.warningHint}>
                    Go to the Clients tab to add a client.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Project Name *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newProject.name}
                      onChangeText={(text) => setNewProject(prev => ({ ...prev, name: text }))}
                      placeholder="e.g., House Extension Project"
                      placeholderTextColor="#64748B"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Client *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.clientSelector}>
                        {clients.map((client) => (
                          <Pressable
                            key={client.id}
                            style={[
                              styles.clientOption,
                              newProject.clientId === client.id && styles.selectedClientOption
                            ]}
                            onPress={() => setNewProject(prev => ({
                              ...prev,
                              clientId: client.id,
                              hourlyRate: client.hourlyRate.toString()
                            }))}
                          >
                            <Text style={[
                              styles.clientOptionText,
                              newProject.clientId === client.id && styles.selectedClientOptionText
                            ]}>
                              {client.name}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newProject.location}
                      onChangeText={(text) => setNewProject(prev => ({ ...prev, location: text }))}
                      placeholder="Project address or location"
                      placeholderTextColor="#64748B"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Deadline</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newProject.deadline}
                      onChangeText={(text) => setNewProject(prev => ({ ...prev, deadline: text }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#64748B"
                    />
                  </View>

                  <View style={styles.rowGroup}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={newProject.hourlyRate}
                        onChangeText={(text) => setNewProject(prev => ({ ...prev, hourlyRate: text }))}
                        placeholder="85"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Progress (%)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={newProject.progress}
                        onChangeText={(text) => setNewProject(prev => ({ ...prev, progress: text }))}
                        placeholder="0"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Status</Text>
                    <View style={styles.statusSelector}>
                      {statusOptions.map((status) => (
                        <Pressable
                          key={status}
                          style={[
                            styles.statusOption,
                            newProject.status === status && styles.selectedStatusOption,
                            { borderColor: getStatusColor(status) }
                          ]}
                          onPress={() => setNewProject(prev => ({ ...prev, status }))}
                        >
                          <Text style={[
                            styles.statusOptionText,
                            newProject.status === status && styles.selectedStatusOptionText
                          ]}>
                            {status}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton, clients.length === 0 && styles.disabledButton]}
                onPress={handleAddProject}
                disabled={clients.length === 0}
              >
                <Text style={styles.saveButtonText}>Create Project</Text>
              </Pressable>
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
    maxHeight: '90%',
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
  formContainer: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 8,
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
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  clientSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  clientOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedClientOption: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  clientOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedClientOptionText: {
    color: '#3B82F6',
  },
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
  },
  selectedStatusOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedStatusOptionText: {
    color: '#FFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  noClientsWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    textAlign: 'center',
  },
});
