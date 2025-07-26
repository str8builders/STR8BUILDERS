import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calculator, DollarSign, Percent, TrendingDown, TrendingUp, Info, Wrench } from 'lucide-react-native';

export default function Tools() {
  const [grossIncome, setGrossIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [selectedTaxRate, setSelectedTaxRate] = useState('30'); // Default to 30% tax rate
  const [calculationType, setCalculationType] = useState<'annual' | 'monthly' | 'weekly'>('annual');

  // NZ Tax brackets for 2024-2025
  const taxBrackets = [
    { min: 0, max: 14000, rate: 10.5 },
    { min: 14001, max: 48000, rate: 17.5 },
    { min: 48001, max: 70000, rate: 30 },
    { min: 70001, max: 180000, rate: 33 },
    { min: 180001, max: Infinity, rate: 39 },
  ];

  const calculateTax = (taxableIncome: number) => {
    let tax = 0;
    
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min - 1) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - (bracket.min - 1);
        tax += taxableInBracket * (bracket.rate / 100);
      }
    }
    
    return tax;
  };

  const calculateResults = () => {
    const gross = parseFloat(grossIncome) || 0;
    const businessExpenses = parseFloat(expenses) || 0;
    
    // Calculate taxable income (after business expenses)
    const taxableIncome = Math.max(0, gross - businessExpenses);
    
    // Calculate GST (15% in NZ)
    const gstOnIncome = gross * 0.15;
    const gstOnExpenses = businessExpenses * 0.15;
    const netGST = gstOnIncome - gstOnExpenses; // GST you owe
    
    // Calculate income tax using NZ tax brackets
    const incomeTax = calculateTax(taxableIncome);
    
    // Calculate ACC levy (approximately 1.39% for self-employed)
    const accLevy = taxableIncome * 0.0139;
    
    // Total tax obligations
    const totalTaxObligations = incomeTax + netGST + accLevy;
    
    // Net income after all deductions
    const netIncome = gross - businessExpenses - totalTaxObligations;
    
    return {
      grossIncome: gross,
      businessExpenses,
      taxableIncome,
      gstOnIncome,
      gstOnExpenses,
      netGST,
      incomeTax,
      accLevy,
      totalTaxObligations,
      netIncome,
      effectiveTaxRate: gross > 0 ? (totalTaxObligations / gross) * 100 : 0,
    };
  };

  const results = calculateResults();

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMultiplier = () => {
    switch (calculationType) {
      case 'monthly':
        return 12;
      case 'weekly':
        return 52;
      default:
        return 1;
    }
  };

  const convertToAnnual = (amount: number) => {
    return amount * getMultiplier();
  };

  const convertFromAnnual = (amount: number) => {
    return amount / getMultiplier();
  };

  const tools = [
    {
      icon: <Calculator color="#3B82F6" size={24} />,
      title: 'Tax & GST Calculator',
      description: 'Calculate your tax obligations and net income',
      color: '#3B82F6',
    },
    {
      icon: <DollarSign color="#10B981" size={24} />,
      title: 'Quote Generator',
      description: 'Generate professional quotes for clients',
      color: '#10B981',
    },
    {
      icon: <Percent color="#F59E0B" size={24} />,
      title: 'Markup Calculator',
      description: 'Calculate markup and profit margins',
      color: '#F59E0B',
    },
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Construction Tools</Text>
          <Wrench color="#FFF" size={24} />
        </View>

        {/* Tax & GST Calculator */}
        <GlassCard variant="electric" style={styles.calculatorCard}>
          <View style={styles.calculatorHeader}>
            <Calculator color="#3B82F6" size={24} />
            <Text style={styles.calculatorTitle}>NZ Tax & GST Calculator</Text>
          </View>

          {/* Calculation Period Selector */}
          <View style={styles.periodSelector}>
            <Text style={styles.sectionTitle}>Calculation Period</Text>
            <View style={styles.periodButtons}>
              {[
                { key: 'weekly', label: 'Weekly' },
                { key: 'monthly', label: 'Monthly' },
                { key: 'annual', label: 'Annual' },
              ].map((period) => (
                <Pressable
                  key={period.key}
                  style={[
                    styles.periodButton,
                    calculationType === period.key && styles.activePeriodButton
                  ]}
                  onPress={() => setCalculationType(period.key as any)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    calculationType === period.key && styles.activePeriodButtonText
                  ]}>
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Gross Income ({calculationType})
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={grossIncome}
                  onChangeText={setGrossIncome}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Business Expenses ({calculationType})
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={expenses}
                  onChangeText={setExpenses}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Results Section */}
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Tax Calculation Breakdown</Text>
            
            {/* Income Summary */}
            <GlassCard variant="teal" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Income Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gross Income:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(convertFromAnnual(results.grossIncome))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Business Expenses:</Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                  -{formatCurrency(convertFromAnnual(results.businessExpenses))}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Taxable Income:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(convertFromAnnual(results.taxableIncome))}
                </Text>
              </View>
            </GlassCard>

            {/* Tax Breakdown */}
            <GlassCard variant="purple" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tax Obligations</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Income Tax:</Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                  -{formatCurrency(convertFromAnnual(results.incomeTax))}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST Payable:</Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                  -{formatCurrency(convertFromAnnual(results.netGST))}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>ACC Levy:</Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                  -{formatCurrency(convertFromAnnual(results.accLevy))}
                </Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Tax:</Text>
                <Text style={[styles.totalValue, { color: '#EF4444' }]}>
                  -{formatCurrency(convertFromAnnual(results.totalTaxObligations))}
                </Text>
              </View>
            </GlassCard>

            {/* Final Result */}
            <GlassCard variant="electric" style={styles.finalResultCard}>
              <View style={styles.finalResultHeader}>
                <TrendingUp color="#10B981" size={24} />
                <Text style={styles.finalResultTitle}>Your Take-Home Income</Text>
              </View>
              
              <Text style={styles.finalAmount}>
                {formatCurrency(convertFromAnnual(results.netIncome))}
              </Text>
              
              <Text style={styles.finalPeriod}>
                per {calculationType === 'annual' ? 'year' : calculationType === 'monthly' ? 'month' : 'week'}
              </Text>
              
              <View style={styles.effectiveRate}>
                <Text style={styles.effectiveRateLabel}>Effective Tax Rate:</Text>
                <Text style={styles.effectiveRateValue}>
                  {results.effectiveTaxRate.toFixed(1)}%
                </Text>
              </View>
            </GlassCard>

            {/* GST Breakdown */}
            <GlassCard variant="cyan" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>GST Breakdown</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST on Income:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(convertFromAnnual(results.gstOnIncome))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST on Expenses:</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                  -{formatCurrency(convertFromAnnual(results.gstOnExpenses))}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Net GST Payable:</Text>
                <Text style={[styles.totalValue, { color: '#EF4444' }]}>
                  {formatCurrency(convertFromAnnual(results.netGST))}
                </Text>
              </View>
            </GlassCard>

            {/* Tax Tips */}
            <GlassCard variant="default" style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Info color="#F59E0B" size={20} />
                <Text style={styles.tipsTitle}>Tax Tips for Contractors</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Keep detailed records of all business expenses</Text>
                <Text style={styles.tipItem}>• Set aside 30-35% of income for tax obligations</Text>
                <Text style={styles.tipItem}>• Consider making provisional tax payments</Text>
                <Text style={styles.tipItem}>• Claim GST back on business purchases</Text>
                <Text style={styles.tipItem}>• Consult an accountant for complex situations</Text>
              </View>
            </GlassCard>
          </View>
        </GlassCard>

        {/* Other Tools Preview */}
        <View style={styles.otherTools}>
          <Text style={styles.sectionTitle}>Other Tools</Text>
          <View style={styles.toolsGrid}>
            {tools.slice(1).map((tool, index) => (
              <GlassCard key={index} variant="default" style={styles.toolCard}>
                <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
                  {tool.icon}
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
                <Text style={styles.comingSoon}>Coming Soon</Text>
              </GlassCard>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  calculatorCard: {
    marginVertical: 0,
    marginBottom: 24,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  calculatorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  periodSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  activePeriodButtonText: {
    color: '#FFF',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
  },
  resultsSection: {
    gap: 16,
  },
  summaryCard: {
    marginVertical: 0,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  finalResultCard: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 24,
  },
  finalResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  finalResultTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  finalAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  finalPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  effectiveRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  effectiveRateLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  effectiveRateValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  tipsCard: {
    marginVertical: 0,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
  otherTools: {
    marginBottom: 24,
  },
  toolsGrid: {
    gap: 16,
  },
  toolCard: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 24,
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toolTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 12,
  },
  comingSoon: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});