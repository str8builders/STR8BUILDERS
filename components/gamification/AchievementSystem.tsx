import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Trophy, Target, Flame, TrendingUp, Clock, DollarSign, Star, Award, Zap, CheckCircle } from 'lucide-react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  reward: string;
  category: string;
}

interface Stat {
  label: string;
  value: string;
  icon: JSX.Element;
  color: string;
}

export function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userStats: Stat[] = [
    { label: 'Current Streak', value: '15 days', icon: <Flame color="#F59E0B" size={24} />, color: '#F59E0B' },
    { label: 'Total Hours', value: '487h', icon: <Clock color="#3B82F6" size={24} />, color: '#3B82F6' },
    { label: 'Total Earned', value: '$41,395', icon: <DollarSign color="#10B981" size={24} />, color: '#10B981' },
    { label: 'Level', value: '12', icon: <Star color="#F59E0B" size={24} />, color: '#F59E0B' },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Timer',
      description: 'Log your first hour of work',
      icon: <Clock color="#3B82F6" size={32} />,
      unlocked: true,
      category: 'time',
      reward: '+10 XP',
    },
    {
      id: '2',
      title: 'Century Club',
      description: 'Track 100 hours of work',
      icon: <Trophy color="#F59E0B" size={32} />,
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      category: 'time',
      reward: '+100 XP',
    },
    {
      id: '3',
      title: 'Five Figure Earner',
      description: 'Earn $10,000 in tracked income',
      icon: <DollarSign color="#10B981" size={32} />,
      unlocked: true,
      category: 'money',
      reward: '+50 XP',
    },
    {
      id: '4',
      title: 'Consistent Worker',
      description: 'Log hours for 7 days straight',
      icon: <Flame color="#EF4444" size={32} />,
      unlocked: true,
      category: 'streak',
      reward: '+25 XP',
    },
    {
      id: '5',
      title: 'Project Master',
      description: 'Complete 10 projects',
      icon: <CheckCircle color="#06B6D4" size={32} />,
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      category: 'projects',
      reward: '+75 XP',
    },
    {
      id: '6',
      title: 'Speed Demon',
      description: 'Complete a project ahead of schedule',
      icon: <Zap color="#F59E0B" size={32} />,
      unlocked: true,
      category: 'projects',
      reward: '+50 XP',
    },
    {
      id: '7',
      title: 'Half Century',
      description: 'Earn $50,000 in total revenue',
      icon: <Award color="#10B981" size={32} />,
      unlocked: false,
      progress: 41395,
      maxProgress: 50000,
      category: 'money',
      reward: '+200 XP',
    },
    {
      id: '8',
      title: 'Week Warrior',
      description: 'Track 40+ hours in a single week',
      icon: <Target color="#3B82F6" size={32} />,
      unlocked: true,
      category: 'time',
      reward: '+50 XP',
    },
    {
      id: '9',
      title: 'Photo Pro',
      description: 'Upload 100 project photos',
      icon: <Star color="#06B6D4" size={32} />,
      unlocked: false,
      progress: 63,
      maxProgress: 100,
      category: 'other',
      reward: '+30 XP',
    },
    {
      id: '10',
      title: 'Review Rockstar',
      description: 'Get 10 five-star client reviews',
      icon: <TrendingUp color="#10B981" size={32} />,
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      category: 'other',
      reward: '+100 XP',
    },
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'time', label: 'Time' },
    { key: 'money', label: 'Money' },
    { key: 'streak', label: 'Streak' },
    { key: 'projects', label: 'Projects' },
    { key: 'other', label: 'Other' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedCount} of {totalCount} unlocked ({completionPercent}%)
          </Text>
        </View>

        <GlassCard variant="cyan" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Trophy color="#F59E0B" size={40} />
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Achievement Progress</Text>
              <Text style={styles.progressPercent}>{completionPercent}% Complete</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercent}%` }]} />
          </View>
        </GlassCard>

        <View style={styles.statsGrid}>
          {userStats.map((stat, index) => (
            <GlassCard key={index} variant="default" style={styles.statCard}>
              {stat.icon}
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </GlassCard>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.key}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat.key && styles.categoryChipTextActive
              ]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.achievementsList}>
          {filteredAchievements.map((achievement) => (
            <GlassCard
              key={achievement.id}
              variant="default"
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked
              ]}
            >
              <View style={styles.achievementLeft}>
                <View style={[
                  styles.achievementIcon,
                  achievement.unlocked ? styles.achievementIconUnlocked : styles.achievementIconLocked
                ]}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <View style={styles.achievementProgress}>
                      <View style={styles.achievementProgressBar}>
                        <View style={[
                          styles.achievementProgressFill,
                          { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
                        ]} />
                      </View>
                      <Text style={styles.achievementProgressText}>
                        {achievement.progress} / {achievement.maxProgress}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.achievementRight}>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <CheckCircle color="#10B981" size={20} />
                  </View>
                )}
                <Text style={[
                  styles.achievementReward,
                  !achievement.unlocked && styles.achievementRewardLocked
                ]}>
                  {achievement.reward}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>

        <GlassCard variant="default" style={styles.milestoneCard}>
          <Text style={styles.milestoneTitle}>🎯 Next Milestone</Text>
          <Text style={styles.milestoneDescription}>
            You're 8,605 away from earning the "Half Century" achievement!
          </Text>
          <View style={styles.milestoneProgress}>
            <View style={styles.milestoneProgressBar}>
              <View style={[styles.milestoneProgressFill, { width: '83%' }]} />
            </View>
            <Text style={styles.milestoneProgressText}>$41,395 / $50,000</Text>
          </View>
        </GlassCard>
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
    padding: 16,
  },
  header: {
    marginBottom: 20,
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
  progressCard: {
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
    marginBottom: 4,
  },
  progressPercent: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  categoryChipTextActive: {
    color: '#3B82F6',
  },
  achievementsList: {
    gap: 12,
    marginBottom: 20,
  },
  achievementCard: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 16,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  achievementIconLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#94A3B8',
  },
  achievementDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 8,
  },
  achievementProgress: {
    marginTop: 4,
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  achievementRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  unlockedBadge: {
    marginBottom: 8,
  },
  achievementReward: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  achievementRewardLocked: {
    color: '#64748B',
  },
  milestoneCard: {
    padding: 20,
    marginBottom: 24,
  },
  milestoneTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  milestoneDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  milestoneProgress: {
    marginTop: 8,
  },
  milestoneProgressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  milestoneProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  milestoneProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
});
