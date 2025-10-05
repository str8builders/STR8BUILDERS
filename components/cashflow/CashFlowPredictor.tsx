import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';

interface CashFlowPeriod {
  period: string;
  incoming: number;
  outgoing: number;
  net: number;
}

interface Invoice {
  client: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'overdue';
}

export function CashFlowPredictor() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '60' | '90'>('30');

  const forecast: CashFlowPeriod[] = [
    { period: 'Week 1', incoming: 8500, outgoing: 2100, net: 6400 },
    { period: 'Week 2', incoming: 12000, outgoing: 3500, net: 8500 },
    { period: 'Week 3', incoming: 9500, outgoing: 2800, net: 6700 },
    { period: 'Week 4', incoming: 11200, outgoing: 4200, net: 7000 },
  ];

  const upcomingInvoices: Invoice[] = [
    {
      client: 'Auckland Properties Ltd',
      amount: 12500,
      dueDate: new Date(2025, 9, 10),
      status: 'pending',
    },
    {
      client: 'Bay Commercial',
      amount: 28750,
      dueDate: new Date(2025, 9, 15),
      status: 'pending',
    },
    {
      client: 'Residential Build Co',
      amount: 8900,
      dueDate: new Date(2025, 8, 25),
      status: 'overdue',
    },
  ];

  const currentBalance = 15420;
  const projectedBalance30 = currentBalance + forecast.reduce((sum, p) => sum + p.net, 0);
  const totalIncoming = forecast.reduce((sum, p) => sum + p.incoming, 0);
  const totalOutgoing = forecast.reduce((sum, p) => sum + p.outgoing, 0);

  const periods = ['30', '60', '90'] as const;

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Cash Flow Predictor</Text>
          <Text style={styles.subtitle}>30/60/90 day forecast</Text>
        </View>

        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period} Days
              </Text>
            </Pressable>
          ))}
        </View>

        <GlassCard variant="cyan" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <TrendingUp color="#10B981" size={32} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Projected Balance</Text>
              <Text style={styles.summaryValue}>${projectedBalance30.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryDetails}>
            <View style={styles.summaryDetail}>
              <Text style={styles.summaryDetailLabel}>Current</Text>
              <Text style={styles.summaryDetailValue}>${currentBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDetail}>
              <Text style={styles.summaryDetailLabel}>Change</Text>
              <Text style={[styles.summaryDetailValue, { color: '#10B981' }]}>
                +${(projectedBalance30 - currentBalance).toLocaleString()}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.flowCards}>
          <GlassCard variant="default" style={styles.flowCard}>
            <View style={styles.flowCardHeader}>
              <ArrowUpRight color="#10B981" size={20} />
              <Text style={styles.flowCardTitle}>Incoming</Text>
            </View>
            <Text style={[styles.flowCardValue, { color: '#10B981' }]}>
              ${totalIncoming.toLocaleString()}
            </Text>
            <Text style={styles.flowCardLabel}>Expected revenue</Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.flowCard}>
            <View style={styles.flowCardHeader}>
              <ArrowDownRight color="#EF4444" size={20} />
              <Text style={styles.flowCardTitle}>Outgoing</Text>
            </View>
            <Text style={[styles.flowCardValue, { color: '#EF4444' }]}>
              ${totalOutgoing.toLocaleString()}
            </Text>
            <Text style={styles.flowCardLabel}>Expected expenses</Text>
          </GlassCard>
        </View>

        <GlassCard variant="default" style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>Weekly Breakdown</Text>
          {forecast.map((week, index) => (
            <View key={index} style={styles.weekRow}>
              <View style={styles.weekInfo}>
                <Text style={styles.weekLabel}>{week.period}</Text>
                <Text style={[
                  styles.weekNet,
                  { color: week.net >= 0 ? '#10B981' : '#EF4444' }
                ]}>
                  {week.net >= 0 ? '+' : ''}${week.net.toLocaleString()}
                </Text>
              </View>
              <View style={styles.weekBars}>
                <View style={styles.weekBarContainer}>
                  <View style={[
                    styles.weekBar,
                    styles.weekBarIncoming,
                    { width: `${(week.incoming / Math.max(...forecast.map(f => f.incoming))) * 100}%` }
                  ]} />
                </View>
                <View style={styles.weekBarContainer}>
                  <View style={[
                    styles.weekBar,
                    styles.weekBarOutgoing,
                    { width: `${(week.outgoing / Math.max(...forecast.map(f => f.outgoing))) * 100}%` }
                  ]} />
                </View>
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Invoices</Text>
          {upcomingInvoices.map((invoice, index) => (
            <GlassCard key={index} variant="default" style={styles.invoiceCard}>
              <View style={styles.invoiceLeft}>
                <View style={[
                  styles.invoiceStatus,
                  invoice.status === 'overdue' ? styles.invoiceOverdue : styles.invoicePending
                ]}>
                  {invoice.status === 'overdue' ? (
                    <AlertTriangle color="#EF4444" size={16} />
                  ) : (
                    <Clock color="#3B82F6" size={16} />
                  )}
                </View>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceClient}>{invoice.client}</Text>
                  <Text style={[
                    styles.invoiceDueDate,
                    invoice.status === 'overdue' && styles.invoiceDueDateOverdue
                  ]}>
                    {invoice.status === 'overdue' ? 'OVERDUE' : `Due in ${getDaysUntil(invoice.dueDate)} days`}
                  </Text>
                </View>
              </View>
              <Text style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</Text>
            </GlassCard>
          ))}
        </View>

        <GlassCard variant="default" style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Cash Flow Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.tipText}>
                You have 1 overdue invoice. Follow up with Residential Build Co.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.tipText}>
                Week 2 shows strong cash flow. Consider reinvesting in equipment.
              </Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.tipText}>
                Your outgoing expenses are 24% of income - excellent ratio!
              </Text>
            </View>
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
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
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
  summaryCard: {
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryDetail: {
    alignItems: 'center',
  },
  summaryDetailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  summaryDetailValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  flowCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  flowCard: {
    flex: 1,
    padding: 16,
  },
  flowCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  flowCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  flowCardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  flowCardLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  forecastCard: {
    padding: 16,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  weekRow: {
    marginBottom: 16,
  },
  weekInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  weekNet: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  weekBars: {
    gap: 6,
  },
  weekBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  weekBar: {
    height: '100%',
    borderRadius: 3,
  },
  weekBarIncoming: {
    backgroundColor: '#10B981',
  },
  weekBarOutgoing: {
    backgroundColor: '#EF4444',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  invoiceCard: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  invoiceStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoicePending: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  invoiceOverdue: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceClient: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 4,
  },
  invoiceDueDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceDueDateOverdue: {
    color: '#EF4444',
    fontFamily: 'Inter-Bold',
  },
  invoiceAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  tipsCard: {
    padding: 20,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
});
