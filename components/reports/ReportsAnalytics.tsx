import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, DollarSign, Clock, Users, Calendar, Download, BarChart3, PieChart } from 'lucide-react-native';

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    revenue: {
      current: 45250,
      previous: 38900,
      change: 16.3,
    },
    hoursWorked: {
      current: 182,
      previous: 165,
      change: 10.3,
    },
    activeProjects: {
      current: 8,
      previous: 6,
      change: 33.3,
    },
    avgHourlyRate: {
      current: 85,
      previous: 82,
      change: 3.7,
    },
  };

  const projectPerformance = [
    { name: 'Kitchen Renovation', revenue: 12500, hours: 147, profit: 58 },
    { name: 'Office Fit-out', revenue: 28750, hours: 338, profit: 62 },
    { name: 'Bathroom Remodel', revenue: 8900, hours: 105, profit: 52 },
    { name: 'Deck Construction', revenue: 15200, hours: 179, profit: 55 },
  ];

  const clientRevenue = [
    { name: 'Auckland Properties Ltd', amount: 32500, percentage: 35 },
    { name: 'Bay Commercial', amount: 28750, percentage: 31 },
    { name: 'Residential Build Co', amount: 18900, percentage: 20 },
    { name: 'Others', amount: 12850, percentage: 14 },
  ];

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reports & Analytics</Text>
            <Text style={styles.subtitle}>Business performance insights</Text>
          </View>
          <Pressable style={styles.exportButton}>
            <Download color="#FFF" size={20} />
          </Pressable>
        </View>

        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <Pressable
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <DollarSign color="#10B981" size={24} />
              </View>
              <View style={[
                styles.changeIndicator,
                stats.revenue.change >= 0 ? styles.changePositive : styles.changeNegative
              ]}>
                <TrendingUp size={12} color={stats.revenue.change >= 0 ? '#10B981' : '#EF4444'} />
                <Text style={styles.changeText}>{stats.revenue.change}%</Text>
              </View>
            </View>
            <Text style={styles.statValue}>${stats.revenue.current.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statCompare}>
              vs ${stats.revenue.previous.toLocaleString()} last period
            </Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Clock color="#3B82F6" size={24} />
              </View>
              <View style={[
                styles.changeIndicator,
                stats.hoursWorked.change >= 0 ? styles.changePositive : styles.changeNegative
              ]}>
                <TrendingUp size={12} color={stats.hoursWorked.change >= 0 ? '#10B981' : '#EF4444'} />
                <Text style={styles.changeText}>{stats.hoursWorked.change}%</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stats.hoursWorked.current}h</Text>
            <Text style={styles.statLabel}>Hours Worked</Text>
            <Text style={styles.statCompare}>
              vs {stats.hoursWorked.previous}h last period
            </Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Calendar color="#F59E0B" size={24} />
              </View>
              <View style={[
                styles.changeIndicator,
                stats.activeProjects.change >= 0 ? styles.changePositive : styles.changeNegative
              ]}>
                <TrendingUp size={12} color={stats.activeProjects.change >= 0 ? '#10B981' : '#EF4444'} />
                <Text style={styles.changeText}>{stats.activeProjects.change}%</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stats.activeProjects.current}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
            <Text style={styles.statCompare}>
              vs {stats.activeProjects.previous} last period
            </Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
                <DollarSign color="#06B6D4" size={24} />
              </View>
              <View style={[
                styles.changeIndicator,
                stats.avgHourlyRate.change >= 0 ? styles.changePositive : styles.changeNegative
              ]}>
                <TrendingUp size={12} color={stats.avgHourlyRate.change >= 0 ? '#10B981' : '#EF4444'} />
                <Text style={styles.changeText}>{stats.avgHourlyRate.change}%</Text>
              </View>
            </View>
            <Text style={styles.statValue}>${stats.avgHourlyRate.current}</Text>
            <Text style={styles.statLabel}>Avg Hourly Rate</Text>
            <Text style={styles.statCompare}>
              vs ${stats.avgHourlyRate.previous} last period
            </Text>
          </GlassCard>
        </View>

        <GlassCard variant="default" style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <BarChart3 color="#3B82F6" size={24} />
            <Text style={styles.reportTitle}>Project Performance</Text>
          </View>

          {projectPerformance.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={styles.projectStats}>
                  <Text style={styles.projectStat}>${project.revenue.toLocaleString()}</Text>
                  <Text style={styles.projectStatLabel}>revenue</Text>
                  <Text style={styles.projectStat}> • {project.hours}h</Text>
                  <Text style={styles.projectStatLabel}>worked</Text>
                </View>
              </View>
              <View style={styles.profitBadge}>
                <Text style={styles.profitText}>{project.profit}%</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <GlassCard variant="default" style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <PieChart color="#10B981" size={24} />
            <Text style={styles.reportTitle}>Client Revenue Breakdown</Text>
          </View>

          {clientRevenue.map((client, index) => (
            <View key={index} style={styles.clientItem}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientAmount}>${client.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${client.percentage}%` }]} />
              </View>
              <Text style={styles.percentageText}>{client.percentage}%</Text>
            </View>
          ))}
        </GlassCard>

        <GlassCard variant="cyan" style={styles.exportCard}>
          <Text style={styles.exportTitle}>Export Reports</Text>
          <Text style={styles.exportText}>
            Download detailed reports in PDF or Excel format for accounting and record-keeping.
          </Text>
          <View style={styles.exportButtons}>
            <Pressable style={styles.exportBtn}>
              <Download color="#06B6D4" size={20} />
              <Text style={styles.exportBtnText}>Export PDF</Text>
            </Pressable>
            <Pressable style={styles.exportBtn}>
              <Download color="#06B6D4" size={20} />
              <Text style={styles.exportBtnText}>Export Excel</Text>
            </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  exportButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  periodButtonTextActive: {
    color: '#3B82F6',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changePositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  changeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statCompare: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  reportCard: {
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 6,
  },
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectStat: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  projectStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginLeft: 4,
  },
  profitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  profitText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  clientItem: {
    marginBottom: 20,
  },
  clientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  clientAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  exportCard: {
    padding: 20,
    marginBottom: 24,
  },
  exportTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
    marginBottom: 8,
  },
  exportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#06B6D4',
  },
  exportBtnText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
  },
});
