import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { JobTimer } from '@/components/dashboard/JobTimer';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { WeatherImpactWidget } from '@/components/dashboard/WeatherImpactWidget';
import { User, ChevronDown, Settings, Camera, LogOut, CreditCard as Edit3, Save, X } from 'lucide-react-native';
import { useState } from 'react';

export default function Dashboard() {
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'C.SAMU',
    company: 'STR8 BUILD',
    email: 'c.samu@str8build.co.nz',
    phone: '+64 27 123 4567',
    location: 'Bay of Plenty, New Zealand',
    avatar: null as string | null,
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setEditingProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangeAvatar = () => {
    // In a real app, this would open image picker
    Alert.alert(
      'Change Avatar',
      'Avatar change functionality would open camera/gallery here',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // In a real app, this would clear session and navigate to login
          console.log('Sign out');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable 
              style={styles.avatarContainer}
              onPress={() => setShowAvatarDropdown(!showAvatarDropdown)}
            >
              <View style={styles.avatar}>
                {userProfile.avatar ? (
                  <Text style={styles.avatarText}>
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                ) : (
                  <User color="#3B82F6" size={24} />
                )}
              </View>
              <ChevronDown 
                color="#94A3B8" 
                size={16} 
                style={[
                  styles.dropdownIcon,
                  showAvatarDropdown && styles.dropdownIconRotated
                ]} 
              />
            </Pressable>
            <View>
              <Text style={styles.title}>STR8 BUILD</Text>
              <Text style={styles.subtitle}>Welcome back, {userProfile.name}</Text>
            </View>
          </View>
        </View>
        
        {/* Avatar Dropdown */}
        {showAvatarDropdown && (
          <View style={styles.dropdownContainer}>
            <GlassCard variant="electric" style={styles.dropdown}>
              <View style={styles.dropdownHeader}>
                <View style={styles.dropdownAvatar}>
                  {userProfile.avatar ? (
                    <Text style={styles.dropdownAvatarText}>
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  ) : (
                    <User color="#3B82F6" size={20} />
                  )}
                </View>
                <View style={styles.dropdownUserInfo}>
                  <Text style={styles.dropdownName}>{userProfile.name}</Text>
                  <Text style={styles.dropdownEmail}>{userProfile.email}</Text>
                </View>
              </View>
              
              <View style={styles.dropdownDivider} />
              
              <View style={styles.dropdownMenu}>
                <Pressable 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowAvatarDropdown(false);
                    setTempProfile(userProfile);
                    setShowProfileModal(true);
                  }}
                >
                  <Settings color="#94A3B8" size={18} />
                  <Text style={styles.dropdownItemText}>Profile Settings</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowAvatarDropdown(false);
                    handleChangeAvatar();
                  }}
                >
                  <Camera color="#94A3B8" size={18} />
                  <Text style={styles.dropdownItemText}>Change Avatar</Text>
                </Pressable>
                
                <View style={styles.dropdownDivider} />
                
                <Pressable 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowAvatarDropdown(false);
                    handleSignOut();
                  }}
                >
                  <LogOut color="#EF4444" size={18} />
                  <Text style={[styles.dropdownItemText, { color: '#EF4444' }]}>Sign Out</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        )}
        
        <JobTimer />
        
        <QuickStats />
        
        <WeatherImpactWidget />
        <QuickActions />
        <ActiveProjects />
        <UpcomingDeadlines />
        <RecentActivity />
        
        {/* Profile Settings Modal */}
        <Modal
          visible={showProfileModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowProfileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profile Settings</Text>
                <Pressable onPress={() => setShowProfileModal(false)}>
                  <X color="#94A3B8" size={24} />
                </Pressable>
              </View>
              
              <ScrollView style={styles.profileForm}>
                <View style={styles.profileAvatarSection}>
                  <View style={styles.profileAvatarContainer}>
                    <View style={styles.profileAvatar}>
                      {userProfile.avatar ? (
                        <Text style={styles.profileAvatarText}>
                          {userProfile.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      ) : (
                        <User color="#3B82F6" size={32} />
                      )}
                    </View>
                    <Pressable style={styles.changeAvatarButton} onPress={handleChangeAvatar}>
                      <Camera color="#FFF" size={16} />
                    </Pressable>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.profileInput}
                      value={tempProfile.name}
                      onChangeText={(text) => setTempProfile(prev => ({ ...prev, name: text }))}
                      placeholder="Your full name"
                      placeholderTextColor="#64748B"
                      editable={editingProfile}
                    />
                    {!editingProfile && (
                      <Pressable onPress={() => setEditingProfile(true)}>
                        <Edit3 color="#94A3B8" size={16} />
                      </Pressable>
                    )}
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Company</Text>
                  <TextInput
                    style={styles.profileInput}
                    value={tempProfile.company}
                    onChangeText={(text) => setTempProfile(prev => ({ ...prev, company: text }))}
                    placeholder="Company name"
                    placeholderTextColor="#64748B"
                    editable={editingProfile}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.profileInput}
                    value={tempProfile.email}
                    onChangeText={(text) => setTempProfile(prev => ({ ...prev, email: text }))}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#64748B"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={editingProfile}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.profileInput}
                    value={tempProfile.phone}
                    onChangeText={(text) => setTempProfile(prev => ({ ...prev, phone: text }))}
                    placeholder="+64 27 123 4567"
                    placeholderTextColor="#64748B"
                    keyboardType="phone-pad"
                    editable={editingProfile}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={styles.profileInput}
                    value={tempProfile.location}
                    onChangeText={(text) => setTempProfile(prev => ({ ...prev, location: text }))}
                    placeholder="Your location"
                    placeholderTextColor="#64748B"
                    editable={editingProfile}
                  />
                </View>
              </ScrollView>
              
              <View style={styles.modalActions}>
                {editingProfile ? (
                  <>
                    <Pressable 
                      style={[styles.modalButton, styles.cancelButton]} 
                      onPress={() => {
                        setTempProfile(userProfile);
                        setEditingProfile(false);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.modalButton, styles.saveButton]} 
                      onPress={handleSaveProfile}
                    >
                      <Save color="#FFF" size={16} />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable 
                    style={[styles.modalButton, styles.editButton]} 
                    onPress={() => setEditingProfile(true)}
                  >
                    <Edit3 color="#FFF" size={16} />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
});