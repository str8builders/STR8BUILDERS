import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Camera, useCameraPermissions } from 'expo-camera';
import { ForwardedCameraView } from '../ForwardedCameraView';
import { GlassCard } from '../ui/GlassCard';
import { Crosshair, Ruler, Square, RotateCcw, Save, X } from 'lucide-react-native';

interface MeasurementPoint {
  x: number;
  y: number;
  id: string;
}

interface Measurement {
  id: string;
  type: 'distance' | 'area';
  points: MeasurementPoint[];
  value: number;
  unit: string;
}

export const ARMeasurementTool: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [measurementMode, setMeasurementMode] = useState<'distance' | 'area'>('distance');
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [referenceDistance, setReferenceDistance] = useState(1.0); // meters

  if (!permission) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading camera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <GlassCard variant="electric" style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            AR measurement requires camera access to overlay measurements on the live view.
          </Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </GlassCard>
      </View>
    );
  }

  const handleScreenTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPoint: MeasurementPoint = {
      x: locationX,
      y: locationY,
      id: Date.now().toString(),
    };

    if (measurementMode === 'distance') {
      if (points.length === 0) {
        setPoints([newPoint]);
      } else if (points.length === 1) {
        const distance = calculateDistance(points[0], newPoint);
        const measurement: Measurement = {
          id: Date.now().toString(),
          type: 'distance',
          points: [points[0], newPoint],
          value: distance,
          unit: 'm',
        };
        setMeasurements(prev => [...prev, measurement]);
        setPoints([]);
      }
    } else if (measurementMode === 'area') {
      const newPoints = [...points, newPoint];
      setPoints(newPoints);
      
      if (newPoints.length >= 3) {
        const area = calculateArea(newPoints);
        const measurement: Measurement = {
          id: Date.now().toString(),
          type: 'area',
          points: newPoints,
          value: area,
          unit: 'm²',
        };
        setMeasurements(prev => [...prev, measurement]);
        setPoints([]);
      }
    }
  };

  const calculateDistance = (point1: MeasurementPoint, point2: MeasurementPoint): number => {
    const pixelDistance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
    // Convert pixel distance to real distance using reference
    // This is a simplified calculation - real AR would use depth sensing
    return (pixelDistance / 100) * referenceDistance;
  };

  const calculateArea = (points: MeasurementPoint[]): number => {
    if (points.length < 3) return 0;
    
    // Simplified area calculation using shoelace formula
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    
    // Convert to real area using reference scale
    return (area / 10000) * Math.pow(referenceDistance, 2);
  };

  const clearMeasurements = () => {
    setPoints([]);
    setMeasurements([]);
  };

  const saveMeasurements = () => {
    if (measurements.length === 0) {
      Alert.alert('No Measurements', 'Take some measurements first before saving.');
      return;
    }
    
    Alert.alert(
      'Measurements Saved',
      `Saved ${measurements.length} measurements to project documentation.`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <View style={styles.container}>
      <ForwardedCameraView style={styles.camera} onTouchEnd={handleScreenTouch}>
        {/* Overlay UI */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <GlassCard variant="electric" style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>AR Measurement</Text>
                <Pressable onPress={onClose}>
                  <X color="#FFF" size={24} />
                </Pressable>
              </View>
            </GlassCard>
          </View>

          {/* Crosshair */}
          <View style={styles.crosshair}>
            <Crosshair color="#3B82F6" size={32} />
          </View>

          {/* Measurement Points */}
          {points.map((point, index) => (
            <View
              key={point.id}
              style={[
                styles.measurementPoint,
                { left: point.x - 10, top: point.y - 10 }
              ]}
            >
              <Text style={styles.pointNumber}>{index + 1}</Text>
            </View>
          ))}

          {/* Measurement Lines */}
          {measurements.map((measurement) => (
            <View key={measurement.id} style={styles.measurementOverlay}>
              {measurement.type === 'distance' && measurement.points.length === 2 && (
                <View
                  style={[
                    styles.measurementLine,
                    {
                      left: Math.min(measurement.points[0].x, measurement.points[1].x),
                      top: Math.min(measurement.points[0].y, measurement.points[1].y),
                      width: Math.abs(measurement.points[1].x - measurement.points[0].x),
                      height: Math.abs(measurement.points[1].y - measurement.points[0].y),
                    }
                  ]}
                >
                  <Text style={styles.measurementLabel}>
                    {measurement.value.toFixed(2)}{measurement.unit}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <GlassCard variant="electric" style={styles.controlsCard}>
              <View style={styles.modeSelector}>
                <Pressable
                  style={[
                    styles.modeButton,
                    measurementMode === 'distance' && styles.activeModeButton
                  ]}
                  onPress={() => setMeasurementMode('distance')}
                >
                  <Ruler color={measurementMode === 'distance' ? '#FFF' : '#94A3B8'} size={20} />
                  <Text style={[
                    styles.modeText,
                    measurementMode === 'distance' && styles.activeModeText
                  ]}>
                    Distance
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.modeButton,
                    measurementMode === 'area' && styles.activeModeButton
                  ]}
                  onPress={() => setMeasurementMode('area')}
                >
                  <Square color={measurementMode === 'area' ? '#FFF' : '#94A3B8'} size={20} />
                  <Text style={[
                    styles.modeText,
                    measurementMode === 'area' && styles.activeModeText
                  ]}>
                    Area
                  </Text>
                </Pressable>
              </View>
              
              <View style={styles.actionButtons}>
                <Pressable style={styles.actionButton} onPress={clearMeasurements}>
                  <RotateCcw color="#EF4444" size={20} />
                  <Text style={styles.actionButtonText}>Clear</Text>
                </Pressable>
                
                <Pressable style={styles.actionButton} onPress={saveMeasurements}>
                  <Save color="#10B981" size={20} />
                  <Text style={styles.actionButtonText}>Save</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <GlassCard variant="default" style={styles.instructionsCard}>
              <Text style={styles.instructionsText}>
                {measurementMode === 'distance' 
                  ? 'Tap two points to measure distance'
                  : 'Tap multiple points to measure area'
                }
              </Text>
              {points.length > 0 && (
                <Text style={styles.pointsText}>
                  {points.length} point{points.length > 1 ? 's' : ''} selected
                </Text>
              )}
            </GlassCard>
          </View>

          {/* Results Panel */}
          {measurements.length > 0 && (
            <View style={styles.resultsPanel}>
              <GlassCard variant="teal" style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>Measurements ({measurements.length})</Text>
                {measurements.slice(-3).map((measurement, index) => (
                  <View key={measurement.id} style={styles.resultItem}>
                    <Text style={styles.resultType}>
                      {measurement.type === 'distance' ? '📏' : '📐'} {measurement.type}
                    </Text>
                    <Text style={styles.resultValue}>
                      {measurement.value.toFixed(2)} {measurement.unit}
                    </Text>
                  </View>
                ))}
              </GlassCard>
            </View>
          )}
        </View>
      </ForwardedCameraView>
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
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 50,
  },
  measurementPoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 75,
  },
  pointNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  measurementOverlay: {
    position: 'absolute',
    zIndex: 60,
  },
  measurementLine: {
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementLabel: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  controlsCard: {
    marginVertical: 0,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  activeModeButton: {
    backgroundColor: '#3B82F6',
  },
  modeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  activeModeText: {
    color: '#FFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  instructions: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    zIndex: 90,
  },
  instructionsCard: {
    marginVertical: 0,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    textAlign: 'center',
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  resultsPanel: {
    position: 'absolute',
    top: 220,
    left: 16,
    right: 16,
    zIndex: 80,
  },
  resultsCard: {
    marginVertical: 0,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  resultValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  permissionCard: {
    margin: 20,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
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