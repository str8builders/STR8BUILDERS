import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { Download, X, Smartphone } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const hasSeenPrompt = localStorage.getItem('installPromptSeen');
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (!hasSeenPrompt && !isInstalled) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setCanInstall(true);

        setTimeout(() => {
          setShowPrompt(true);
          scale.value = withSequence(
            withTiming(1.1, { duration: 200, easing: Easing.out(Easing.cubic) }),
            withTiming(1, { duration: 100 })
          );
          opacity.value = withTiming(1, { duration: 300 });
        }, 2000);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  useEffect(() => {
    if (showPrompt && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0 && deferredPrompt) {
      handleInstall();
    }
  }, [showPrompt, countdown, deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowPrompt(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    if (Platform.OS === 'web') {
      localStorage.setItem('installPromptSeen', 'true');
    }
  };

  const handleDismiss = () => {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });

    setTimeout(() => {
      setShowPrompt(false);
      if (Platform.OS === 'web') {
        localStorage.setItem('installPromptSeen', 'true');
      }
    }, 200);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!showPrompt || !canInstall) return null;

  return (
    <Modal
      visible={showPrompt}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.promptContainer, animatedStyle]}>
          <GlassCard variant="electric" style={styles.card}>
            <Pressable style={styles.closeButton} onPress={handleDismiss}>
              <X color="#94A3B8" size={20} />
            </Pressable>

            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Smartphone color="#3B82F6" size={40} />
              </View>
            </View>

            <Text style={styles.title}>Install STR8 BUILD</Text>
            <Text style={styles.subtitle}>
              Add to your home screen for quick access
            </Text>

            <View style={styles.features}>
              <View style={styles.feature}>
                <Download color="#10B981" size={16} />
                <Text style={styles.featureText}>Works offline</Text>
              </View>
              <View style={styles.feature}>
                <Download color="#10B981" size={16} />
                <Text style={styles.featureText}>Fast & reliable</Text>
              </View>
              <View style={styles.feature}>
                <Download color="#10B981" size={16} />
                <Text style={styles.featureText}>App-like experience</Text>
              </View>
            </View>

            {countdown > 0 ? (
              <View style={styles.countdownContainer}>
                <View style={styles.countdownCircle}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
                <Text style={styles.autoInstallText}>
                  Auto-installing in {countdown} second{countdown !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.installButton}
                  onPress={handleInstall}
                >
                  <Download color="#FFF" size={20} />
                  <Text style={styles.installButtonText}>Install Now</Text>
                </Pressable>
              </View>
            )}

            <Pressable onPress={handleDismiss}>
              <Text style={styles.laterText}>Maybe later</Text>
            </Pressable>
          </GlassCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promptContainer: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  countdownCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 3,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  autoInstallText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  installButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  laterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
