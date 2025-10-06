import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { Plus, Clock, Calendar, User, CreditCard as Edit3, Trash2, X, Check, Timer, FileText, Mail, Download } from 'lucide-react-native';
import { useAppData } from '@/hooks/useAppData';
import { generateTimesheetPDF, shareViaPDF, sendViaEmail } from '@/utils/pdfGenerator';

export const TimesheetManager: React.FC = () => {
  const { 
    clients, 
    projects, 
    timesheets, 
    addTimesheetEntry, 
    updateTimesheetEntry,
    getProjectsByClient 
  } = useAppData();

  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    description: '',
    hourlyRate: '85'
  });

  const resetForm = () => {
    setEntryForm({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      description: '',
      hourlyRate: '85'
    });
    setSelectedClient('');
    setSelectedProject('');
    setEditingEntry(null);
  };

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const handleSaveEntry = () => {
    if (!selectedClient || !selectedProject || !entryForm.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    const project = projects.find(p => p.id === selectedProject);
    
    if (!client || !project) {
      Alert.alert('Error', 'Invalid client or project selection');
      return;
    }

    const hours = calculateHours(entryForm.startTime, entryForm.endTime);
    if (hours <= 0) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    const entryData = {
      clientId: selectedClient,
      projectId: selectedProject,
      projectName: project.name,
      clientName: client.name,
      date: entryForm.date,
      startTime: entryForm.startTime,
      endTime: entryForm.endTime,
      hours: parseFloat(hours.toFixed(2)),
      rate: parseFloat(entryForm.hourlyRate),
      description: entryForm.description,
      invoiced: false,
    };

    if (editingEntry) {
      updateTimesheetEntry(editingEntry.id, entryData);
      Alert.alert('Success', 'Timesheet entry updated successfully!');
    } else {
      addTimesheetEntry(entryData);
      Alert.alert('Success', 'Timesheet entry added successfully!');
    }

    resetForm();
    setShowManualEntry(false);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setSelectedClient(entry.clientId);
    setSelectedProject(entry.projectId);
    setEntryForm({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      description: entry.description,
      hourlyRate: (entry.rate ?? 0).toString()
    });
    setShowManualEntry(true);
  };

  const getRecentEntries = () => {
    return timesheets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return timesheets.filter(entry => entry.date === today);
  };

  const getWeekEntries = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    return timesheets.filter(entry => entry.date >= weekStartStr);
  };

  const todayHours = getTodayEntries().reduce((sum, entry) => sum + entry.hours, 0);
  const weekHours = getWeekEntries().reduce((sum, entry) => sum + entry.hours, 0);
  const todayEarnings = getTodayEntries().reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);
  const weekEarnings = getWeekEntries().reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);

  const clientProjects = selectedClient ? getProjectsByClient(selectedClient) : [];

  const handleExportPDF = async (clientId?: string) => {
    try {
      const entriesToExport = clientId
        ? getWeekEntries().filter(e => e.clientId === clientId)
        : getWeekEntries();

      if (entriesToExport.length === 0) {
        Alert.alert('Error', 'No timesheet entries to export');
        return;
      }

      const client = clientId
        ? clients.find(c => c.id === clientId)
        : { id: 'all', name: 'All Clients', email: '', phone: '', address: '', status: 'Active' as const };

      if (!client) {
        Alert.alert('Error', 'Client not found');
        return;
      }

      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const period = `Week of ${weekStart.toLocaleDateString()}`;

      const uri = await generateTimesheetPDF(entriesToExport, client, period);
      await shareViaPDF(uri, `Timesheet-${client.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      Alert.alert('Success', 'Timesheet PDF generated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      console.error(error);
    }
  };

  const handleEmailTimesheet = async (clientId?: string) => {
    try {
      const entriesToExport = clientId
        ? getWeekEntries().filter(e => e.clientId === clientId)
        : getWeekEntries();

      if (entriesToExport.length === 0) {
        Alert.alert('Error', 'No timesheet entries to send');
        return;
      }

      const client = clientId
        ? clients.find(c => c.id === clientId)
        : { id: 'all', name: 'All Clients', email: '', phone: '', address: '', status: 'Active' as const };

      if (!client) {
        Alert.alert('Error', 'Client not found');
        return;
      }

      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const period = `Week of ${weekStart.toLocaleDateString()}`;

      const totalHours = entriesToExport.reduce((sum, entry) => sum + entry.hours, 0);
      const totalAmount = entriesToExport.reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);

      const uri = await generateTimesheetPDF(entriesToExport, client, period);
      await sendViaEmail(
        uri,
        `Timesheet-${client.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
        client.email || 'client@example.com',
        `Timesheet Report - ${period}`,
        `Dear ${client.name},\n\nPlease find attached your timesheet report for ${period}.\n\nTotal Hours: ${totalHours.toFixed(1)}\nTotal Amount: $${totalAmount.toFixed(2)}\n\nThank you for your business!\n\nBest regards,\nSTR8 BUILD`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send email. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timesheet Management</Text>
        <Pressable 
          style={styles.addButton} 
          onPress={() => setShowManualEntry(true)}
        >
          <Plus color="#FFF" size={20} />
          <Text style={styles.addButtonText}>Manual Entry</Text>
        </Pressable>
      </View>

      {/* Summary Stats */}
      <GlassCard variant="electric" style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Time Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{todayHours.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weekHours.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>This Week</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${todayEarnings.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${weekEarnings.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Week's Earnings</Text>
          </View>
        </View>
      </GlassCard>

      {/* Export Actions */}
      <View style={styles.exportActions}>
        <Pressable
          style={[styles.exportButton, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6' }]}
          onPress={() => handleExportPDF()}
        >
          <Download color="#3B82F6" size={18} />
          <Text style={[styles.exportButtonText, { color: '#3B82F6' }]}>Export PDF</Text>
        </Pressable>

        <Pressable
          style={[styles.exportButton, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981' }]}
          onPress={() => handleEmailTimesheet()}
        >
          <Mail color="#10B981" size={18} />
          <Text style={[styles.exportButtonText, { color: '#10B981' }]}>Email Report</Text>
        </Pressable>
      </View>

      {/* Recent Entries */}
      <GlassCard variant="teal" style={styles.entriesCard}>
        <View style={styles.entriesHeader}>
          <Text style={styles.cardTitle}>Recent Entries</Text>
          <FileText color="#14B8A6" size={20} />
        </View>
        
        {getRecentEntries().length === 0 ? (
          <View style={styles.emptyState}>
            <Timer color="#14B8A6" size={32} />
            <Text style={styles.emptyTitle}>No Time Entries</Text>
            <Text style={styles.emptyDescription}>
              Start the job timer or add manual entries to track your work time
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
            {getRecentEntries().map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryProject}>{entry.projectName}</Text>
                    <Text style={styles.entryClient}>{entry.clientName}</Text>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                  <View style={styles.entryAmount}>
                    <Text style={styles.entryHours}>{entry.hours}h</Text>
                    <Text style={styles.entryEarnings}>${(entry.hours * entry.rate).toFixed(2)}</Text>
                  </View>
                </View>
                
                <Text style={styles.entryDescription}>{entry.description}</Text>
                
                <View style={styles.entryFooter}>
                  <Text style={styles.entryTime}>
                    {entry.startTime} - {entry.endTime}
                  </Text>
                  <View style={styles.entryActions}>
                    <Pressable 
                      style={styles.editButton}
                      onPress={() => handleEditEntry(entry)}
                    >
                      <Edit3 color="#3B82F6" size={16} />
                    </Pressable>
                    <View style={[
                      styles.invoiceStatus,
                      { backgroundColor: entry.invoiced ? '#10B981' : '#F59E0B' }
                    ]}>
                      <Text style={styles.invoiceStatusText}>
                        {entry.invoiced ? 'Invoiced' : 'Unbilled'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </GlassCard>

      {/* Manual Entry Modal */}
      <Modal
        visible={showManualEntry}
        transparent
        animationType="slide"
        onRequestClose={() => {
          resetForm();
          setShowManualEntry(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEntry ? 'Edit Time Entry' : 'Manual Time Entry'}
              </Text>
              <Pressable onPress={() => {
                resetForm();
                setShowManualEntry(false);
              }}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.formContainer}>
              {/* Client Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Client *</Text>
                <View style={styles.pickerContainer}>
                  {clients.length === 0 ? (
                    <Text style={styles.emptyPickerText}>No clients available</Text>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {clients.map((client) => (
                        <Pressable
                          key={client.id}
                          style={[
                            styles.pickerItem,
                            selectedClient === client.id && styles.selectedPickerItem
                          ]}
                          onPress={() => {
                            setSelectedClient(client.id);
                            setSelectedProject('');
                            setEntryForm(prev => ({ ...prev, hourlyRate: client.hourlyRate.toString() }));
                          }}
                        >
                          <Text style={[
                            styles.pickerText,
                            selectedClient === client.id && styles.selectedPickerText
                          ]}>
                            {client.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* Project Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project *</Text>
                <View style={styles.pickerContainer}>
                  {!selectedClient ? (
                    <Text style={styles.emptyPickerText}>Select a client first</Text>
                  ) : clientProjects.length === 0 ? (
                    <Text style={styles.emptyPickerText}>No projects for this client</Text>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {clientProjects.map((project) => (
                        <Pressable
                          key={project.id}
                          style={[
                            styles.pickerItem,
                            selectedProject === project.id && styles.selectedPickerItem
                          ]}
                          onPress={() => {
                            setSelectedProject(project.id);
                            setEntryForm(prev => ({ ...prev, hourlyRate: project.hourlyRate.toString() }));
                          }}
                        >
                          <Text style={[
                            styles.pickerText,
                            selectedProject === project.id && styles.selectedPickerText
                          ]}>
                            {project.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={entryForm.date}
                  onChangeText={(text) => setEntryForm(prev => ({ ...prev, date: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Time Range */}
              <View style={styles.timeRow}>
                <View style={styles.timeInput}>
                  <Text style={styles.inputLabel}>Start Time *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={entryForm.startTime}
                    onChangeText={(text) => setEntryForm(prev => ({ ...prev, startTime: text }))}
                    placeholder="09:00"
                    placeholderTextColor="#64748B"
                  />
                </View>
                
                <View style={styles.timeInput}>
                  <Text style={styles.inputLabel}>End Time *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={entryForm.endTime}
                    onChangeText={(text) => setEntryForm(prev => ({ ...prev, endTime: text }))}
                    placeholder="17:00"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>

              {/* Hours Calculation Display */}
              <View style={styles.hoursDisplay}>
                <Text style={styles.hoursLabel}>Total Hours:</Text>
                <Text style={styles.hoursValue}>
                  {calculateHours(entryForm.startTime, entryForm.endTime).toFixed(2)}h
                </Text>
              </View>

              {/* Hourly Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hourly Rate ($) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={entryForm.hourlyRate}
                  onChangeText={(text) => setEntryForm(prev => ({ ...prev, hourlyRate: text }))}
                  placeholder="85"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Work Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={entryForm.description}
                  onChangeText={(text) => setEntryForm(prev => ({ ...prev, description: text }))}
                  placeholder="Describe the work performed..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Earnings Preview */}
              <GlassCard variant="electric" style={styles.previewCard}>
                <Text style={styles.previewTitle}>Entry Preview</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Hours:</Text>
                  <Text style={styles.previewValue}>
                    {calculateHours(entryForm.startTime, entryForm.endTime).toFixed(2)}h
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Rate:</Text>
                  <Text style={styles.previewValue}>${entryForm.hourlyRate}/hr</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Total Earnings:</Text>
                  <Text style={styles.previewEarnings}>
                    ${(calculateHours(entryForm.startTime, entryForm.endTime) * parseFloat(entryForm.hourlyRate || '0')).toFixed(2)}
                  </Text>
                </View>
              </GlassCard>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  resetForm();
                  setShowManualEntry(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveEntry}
              >
                <Text style={styles.saveButtonText}>
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#14B8A6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 0,
    marginBottom: 16,
  },
  exportActions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  entriesCard: {
    marginHorizontal: 16,
    marginVertical: 0,
    flex: 1,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  entriesList: {
    flex: 1,
  },
  entryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryInfo: {
    flex: 1,
  },
  entryProject: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  entryClient: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
    marginTop: 2,
  },
  entryDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  entryAmount: {
    alignItems: 'flex-end',
  },
  entryHours: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  entryEarnings: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginTop: 2,
  },
  entryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 12,
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  entryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  invoiceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invoiceStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
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
    maxHeight: 500,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pickerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedPickerItem: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  pickerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedPickerText: {
    color: '#FFF',
  },
  emptyPickerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
  },
  hoursDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  hoursLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  hoursValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  previewCard: {
    marginVertical: 0,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  previewValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  previewEarnings: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
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
    backgroundColor: '#14B8A6',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});