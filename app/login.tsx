import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { router } from 'expo-router';
import { Lock, User } from 'lucide-react-native';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    // Simulate login with the credentials from the guide
    if (username === 'str8' && password === 'omokoroa2023') {
      // Store user session (in a real app, this would be more secure)
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>STR8 BUILD</Text>
          <Text style={styles.subtitle}>Construction Management System</Text>
        </View>
        
        <GlassCard variant="electric" style={styles.loginCard}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>Sign In</Text>
            <Text style={styles.loginSubtitle}>Access your construction dashboard</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <User color="#94A3B8" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#64748B"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Lock color="#94A3B8" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>
          </View>
          
          <Pressable 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </Pressable>
          
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Username: str8</Text>
            <Text style={styles.demoText}>Password: omokoroa2023</Text>
          </View>
        </GlassCard>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            STR8 BUILD v3.4 • Built for NZ Construction Professionals
          </Text>
          <Text style={styles.footerOwner}>Owner: C.SAMU</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  loginCard: {
    marginVertical: 0,
    marginBottom: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    marginLeft: 12,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  demoCredentials: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  footerOwner: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
  },
});