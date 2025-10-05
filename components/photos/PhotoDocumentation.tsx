import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, Alert, Platform } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Camera, Image as ImageIcon, Grid, Calendar, Share2, Download, X, ArrowLeftRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface Photo {
  id: string;
  url: string;
  project: string;
  type: 'before' | 'progress' | 'after' | 'issue';
  caption: string;
  date: Date;
  tags: string[];
}

export function PhotoDocumentation() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
      project: 'Kitchen Renovation',
      type: 'before',
      caption: 'Before - Original kitchen layout',
      date: new Date(2025, 8, 1),
      tags: ['kitchen', 'before', 'demolition'],
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
      project: 'Kitchen Renovation',
      type: 'progress',
      caption: 'Framing complete, electrical rough-in',
      date: new Date(2025, 8, 15),
      tags: ['kitchen', 'framing', 'electrical'],
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      project: 'Kitchen Renovation',
      type: 'after',
      caption: 'Completed - Modern kitchen with island',
      date: new Date(2025, 9, 5),
      tags: ['kitchen', 'completed', 'modern'],
    },
    {
      id: '4',
      url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      project: 'Bathroom Remodel',
      type: 'before',
      caption: 'Before - Dated bathroom fixtures',
      date: new Date(2025, 8, 10),
      tags: ['bathroom', 'before'],
    },
    {
      id: '5',
      url: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg',
      project: 'Bathroom Remodel',
      type: 'progress',
      caption: 'Tiling in progress',
      date: new Date(2025, 8, 20),
      tags: ['bathroom', 'tiling', 'progress'],
    },
    {
      id: '6',
      url: 'https://images.pexels.com/photos/1358912/pexels-photo-1358912.jpeg',
      project: 'Bathroom Remodel',
      type: 'after',
      caption: 'After - Spa-like bathroom',
      date: new Date(2025, 9, 1),
      tags: ['bathroom', 'completed', 'modern'],
    },
  ]);

  const projects = ['all', ...Array.from(new Set(photos.map(p => p.project)))];

  const filteredPhotos = selectedProject === 'all'
    ? photos
    : photos.filter(p => p.project === selectedProject);

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Camera Not Available',
        'Camera access is not available on web. This feature works on iOS and Android devices.',
        [{ text: 'OK' }]
      );
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: result.assets[0].uri,
        project: selectedProject === 'all' ? 'New Project' : selectedProject,
        type: 'progress',
        caption: 'New photo',
        date: new Date(),
        tags: ['new'],
      };

      setPhotos([newPhoto, ...photos]);
      Alert.alert('Success', 'Photo added successfully!');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'before': return '#94A3B8';
      case 'progress': return '#3B82F6';
      case 'after': return '#10B981';
      case 'issue': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const getBeforeAfter = (projectName: string) => {
    const projectPhotos = photos.filter(p => p.project === projectName);
    const before = projectPhotos.find(p => p.type === 'before');
    const after = projectPhotos.find(p => p.type === 'after');
    return { before, after };
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Photo Documentation</Text>
          <Text style={styles.subtitle}>{filteredPhotos.length} photos</Text>
        </View>
        <Pressable style={styles.cameraButton} onPress={openCamera}>
          <Camera color="#FFF" size={24} />
        </Pressable>
      </View>

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectFilterContent}
        >
          {projects.map((project) => (
            <Pressable
              key={project}
              style={[
                styles.projectChip,
                selectedProject === project && styles.projectChipActive
              ]}
              onPress={() => setSelectedProject(project)}
            >
              <Text style={[
                styles.projectChipText,
                selectedProject === project && styles.projectChipTextActive
              ]}>
                {project === 'all' ? 'All Projects' : project}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeActive]}
          onPress={() => setViewMode('grid')}
        >
          <Grid color={viewMode === 'grid' ? '#3B82F6' : '#94A3B8'} size={20} />
        </Pressable>
        <Pressable
          style={[styles.viewModeButton, viewMode === 'timeline' && styles.viewModeActive]}
          onPress={() => setViewMode('timeline')}
        >
          <Calendar color={viewMode === 'timeline' ? '#3B82F6' : '#94A3B8'} size={20} />
        </Pressable>
        <Pressable
          style={styles.compareButton}
          onPress={() => setCompareMode(true)}
        >
          <ArrowLeftRight color="#10B981" size={20} />
          <Text style={styles.compareButtonText}>Compare</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {viewMode === 'grid' ? (
          <View style={styles.photoGrid}>
            {filteredPhotos.map((photo) => (
              <Pressable
                key={photo.id}
                style={styles.photoCard}
                onPress={() => setSelectedPhoto(photo)}
              >
                <Image source={{ uri: photo.url }} style={styles.photoImage} />
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(photo.type) }]}>
                  <Text style={styles.typeBadgeText}>{photo.type}</Text>
                </View>
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoProject} numberOfLines={1}>{photo.project}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.timeline}>
            {filteredPhotos.map((photo, index) => (
              <View key={photo.id} style={styles.timelineItem}>
                <View style={styles.timelineDate}>
                  <Text style={styles.timelineDateText}>
                    {photo.date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <View style={styles.timelineLine}>
                  <View style={[styles.timelineDot, { backgroundColor: getTypeColor(photo.type) }]} />
                  {index < filteredPhotos.length - 1 && <View style={styles.timelineConnector} />}
                </View>
                <Pressable
                  style={styles.timelineCard}
                  onPress={() => setSelectedPhoto(photo)}
                >
                  <Image source={{ uri: photo.url }} style={styles.timelineImage} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineProject}>{photo.project}</Text>
                    <Text style={styles.timelineCaption}>{photo.caption}</Text>
                    <View style={styles.timelineTags}>
                      {photo.tags.slice(0, 2).map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.modalClose} onPress={() => setSelectedPhoto(null)}>
              <X color="#FFF" size={24} />
            </Pressable>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalAction}>
                <Share2 color="#FFF" size={20} />
              </Pressable>
              <Pressable style={styles.modalAction}>
                <Download color="#FFF" size={20} />
              </Pressable>
            </View>
          </View>
          {selectedPhoto && (
            <>
              <Image source={{ uri: selectedPhoto.url }} style={styles.modalImage} />
              <View style={styles.modalInfo}>
                <GlassCard variant="default" style={styles.modalInfoCard}>
                  <View style={[styles.modalTypeBadge, { backgroundColor: getTypeColor(selectedPhoto.type) }]}>
                    <Text style={styles.modalTypeBadgeText}>{selectedPhoto.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.modalProject}>{selectedPhoto.project}</Text>
                  <Text style={styles.modalCaption}>{selectedPhoto.caption}</Text>
                  <Text style={styles.modalDate}>
                    {selectedPhoto.date.toLocaleDateString('en-NZ', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <View style={styles.modalTags}>
                    {selectedPhoto.tags.map((tag) => (
                      <View key={tag} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              </View>
            </>
          )}
        </View>
      </Modal>

      <Modal
        visible={compareMode}
        transparent
        animationType="slide"
        onRequestClose={() => setCompareMode(false)}
      >
        <View style={styles.compareOverlay}>
          <View style={styles.compareHeader}>
            <Text style={styles.compareTitle}>Before & After Comparison</Text>
            <Pressable onPress={() => setCompareMode(false)}>
              <X color="#FFF" size={24} />
            </Pressable>
          </View>
          <ScrollView style={styles.compareContent}>
            {Array.from(new Set(photos.map(p => p.project))).map((project) => {
              const { before, after } = getBeforeAfter(project);
              if (!before || !after) return null;

              return (
                <GlassCard key={project} variant="default" style={styles.compareCard}>
                  <Text style={styles.compareProject}>{project}</Text>
                  <View style={styles.compareImages}>
                    <View style={styles.compareImageContainer}>
                      <Image source={{ uri: before.url }} style={styles.compareImage} />
                      <View style={styles.compareLabel}>
                        <Text style={styles.compareLabelText}>BEFORE</Text>
                      </View>
                    </View>
                    <View style={styles.compareImageContainer}>
                      <Image source={{ uri: after.url }} style={styles.compareImage} />
                      <View style={[styles.compareLabel, { backgroundColor: '#10B981' }]}>
                        <Text style={styles.compareLabelText}>AFTER</Text>
                      </View>
                    </View>
                  </View>
                  <Pressable style={styles.shareCompareButton}>
                    <Share2 color="#3B82F6" size={16} />
                    <Text style={styles.shareCompareText}>Share Comparison</Text>
                  </Pressable>
                </GlassCard>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
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
  cameraButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    marginBottom: 12,
  },
  projectFilterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  projectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  projectChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  projectChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  projectChipTextActive: {
    color: '#3B82F6',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    marginLeft: 'auto',
  },
  compareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 100,
  },
  photoCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  photoProject: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  timeline: {
    paddingBottom: 100,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineDate: {
    width: 60,
    paddingTop: 4,
  },
  timelineDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
  },
  timelineLine: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineConnector: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timelineImage: {
    width: 100,
    height: 100,
  },
  timelineContent: {
    flex: 1,
    padding: 12,
  },
  timelineProject: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  timelineCaption: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 8,
  },
  timelineTags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  modalInfo: {
    flex: 1,
    padding: 16,
  },
  modalInfoCard: {
    padding: 20,
  },
  modalTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalTypeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  modalProject: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  modalCaption: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    marginBottom: 12,
  },
  modalDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  modalTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  compareOverlay: {
    flex: 1,
    backgroundColor: '#0f1023',
  },
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  compareTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  compareContent: {
    flex: 1,
    padding: 16,
  },
  compareCard: {
    padding: 16,
    marginBottom: 16,
  },
  compareProject: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  compareImages: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  compareImageContainer: {
    flex: 1,
    position: 'relative',
  },
  compareImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  compareLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: '#94A3B8',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  compareLabelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  shareCompareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  shareCompareText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});
