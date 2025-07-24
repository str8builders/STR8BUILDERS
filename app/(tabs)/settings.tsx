import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { User, Building, DollarSign, Bell, Shield, Smartphone, CircleHelp as HelpCircle, Info, ChevronRight, BookOpen, FileText } from 'lucide-react-native';

export default function Settings() {
  const userInfo = {
    name: 'C.SAMU',
    company: 'STR8 BUILD',
    email: 'c.samu@str8build.co.nz',
    phone: '+64 27 123 4567',
    hourlyRate: 85,
    location: 'Bay of Plenty, New Zealand',
  };

  const settingsGroups = [
    {
      title: 'Quick Access',
      items: [
        { icon: <DollarSign color="#10B981" size={20} />, label: 'Finance & Invoicing', value: 'Manage' },
        { icon: <BookOpen color="#3B82F6" size={20} />, label: 'Resources Library', value: 'Browse' },
        { icon: <FileText color="#06B6D4" size={20} />, label: 'Reports & Analytics', value: 'View' },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { icon: <User color="#3B82F6" size={20} />, label: 'Profile Information', value: userInfo.name },
        { icon: <Building color="#14B8A6" size={20} />, label: 'Company Details', value: userInfo.company },
        { icon: <DollarSign color="#06B6D4" size={20} />, label: 'Hourly Rate', value: `$${userInfo.hourlyRate}/hr` },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        { icon: <Bell color="#F59E0B" size={20} />, label: 'Notifications', value: 'Enabled' },
        { icon: <Shield color="#EF4444" size={20} />, label: 'Privacy & Security', value: 'Secure' },
        { icon: <Smartphone color="#8B5CF6" size={20} />, label: 'App Settings', value: 'Configured' },
        { icon: <HelpCircle color="#10B981" size={20} />, label: 'Help & Support', value: 'Get Help' },
        { icon: <Info color="#94A3B8" size={20} />, label: 'About STR8 BUILD', value: 'v3.4' },
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
                <Pressable key={itemIndex} style={styles.settingsItem}>
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
        <Pressable style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
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
});