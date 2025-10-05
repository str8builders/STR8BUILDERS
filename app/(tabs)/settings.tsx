import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { User, Building, DollarSign, Bell, Shield, Smartphone, CircleHelp as HelpCircle, Info, ChevronRight, BookOpen, FileText, X, Edit, Check } from 'lucide-react-native';

type ModalType = 'profile' | 'company' | 'rate' | 'finance' | 'resources' | 'reports' | null;

export default function Settings() {
  const [userInfo, setUserInfo] = useState({
    name: 'C.SAMU',
    company: 'STR8 BUILD',
    email: 'c.samu@str8build.co.nz',
    phone: '+64 27 123 4567',
    hourlyRate: 85,
    location: 'Bay of Plenty, New Zealand',
    abn: '123-456-789',
    address: '123 Construction St, Tauranga',
    bankAccount: 'ANZ 12-3456-7890123-00',
  });

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editForm, setEditForm] = useState({ ...userInfo });

  const handleSaveProfile = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    setUserInfo(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
    }));
    setActiveModal(null);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSaveCompany = () => {
    if (!editForm.company.trim()) {
      Alert.alert('Error', 'Company name is required');
      return;
    }
    setUserInfo(prev => ({
      ...prev,
      company: editForm.company,
      abn: editForm.abn,
      address: editForm.address,
      bankAccount: editForm.bankAccount,
    }));
    setActiveModal(null);
    Alert.alert('Success', 'Company details updated successfully!');
  };

  const handleSaveRate = () => {
    const rate = parseFloat(editForm.hourlyRate.toString());
    if (isNaN(rate) || rate <= 0) {
      Alert.alert('Error', 'Please enter a valid hourly rate');
      return;
    }
    setUserInfo(prev => ({
      ...prev,
      hourlyRate: rate,
    }));
    setActiveModal(null);
    Alert.alert('Success', 'Hourly rate updated successfully!');
  };

  const openModal = (type: ModalType) => {
    setEditForm({ ...userInfo });
    setActiveModal(type);
  };

  const settingsGroups = [
    {
      title: 'Quick Access',
      items: [
        {
          icon: <DollarSign color="#10B981" size={20} />,
          label: 'Finance & Invoicing',
          value: 'Manage',
          action: () => openModal('finance')
        },
        {
          icon: <BookOpen color="#3B82F6" size={20} />,
          label: 'Resources Library',
          value: 'Browse',
          action: () => openModal('resources')
        },
        {
          icon: <FileText color="#06B6D4" size={20} />,
          label: 'Reports & Analytics',
          value: 'View',
          action: () => openModal('reports')
        },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        {
          icon: <User color="#3B82F6" size={20} />,
          label: 'Profile Information',
          value: userInfo.name,
          action: () => openModal('profile')
        },
        {
          icon: <Building color="#14B8A6" size={20} />,
          label: 'Company Details',
          value: userInfo.company,
          action: () => openModal('company')
        },
        {
          icon: <DollarSign color="#06B6D4" size={20} />,
          label: 'Hourly Rate',
          value: `$${userInfo.hourlyRate}/hr`,
          action: () => openModal('rate')
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          icon: <Bell color="#F59E0B" size={20} />,
          label: 'Notifications',
          value: 'Enabled',
          action: () => Alert.alert('Notifications', 'Notification settings coming soon!')
        },
        {
          icon: <Shield color="#EF4444" size={20} />,
          label: 'Privacy & Security',
          value: 'Secure',
          action: () => Alert.alert('Privacy & Security', 'Security settings coming soon!')
        },
        {
          icon: <Smartphone color="#8B5CF6" size={20} />,
          label: 'App Settings',
          value: 'Configured',
          action: () => Alert.alert('App Settings', 'General app settings coming soon!')
        },
        {
          icon: <HelpCircle color="#10B981" size={20} />,
          label: 'Help & Support',
          value: 'Get Help',
          action: () => Alert.alert('Help & Support', 'Visit our support page for assistance or email support@str8build.co.nz')
        },
        {
          icon: <Info color="#94A3B8" size={20} />,
          label: 'About STR8 BUILD',
          value: 'v3.4',
          action: () => Alert.alert('STR8 BUILD', 'Version 3.4.0\n\nThe ultimate construction app for New Zealand professionals.\n\n© 2025 STR8 BUILD\nOwner: C.SAMU')
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Profile Card */}
        <GlassCard variant="electric" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User color="#3B82F6" size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userCompany}>{userInfo.company}</Text>
              <Text style={styles.userLocation}>{userInfo.location}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{userInfo.email}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Phone:</Text>
              <Text style={styles.profileValue}>{userInfo.phone}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Rate:</Text>
              <Text style={styles.profileValue}>${userInfo.hourlyRate}/hour</Text>
            </View>
          </View>
        </GlassCard>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <GlassCard key={groupIndex} variant="default" style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>

            <View style={styles.settingsItems}>
              {group.items.map((item, itemIndex) => (
                <Pressable key={itemIndex} style={styles.settingsItem} onPress={item.action}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemIcon}>
                      {item.icon}
                    </View>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemValue}>{item.value}</Text>
                    <ChevronRight color="#94A3B8" size={16} />
                  </View>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        ))}

        {/* App Info */}
        <GlassCard variant="cyan" style={styles.appInfoCard}>
          <View style={styles.appInfoHeader}>
            <Text style={styles.appInfoTitle}>STR8 BUILD</Text>
            <Text style={styles.appInfoVersion}>Version 3.4</Text>
          </View>

          <Text style={styles.appInfoDescription}>
            The ultimate construction app for New Zealand professionals. Built with cutting-edge technology for the modern construction industry.
          </Text>

          <View style={styles.appInfoFooter}>
            <Text style={styles.appInfoOwner}>Owner: C.SAMU</Text>
            <Text style={styles.appInfoCopyright}>© 2025 STR8 BUILD</Text>
          </View>
        </GlassCard>

        {/* Sign Out Button */}
        <Pressable
          style={styles.signOutButton}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed Out', 'You have been signed out successfully.') }
          ])}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      {/* Profile Information Modal */}
      <Modal
        visible={activeModal === 'profile'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Information</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                  placeholder="Your name"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                  placeholder="email@example.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
                  placeholder="+64 27 123 4567"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.location}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                  placeholder="City, Region"
                  placeholderTextColor="#64748B"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Company Details Modal */}
      <Modal
        visible={activeModal === 'company'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Company Details</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.company}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, company: text }))}
                  placeholder="Your company name"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Number (ABN/IRD)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.abn}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, abn: text }))}
                  placeholder="123-456-789"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, address: text }))}
                  placeholder="Street address"
                  placeholderTextColor="#64748B"
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bank Account</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.bankAccount}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, bankAccount: text }))}
                  placeholder="XX-XXXX-XXXXXXX-XX"
                  placeholderTextColor="#64748B"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveCompany}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hourly Rate Modal */}
      <Modal
        visible={activeModal === 'rate'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Hourly Rate</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hourly Rate (NZD)</Text>
                <TextInput
                  style={[styles.textInput, styles.rateInput]}
                  value={editForm.hourlyRate.toString()}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, hourlyRate: text }))}
                  placeholder="85"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
                <Text style={styles.inputHint}>
                  This rate will be used as the default for new projects and time tracking.
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveRate}
              >
                <Text style={styles.saveButtonText}>Save Rate</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Finance & Invoicing Modal */}
      <Modal
        visible={activeModal === 'finance'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Finance & Invoicing</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.featureSection}>
                <DollarSign color="#10B981" size={40} />
                <Text style={styles.featureTitle}>Invoice Management</Text>
                <Text style={styles.featureDescription}>
                  Create, send, and track invoices for your projects. Manage payments and financial records all in one place.
                </Text>
                <Text style={styles.featureComingSoon}>Coming Soon</Text>
              </View>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Check color="#10B981" size={20} />
                  <Text style={styles.featureItemText}>Create professional invoices</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#10B981" size={20} />
                  <Text style={styles.featureItemText}>Track payments and overdue invoices</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#10B981" size={20} />
                  <Text style={styles.featureItemText}>Generate financial reports</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#10B981" size={20} />
                  <Text style={styles.featureItemText}>Export to PDF and email</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.saveButton, { flex: 1 }]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.saveButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resources Library Modal */}
      <Modal
        visible={activeModal === 'resources'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resources Library</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.featureSection}>
                <BookOpen color="#3B82F6" size={40} />
                <Text style={styles.featureTitle}>Knowledge Base</Text>
                <Text style={styles.featureDescription}>
                  Access construction guides, building codes, safety procedures, and best practices for New Zealand construction.
                </Text>
                <Text style={styles.featureComingSoon}>Coming Soon</Text>
              </View>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Check color="#3B82F6" size={20} />
                  <Text style={styles.featureItemText}>Building codes and regulations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#3B82F6" size={20} />
                  <Text style={styles.featureItemText}>Safety guidelines and checklists</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#3B82F6" size={20} />
                  <Text style={styles.featureItemText}>Construction templates</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#3B82F6" size={20} />
                  <Text style={styles.featureItemText}>Video tutorials</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.saveButton, { flex: 1 }]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.saveButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reports & Analytics Modal */}
      <Modal
        visible={activeModal === 'reports'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reports & Analytics</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.featureSection}>
                <FileText color="#06B6D4" size={40} />
                <Text style={styles.featureTitle}>Business Intelligence</Text>
                <Text style={styles.featureDescription}>
                  View detailed analytics on your projects, time tracking, revenue, and business performance metrics.
                </Text>
                <Text style={styles.featureComingSoon}>Coming Soon</Text>
              </View>

              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Check color="#06B6D4" size={20} />
                  <Text style={styles.featureItemText}>Project profitability reports</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#06B6D4" size={20} />
                  <Text style={styles.featureItemText}>Time tracking analytics</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#06B6D4" size={20} />
                  <Text style={styles.featureItemText}>Client revenue breakdown</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check color="#06B6D4" size={20} />
                  <Text style={styles.featureItemText}>Export to Excel/PDF</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.saveButton, { flex: 1 }]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.saveButtonText}>Close</Text>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  profileCard: {
    marginVertical: 0,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  userCompany: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginTop: 2,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  profileDetails: {
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  profileValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  settingsGroup: {
    marginVertical: 0,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  settingsItems: {
    gap: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  appInfoCard: {
    marginVertical: 0,
    marginBottom: 24,
  },
  appInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appInfoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  appInfoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  appInfoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  appInfoOwner: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
  },
  appInfoCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  signOutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    marginBottom: 24,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
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
  rateInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 16,
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
  featureSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureComingSoon: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    flex: 1,
  },
});
