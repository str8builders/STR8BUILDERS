import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { Camera, FileText, MapPin, Clock, Tag, Save, Share, Trash2, Plus, Image } from 'lucide-react-native';

interface DocumentationEntry {
  id: string;
  type: 'photo' | 'note' | 'measurement' | 'issue';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  linkedCalculations?: string[];
  gpsCoordinates?: string;
  photos?: string[];
}

export const SiteDocumentationTool: React.FC = () => {
  const [entries, setEntries] = useState<DocumentationEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'note' as const,
    title: '',
    description: '',
    location: '',
    priority: 'medium' as const,
    tags: '',
  });

  const documentTypes = [
    { id: 'photo', label: 'Progress Photo', icon: <Camera color="#3B82F6" size={20} />, color: '#3B82F6' },
    { id: 'note', label: 'Site Note', icon: <FileText color="#10B981" size={20} />, color: '#10B981' },
    { id: 'measurement', label: 'Measurement', icon: <MapPin color="#F59E0B" size={20} />, color: '#F59E0B' },
    { id: 'issue', label: 'Issue Report', icon: <Tag color="#EF4444" size={20} />, color: '#EF4444' },
  ];

  const priorityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#DC2626',
  };

  const siteLocations = [
    'Foundation', 'Framing', 'Roofing', 'Interior', 'Exterior', 'Services',
    'Kitchen', 'Bathroom', 'Living Area', 'Bedroom', 'Garage', 'Deck/Patio'
  ];

  const handleAddEntry = () => {
    if (!newEntry.title.trim() || !newEntry.description.trim()) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    const entry: DocumentationEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      title: newEntry.title,
      description: newEntry.description,
      location: newEntry.location,
      timestamp: new Date(),
      priority: newEntry.priority,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      gpsCoordinates: `${(-37.5 + Math.random() * 0.1).toFixed(6)}, ${(176.0 + Math.random() * 0.1).toFixed(6)}`,
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      type: 'note',
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      tags: '',
    });
    setShowAddEntry(false);
    Alert.alert('Success', 'Documentation entry added successfully!');
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this documentation entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEntries(prev => prev.filter(entry => entry.id !== entryId));
            Alert.alert('Success', 'Entry deleted successfully');
          }
        }
      ]
    );
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Take Photo',
      'Camera functionality would open here to capture site photos with automatic GPS tagging and timestamp.',
      [{ text: 'OK' }]
    );
  };

  const handleShareEntry = (entry: DocumentationEntry) => {
    Alert.alert(
      'Share Documentation',
      `Share "${entry.title}" with team members or export to project files.`,
      [
        { text: 'Share with Team', onPress: () => console.log('Share with team') },
        { text: 'Export to Files', onPress: () => console.log('Export to files') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  };

  const getTypeIcon = (type: string) => {
    const typeData = documentTypes.find(t => t.id === type);
    return typeData?.icon || <FileText color="#94A3B8" size={16} />;
  };

  const getTypeColor = (type: string) => {
    const typeData = documentTypes.find(t => t.id === type);
    return typeData?.color || '#94A3B8';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Site Documentation</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
            <Camera color="#FFF" size={20} />
          </Pressable>
          <Pressable style={styles.addButton} onPress={() => setShowAddEntry(true)}>
            <Plus color="#FFF" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Quick Stats */}
      <GlassCard variant="electric" style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.filter(e => e.type === 'photo').length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.filter(e => e.priority === 'high' || e.priority === 'critical').length}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Set(entries.map(e => e.location)).size}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>
      </GlassCard>

      {/* Documentation Entries */}
      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <GlassCard variant="default" style={styles.emptyState}>
            <FileText color="#94A3B8" size={48} />
            <Text style={styles.emptyTitle}>No Documentation Yet</Text>
            <Text style={styles.emptyDescription}>
              Start documenting your construction progress with photos, notes, and measurements.
            </Text>
          </GlassCard>
        ) : (
          entries.map((entry) => (
            <GlassCard key={entry.id} variant="default" style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <View style={styles.entryTitleRow}>
                    <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(entry.type)}20` }]}>
                      {getTypeIcon(entry.type)}
                    </View>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                  </View>
                  <View style={styles.entryMeta}>
                    <Text style={styles.entryLocation}>📍 {entry.location}</Text>
                    <Text style={styles.entryTimestamp}>🕒 {formatTimestamp(entry.timestamp)}</Text>
                  </View>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColors[entry.priority] }]}>
                  <Text style={styles.priorityText}>{entry.priority.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.entryDescription}>{entry.description}</Text>

              {entry.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {entry.gpsCoordinates && (
                <Text style={styles.gpsText}>GPS: {entry.gpsCoordinates}</Text>
              )}

              <View style={styles.entryActions}>
                <Pressable 
                  style={styles.entryAction}
                  onPress={() => handleShareEntry(entry)}
                >
                  <Share color="#94A3B8" size={16} />
                  <Text style={styles.entryActionText}>Share</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.entryAction}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Trash2 color="#EF4444" size={16} />
                  <Text style={[styles.entryActionText, { color: '#EF4444' }]}>Delete</Text>
                </Pressable>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Documentation</Text>
              <Pressable onPress={() => setShowAddEntry(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Document Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Document Type</Text>
                <View style={styles.typeSelector}>
                  {documentTypes.map((type) => (
                    <Pressable
                      key={type.id}
                      style={[
                        styles.typeOption,
                        newEntry.type === type.id && styles.selectedTypeOption
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, type: type.id as any }))}
                    >
                      {type.icon}
                      <Text style={[
                        styles.typeOptionText,
                        newEntry.type === type.id && styles.selectedTypeOptionText
                      ]}>
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.title}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, title: text }))}
                  placeholder="Enter documentation title"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newEntry.description}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, description: text }))}
                  placeholder="Detailed description of the documentation..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Site Location</Text>
                <View style={styles.locationSelector}>
                  {siteLocations.map((location) => (
                    <Pressable
                      key={location}
                      style={[
                        styles.locationOption,
                        newEntry.location === location && styles.selectedLocationOption
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, location }))}
                    >
                      <Text style={[
                        styles.locationOptionText,
                        newEntry.location === location && styles.selectedLocationOptionText
                      ]}>
                        {location}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Priority */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority Level</Text>
                <View style={styles.prioritySelector}>
                  {Object.keys(priorityColors).map((priority) => (
                    <Pressable
                      key={priority}
                      style={[
                        styles.priorityOption,
                        { borderColor: priorityColors[priority as keyof typeof priorityColors] },
                        newEntry.priority === priority && { backgroundColor: priorityColors[priority as keyof typeof priorityColors] }
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, priority: priority as any }))}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newEntry.priority === priority && styles.selectedPriorityText
                      ]}>
                        {priority.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.tags}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, tags: text }))}
                  placeholder="foundation, concrete, inspection"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActionsContainer}>
                <Text style={styles.inputLabel}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <Pressable style={styles.quickAction} onPress={handleTakePhoto}>
                    <Camera color="#3B82F6" size={20} />
                    <Text style={styles.quickActionText}>Take Photo</Text>
                  </Pressable>
                  
                  <Pressable style={styles.quickAction} onPress={() => {
                    Alert.alert('GPS Location', 'Current GPS coordinates would be automatically captured here.');
                  }}>
                    <MapPin color="#10B981" size={20} />
                    <Text style={styles.quickActionText}>Add GPS</Text>
                  </Pressable>
                  
                  <Pressable style={styles.quickAction} onPress={() => {
                    Alert.alert('Link Calculations', 'Link this documentation to existing calculations for reference.');
                  }}>
                    <FileText color="#F59E0B" size={20} />
                    <Text style={styles.quickActionText}>Link Calcs</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAddEntry(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddEntry}
              >
                <Save color="#FFF" size={16} />
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Site Documentation</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
            <Camera color="#FFF" size={20} />
          </Pressable>
          <Pressable style={styles.addButton} onPress={() => setShowAddEntry(true)}>
            <Plus color="#FFF" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Quick Stats */}
      <GlassCard variant="electric" style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.filter(e => e.type === 'photo').length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entries.filter(e => e.priority === 'high' || e.priority === 'critical').length}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{new Set(entries.map(e => e.location)).size}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>
      </GlassCard>

      {/* Documentation Entries */}
      <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <GlassCard variant="default" style={styles.emptyState}>
            <FileText color="#94A3B8" size={48} />
            <Text style={styles.emptyTitle}>No Documentation Yet</Text>
            <Text style={styles.emptyDescription}>
              Start documenting your construction progress with photos, notes, and measurements.
            </Text>
          </GlassCard>
        ) : (
          entries.map((entry) => (
            <GlassCard key={entry.id} variant="default" style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <View style={styles.entryTitleRow}>
                    <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(entry.type)}20` }]}>
                      {getTypeIcon(entry.type)}
                    </View>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                  </View>
                  <View style={styles.entryMeta}>
                    <Text style={styles.entryLocation}>📍 {entry.location}</Text>
                    <Text style={styles.entryTimestamp}>🕒 {formatTimestamp(entry.timestamp)}</Text>
                  </View>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColors[entry.priority] }]}>
                  <Text style={styles.priorityText}>{entry.priority.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.entryDescription}>{entry.description}</Text>

              {entry.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {entry.gpsCoordinates && (
                <Text style={styles.gpsText}>GPS: {entry.gpsCoordinates}</Text>
              )}

              <View style={styles.entryActions}>
                <Pressable 
                  style={styles.entryAction}
                  onPress={() => handleShareEntry(entry)}
                >
                  <Share color="#94A3B8" size={16} />
                  <Text style={styles.entryActionText}>Share</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.entryAction}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Trash2 color="#EF4444" size={16} />
                  <Text style={[styles.entryActionText, { color: '#EF4444' }]}>Delete</Text>
                </Pressable>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Documentation</Text>
              <Pressable onPress={() => setShowAddEntry(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Document Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Document Type</Text>
                <View style={styles.typeSelector}>
                  {documentTypes.map((type) => (
                    <Pressable
                      key={type.id}
                      style={[
                        styles.typeOption,
                        newEntry.type === type.id && styles.selectedTypeOption
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, type: type.id as any }))}
                    >
                      {type.icon}
                      <Text style={[
                        styles.typeOptionText,
                        newEntry.type === type.id && styles.selectedTypeOptionText
                      ]}>
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.title}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, title: text }))}
                  placeholder="Enter documentation title"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newEntry.description}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, description: text }))}
                  placeholder="Detailed description of the documentation..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Site Location</Text>
                <View style={styles.locationSelector}>
                  {siteLocations.map((location) => (
                    <Pressable
                      key={location}
                      style={[
                        styles.locationOption,
                        newEntry.location === location && styles.selectedLocationOption
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, location }))}
                    >
                      <Text style={[
                        styles.locationOptionText,
                        newEntry.location === location && styles.selectedLocationOptionText
                      ]}>
                        {location}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Priority */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority Level</Text>
                <View style={styles.prioritySelector}>
                  {Object.keys(priorityColors).map((priority) => (
                    <Pressable
                      key={priority}
                      style={[
                        styles.priorityOption,
                        { borderColor: priorityColors[priority as keyof typeof priorityColors] },
                        newEntry.priority === priority && { backgroundColor: priorityColors[priority as keyof typeof priorityColors] }
                      ]}
                      onPress={() => setNewEntry(prev => ({ ...prev, priority: priority as any }))}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newEntry.priority === priority && styles.selectedPriorityText
                      ]}>
                        {priority.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.tags}
                  onChangeText={(text) => setNewEntry(prev => ({ ...prev, tags: text }))}
                  placeholder="foundation, concrete, inspection"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActionsContainer}>
                <Text style={styles.inputLabel}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <Pressable style={styles.quickAction} onPress={handleTakePhoto}>
                    <Camera color="#3B82F6" size={20} />
                    <Text style={styles.quickActionText}>Take Photo</Text>
                  </Pressable>
                  
                  <Pressable style={styles.quickAction} onPress={() => {
                    Alert.alert('GPS Location', 'Current GPS coordinates would be automatically captured here.');
                  }}>
                    <MapPin color="#10B981" size={20} />
                    <Text style={styles.quickActionText}>Add GPS</Text>
                  </Pressable>
                  
                  <Pressable style={styles.quickAction} onPress={() => {
                    Alert.alert('Link Calculations', 'Link this documentation to existing calculations for reference.');
                  }}>
                    <FileText color="#F59E0B" size={20} />
                    <Text style={styles.quickActionText}>Link Calcs</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAddEntry(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddEntry}
              >
                <Save color="#FFF" size={16} />
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    marginVertical: 0,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  entriesList: {
    flex: 1,
  },
  entryCard: {
    marginVertical: 0,
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    flex: 1,
  },
  entryMeta: {
    gap: 4,
  },
  entryLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  entryTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  entryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  gpsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  entryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedTypeOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedTypeOptionText: {
    color: '#FFF',
  },
  locationSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedLocationOption: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  locationOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedLocationOptionText: {
    color: '#FFF',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  priorityOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
  },
  selectedPriorityText: {
    color: '#FFF',
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
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
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});