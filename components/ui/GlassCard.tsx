import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'electric' | 'teal' | 'purple' | 'default';
  style?: ViewStyle;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  style,
  intensity = 20,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'cyan':
        return ['rgba(6, 182, 212, 0.1)', 'rgba(6, 182, 212, 0.05)'];
      case 'electric':
        return ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)'];
      case 'teal':
        return ['rgba(20, 184, 166, 0.1)', 'rgba(20, 184, 166, 0.05)'];
      case 'purple':
        return ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)'];
      default:
        return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'cyan':
        return '#06B6D4';
      case 'electric':
        return '#3B82F6';
      case 'teal':
        return '#14B8A6';
      case 'purple':
        return '#8B5CF6';
      default:
        return '#64748B';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradient}
        >
          <View style={[styles.border, { borderColor: getBorderColor() }]}>
            {children}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  blur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  border: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
});