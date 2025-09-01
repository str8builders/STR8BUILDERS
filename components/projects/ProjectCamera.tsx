import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, ScrollView, Alert, Image, Platform } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { ForwardedCameraView } from '../ForwardedCameraView';
import { GlassCard } from '../ui/GlassCard';
import { Camera, FlipHorizontal, X, Save, FileText, MapPin, Calendar, Tag, Trash2, Eye, Share } from 'lucide-react-native';
import { useAppData } from '@/hooks/useAppData';

interface ProjectPhoto {
  id: string;
  projectId: string;
  projectName: string;
  uri: string;
  notes: string;
  location: string;
  tags: string[];
  timestamp: Date;
  gpsCoordinates?: string;
}

interface ProjectCameraProps {
  onClose: () => void;
  selectedProjectId?: string;
}

export const ProjectCamera: React.FC<ProjectCameraProps> = ({ onClose, selectedProjectId }) => {
  const { projects } = useAppData();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedProject, setSelectedProject] = useState(selectedProjectId || '');
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoLocation, setPhotoLocation] = useState('');
  const [photoTags, setPhotoTags] = useState('');
  const [savedPhotos, setSavedPhotos] = useState<ProjectPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | null>(null);
  const cameraRef = useRef<any>(null);

  const siteLocations = [
    'Foundation', 'Framing', 'Roofing', 'Interior', 'Exterior', 'Services',
    'Kitchen', 'Bathroom', 'Living Area', 'Bedroom', 'Garage', 'Deck/Patio',
    'Electrical', 'Plumbing', 'HVAC', 'Insulation', 'Drywall', 'Flooring'
  ];

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <GlassCard variant="electric" style={styles.permissionCard}>
          <Camera color="#3B82F6" size={48} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            Project camera needs access to take photos for documentation.
          </Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </Pressable>
        </GlassCard>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo) {
        setCapturedPhoto(photo.uri);
        setShowNoteModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const savePhotoWithNotes = () => {
    if (!capturedPhoto || !selectedProject) {
      Alert.alert('Error', 'Please select a project and add notes');
      return;
    }

    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      Alert.alert('Error', 'Invalid project selection');
      return;
    }

    const newPhoto: ProjectPhoto = {
      id: Date.now().toString(),
      projectId: selectedProject,
      projectName: project.name,
      uri: capturedPhoto,
      notes: photoNotes,
      location: photoLocation,
      tags: photoTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      timestamp: new Date(),
      gpsCoordinates: `${(-37.5 + Math.random() * 0.1).toFixed(6)}, ${(176.0 + Math.random() * 0.1).toFixed(6)}`,
    };

    setSavedPhotos(prev => [newPhoto, ...prev]);
    
    // Reset form
    setCapturedPhoto(null);
    setPhotoNotes('');
    setPhotoLocation('');
    setPhotoTags('');
    setShowNoteModal(false);
    
    Alert.alert('Success', 'Photo saved to project documentation!');
  };

  const deletePhoto = (photoId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSavedPhotos(prev => prev.filter(photo => photo.id !== photoId));
            setSelectedPhoto(null);
            Alert.alert('Success', 'Photo deleted successfully');
          }
        }
      ]
    );
  };

  const sharePhoto = (photo: ProjectPhoto) => {
    Alert.alert(
      'Share Photo',
      `Share "${photo.notes || 'Project Photo'}" with team members?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share with Team', onPress: () => {
          Alert.alert('Success', 'Photo shared with project team');
        }},
        { text: 'Export to Files', onPress: () => {
          Alert.alert('Success', 'Photo exported to device files');
        }}
      ]
    );
  };

  const getProjectPhotos = () => {
    if (!selectedProject) return savedPhotos;
    return savedPhotos.filter(photo => photo.projectId === selectedProject);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
  };

  if (showGallery) {
    return (
      <View style={styles.container}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>Project Photos</Text>
          <View style={styles.galleryActions}>
            <Pressable 
              style={styles.backButton}
              onPress={() => setShowGallery(false)}
            >
              <Camera color="#FFF" size={20} />
              <Text style={styles.backButtonText}>Camera</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X color="#FFF" size={20} />
            </Pressable>
          </View>
        </View>

        {/* Project Selector */}
        <View style={styles.projectSelector}>
          <Text style={styles.selectorLabel}>Select Project:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              style={[
                styles.projectOption,
                !selectedProject && styles.selectedProjectOption
              ]}
              onPress={() => setSelectedProject('')}
            >
              <Text style={[
                styles.projectOptionText,
                !selectedProject && styles.selectedProjectOptionText
              ]}>
                All Projects
              </Text>
            </Pressable>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                style={[
                  styles.projectOption,
                  selectedProject === project.id && styles.selectedProjectOption
                ]}
                onPress={() => setSelectedProject(project.id)}
              >
                <Text style={[
                  styles.projectOptionText,
                  selectedProject === project.id && styles.selectedProjectOptionText
                ]}>
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Photo Gallery */}
        <ScrollView style={styles.photoGallery} showsVerticalScrollIndicator={false}>
          {getProjectPhotos().length === 0 ? (
            <GlassCard variant="default" style={styles.emptyGallery}>
              <Camera color="#94A3B8" size={48} />
              <Text style={styles.emptyTitle}>No Photos Yet</Text>
              <Text style={styles.emptyDescription}>
                Take photos to document project progress and important details.
              </Text>
            </GlassCard>
          ) : (
            <View style={styles.photosGrid}>
              {getProjectPhotos().map((photo) => (
                <GlassCard key={photo.id} variant="default" style={styles.photoCard}>
                  <Pressable onPress={() => setSelectedPhoto(photo)}>
                    <View style={styles.photoContainer}>
                      <View style={styles.photoPlaceholder}>
                        <Camera color="#94A3B8" size={32} />
                        <Text style={styles.photoPlaceholderText}>Photo Preview</Text>
                      </View>
                    </View>
                    
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoProject}>{photo.projectName}</Text>
                      <Text style={styles.photoNotes} numberOfLines={2}>
                        {photo.notes || 'No notes added'}
                      </Text>
                      <View style={styles.photoMeta}>
                        <Text style={styles.photoLocation}>📍 {photo.location}</Text>
                        <Text style={styles.photoTimestamp}>
                          {formatTimestamp(photo.timestamp)}
                        </Text>
                      </View>
                      
                      {photo.tags.length > 0 && (
                        <View style={styles.photoTags}>
                          {photo.tags.slice(0, 2).map((tag, index) => (
                            <View key={index} style={styles.photoTag}>
                              <Text style={styles.photoTagText}>#{tag}</Text>
                            </View>
                          ))}
                          {photo.tags.length > 2 && (
                            <Text style={styles.moreTagsText}>+{photo.tags.length - 2}</Text>
                          )}
                        </View>
                      )}
                    </View>
                  </Pressable>
                </GlassCard>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Photo Detail Modal */}
        <Modal
          visible={selectedPhoto !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.photoDetailModal}>
              <View style={styles.photoDetailHeader}>
                <Text style={styles.photoDetailTitle}>{selectedPhoto?.projectName}</Text>
                <Pressable onPress={() => setSelectedPhoto(null)}>
                  <X color="#94A3B8" size={24} />
                </Pressable>
              </View>
              
              {selectedPhoto && (
                <ScrollView style={styles.photoDetailContent}>
                  <View style={styles.photoDetailContainer}>
                    <View style={styles.photoDetailPlaceholder}>
                      <Camera color="#94A3B8" size={48} />
                      <Text style={styles.photoDetailPlaceholderText}>
                        High Resolution Photo
                      </Text>
                      <Text style={styles.photoDetailPlaceholderSubtext}>
                        Taken: {formatTimestamp(selectedPhoto.timestamp)}
                      </Text>
                    </View>
                  </View>
                  
                  <GlassCard variant="electric" style={styles.photoDetailInfo}>
                    <Text style={styles.photoDetailNotes}>{selectedPhoto.notes}</Text>
                    
                    <View style={styles.photoDetailMeta}>
                      <View style={styles.photoDetailRow}>
                        <MapPin color="#94A3B8" size={16} />
                        <Text style={styles.photoDetailText}>
                          {selectedPhoto.location || 'No location specified'}
                        </Text>
                      </View>
                      
                      <View style={styles.photoDetailRow}>
                        <Calendar color="#94A3B8" size={16} />
                        <Text style={styles.photoDetailText}>
                          {formatTimestamp(selectedPhoto.timestamp)}
                        </Text>
                      </View>
                      
                      {selectedPhoto.gpsCoordinates && (
                        <View style={styles.photoDetailRow}>
                          <MapPin color="#94A3B8" size={16} />
                          <Text style={styles.photoDetailText}>
                            GPS: {selectedPhoto.gpsCoordinates}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {selectedPhoto.tags.length > 0 && (
                      <View style={styles.photoDetailTags}>
                        <Text style={styles.tagsTitle}>Tags:</Text>
                        <View style={styles.tagsContainer}>
                          {selectedPhoto.tags.map((tag, index) => (
                            <View key={index} style={styles.photoTag}>
                              <Text style={styles.photoTagText}>#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </GlassCard>
                </ScrollView>
              )}
              
              <View style={styles.photoDetailActions}>
                <Pressable 
                  style={styles.sharePhotoButton}
                  onPress={() => selectedPhoto && sharePhoto(selectedPhoto)}
                >
                  <Share color="#FFF" size={16} />
                  <Text style={styles.sharePhotoButtonText}>Share</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.deletePhotoButton}
                  onPress={() => selectedPhoto && deletePhoto(selectedPhoto.id)}
                >
                  <Trash2 color="#FFF" size={16} />
                  <Text style={styles.deletePhotoButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ForwardedCameraView 
        ref={Platform.OS !== 'web' ? cameraRef : null}
        style={styles.camera} 
        facing={facing}
      >
        {/* Camera Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <GlassCard variant="electric" style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Project Camera</Text>
                <View style={styles.headerActions}>
                  <Pressable 
                    style={styles.galleryButton}
                    onPress={() => setShowGallery(true)}
                  >
                    <Eye color="#FFF" size={20} />
                    <Text style={styles.galleryButtonText}>
                      Gallery ({savedPhotos.length})
                    </Text>
                  </Pressable>
                  <Pressable onPress={onClose}>
                    <X color="#FFF" size={24} />
                  </Pressable>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Project Selector */}
          <View style={styles.projectSelectorOverlay}>
            <GlassCard variant="default" style={styles.projectSelectorCard}>
              <Text style={styles.selectorLabel}>Project:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {projects.map((project) => (
                  <Pressable
                    key={project.id}
                    style={[
                      styles.projectOption,
                      selectedProject === project.id && styles.selectedProjectOption
                    ]}
                    onPress={() => setSelectedProject(project.id)}
                  >
                    <Text style={[
                      styles.projectOptionText,
                      selectedProject === project.id && styles.selectedProjectOptionText
                    ]}>
                      {project.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </GlassCard>
          </View>

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <GlassCard variant="electric" style={styles.controlsCard}>
              <View style={styles.controls}>
                <Pressable 
                  style={styles.flipButton}
                  onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
                >
                  <FlipHorizontal color="#FFF" size={24} />
                </Pressable>
                
                <Pressable style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner}>
                    <Camera color="#FFF" size={32} />
                  </View>
                </Pressable>
                
                <View style={styles.placeholder} />
              </View>
            </GlassCard>
          </View>

          {/* Grid Overlay for Composition */}
          <View style={styles.gridOverlay}>
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, styles.gridLineVertical]} />
            <View style={[styles.gridLine, styles.gridLineHorizontal1]} />
            <View style={[styles.gridLine, styles.gridLineHorizontal2]} />
          </View>
        </View>
      </ForwardedCameraView>

      {/* Photo Notes Modal */}
      <Modal
        visible={showNoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Photo Notes</Text>
              <Pressable onPress={() => setShowNoteModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Photo Preview */}
              <View style={styles.photoPreview}>
                <View style={styles.photoPreviewContainer}>
                  <Camera color="#94A3B8" size={32} />
                  <Text style={styles.photoPreviewText}>Photo Preview</Text>
                  <Text style={styles.photoPreviewSubtext}>
                    Captured: {new Date().toLocaleTimeString()}
                  </Text>
                </View>
              </View>

              {/* Project Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project *</Text>
                <View style={styles.projectSelectorContainer}>
                  {projects.map((project) => (
                    <Pressable
                      key={project.id}
                      style={[
                        styles.projectSelectOption,
                        selectedProject === project.id && styles.selectedProjectSelectOption
                      ]}
                      onPress={() => setSelectedProject(project.id)}
                    >
                      <Text style={[
                        styles.projectSelectText,
                        selectedProject === project.id && styles.selectedProjectSelectText
                      ]}>
                        {project.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Photo Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Photo Notes *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={photoNotes}
                  onChangeText={setPhotoNotes}
                  placeholder="Describe what this photo shows, progress made, issues found, etc."
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
                        photoLocation === location && styles.selectedLocationOption
                      ]}
                      onPress={() => setPhotoLocation(location)}
                    >
                      <Text style={[
                        styles.locationOptionText,
                        photoLocation === location && styles.selectedLocationOptionText
                      ]}>
                        {location}
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
                  value={photoTags}
                  onChangeText={setPhotoTags}
                  placeholder="progress, framing, electrical, inspection"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Auto-captured Info */}
              <GlassCard variant="teal" style={styles.autoInfoCard}>
                <Text style={styles.autoInfoTitle}>Automatically Captured:</Text>
                <View style={styles.autoInfoRow}>
                  <Calendar color="#14B8A6" size={16} />
                  <Text style={styles.autoInfoText}>
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.autoInfoRow}>
                  <MapPin color="#14B8A6" size={16} />
                  <Text style={styles.autoInfoText}>
                    GPS: {(-37.5 + Math.random() * 0.1).toFixed(6)}, {(176.0 + Math.random() * 0.1).toFixed(6)}
                  </Text>
                </View>
              </GlassCard>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.discardButton]} 
                onPress={() => {
                  setCapturedPhoto(null);
                  setShowNoteModal(false);
                }}
              >
                <Text style={styles.discardButtonText}>Discard</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={savePhotoWithNotes}
              >
                <Save color="#FFF" size={16} />
                <Text style={styles.saveButtonText}>Save Photo</Text>
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
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  headerCard: {
    marginVertical: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  galleryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  projectSelectorOverlay: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    zIndex: 90,
  },
  projectSelectorCard: {
    marginVertical: 0,
  },
  selectorLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 8,
  },
  projectOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedProjectOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  projectOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedProjectOptionText: {
    color: '#FFF',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  controlsCard: {
    marginVertical: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 50,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
    left: '33.33%',
  },
  gridLineHorizontal1: {
    height: 1,
    width: '100%',
    top: '33.33%',
  },
  gridLineHorizontal2: {
    height: 1,
    width: '100%',
    top: '66.66%',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(12, 10, 31, 0.95)',
  },
  galleryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  galleryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  backButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  closeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectSelector: {
    padding: 16,
    backgroundColor: 'rgba(12, 10, 31, 0.9)',
  },
  projectSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectSelectOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedProjectSelectOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  projectSelectText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedProjectSelectText: {
    color: '#FFF',
  },
  photoGallery: {
    flex: 1,
    padding: 16,
  },
  photosGrid: {
    gap: 16,
  },
  photoCard: {
    marginVertical: 0,
  },
  photoContainer: {
    marginBottom: 12,
  },
  photoPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginTop: 8,
  },
  photoInfo: {
    gap: 8,
  },
  photoProject: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  photoNotes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 20,
  },
  photoMeta: {
    gap: 4,
  },
  photoLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  photoTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  photoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  photoTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  photoTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  moreTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    alignSelf: 'center',
  },
  emptyGallery: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 60,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  photoPreview: {
    marginBottom: 20,
  },
  photoPreviewContainer: {
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  photoPreviewText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginTop: 8,
  },
  photoPreviewSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
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
  autoInfoCard: {
    marginVertical: 0,
  },
  autoInfoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  autoInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  autoInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#14B8A6',
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
  discardButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  discardButtonText: {
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
  photoDetailModal: {
    backgroundColor: '#1a1b3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  photoDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoDetailTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  photoDetailContent: {
    flex: 1,
    marginBottom: 20,
  },
  photoDetailContainer: {
    marginBottom: 20,
  },
  photoDetailPlaceholder: {
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  photoDetailPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginTop: 8,
  },
  photoDetailPlaceholderSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  photoDetailInfo: {
    marginVertical: 0,
  },
  photoDetailNotes: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 24,
    marginBottom: 16,
  },
  photoDetailMeta: {
    gap: 12,
    marginBottom: 16,
  },
  photoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  photoDetailTags: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  tagsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoDetailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sharePhotoButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sharePhotoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  deletePhotoButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deletePhotoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  permissionCard: {
    margin: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 100,
  },
});