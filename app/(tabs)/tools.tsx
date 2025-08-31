import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileText, Plus, Trash2, Copy, Share as ShareIcon } from 'lucide-react-native';

export default function Tools() {
  // Tax Calculator State
  const [grossIncome, setGrossIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [selectedTaxRate, setSelectedTaxRate] = useState('30'); // Default to 30% tax rate
  const [calculationType, setCalculationType] = useState<'annual' | 'monthly' | 'weekly'>('annual');
  
  // Quote Generator State
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, description: '', quantity: '', rate: '', amount: 0 }
  ]);
  const [quoteDetails, setQuoteDetails] = useState({
    clientName: '',
    projectName: '',
    quoteNumber: `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });
  
  // Markup Calculator State
  const [markupInputs, setMarkupInputs] = useState({
    costPrice: '',
    markupPercentage: '',
    sellingPrice: '',
    calculationMode: 'markup' as 'markup' | 'margin' | 'selling'
  });

  // Weather Impact State
  const [weatherData, setWeatherData] = useState({
    temperature: '18',
    windSpeed: '15',
    humidity: '65',
    precipitation: '0',
    condition: 'partly-cloudy' as 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy'
  });
  
  const [selectedTrades, setSelectedTrades] = useState<string[]>(['general']);

  // Trade definitions with weather requirements
  const tradeRequirements = {
    'general': {
      name: 'General Construction',
      icon: '🔨',
      requirements: {
        minTemp: 5,
        maxTemp: 35,
        maxWind: 25,
        maxHumidity: 85,
        maxPrecipitation: 2,
        avoidConditions: ['stormy']
      }
    },
    'roofing': {
      name: 'Roofing',
      icon: '🏠',
      requirements: {
        minTemp: 8,
        maxTemp: 32,
        maxWind: 15,
        maxHumidity: 80,
        maxPrecipitation: 0,
        avoidConditions: ['rainy', 'stormy']
      }
    },
    'painting': {
      name: 'Painting (Exterior)',
      icon: '🎨',
      requirements: {
        minTemp: 10,
        maxTemp: 30,
        maxWind: 20,
        maxHumidity: 75,
        maxPrecipitation: 0,
        avoidConditions: ['rainy', 'stormy']
      }
    },
    'concrete': {
      name: 'Concrete Work',
      icon: '🏗️',
      requirements: {
        minTemp: 5,
        maxTemp: 30,
        maxWind: 30,
        maxHumidity: 90,
        maxPrecipitation: 1,
        avoidConditions: ['stormy']
      }
    },
    'electrical': {
      name: 'Electrical (Outdoor)',
      icon: '⚡',
      requirements: {
        minTemp: 0,
        maxTemp: 40,
        maxWind: 35,
        maxHumidity: 95,
        maxPrecipitation: 0,
        avoidConditions: ['rainy', 'stormy']
      }
    },
    'plumbing': {
      name: 'Plumbing (Outdoor)',
      icon: '🔧',
      requirements: {
        minTemp: 2,
        maxTemp: 38,
        maxWind: 30,
        maxHumidity: 90,
        maxPrecipitation: 5,
        avoidConditions: ['stormy']
      }
    },
    'landscaping': {
      name: 'Landscaping',
      icon: '🌱',
      requirements: {
        minTemp: 8,
        maxTemp: 35,
        maxWind: 25,
        maxHumidity: 85,
        maxPrecipitation: 3,
        avoidConditions: ['stormy']
      }
    },
    'demolition': {
      name: 'Demolition',
      icon: '🔨',
      requirements: {
        minTemp: 0,
        maxTemp: 40,
        maxWind: 20,
        maxHumidity: 95,
        maxPrecipitation: 8,
        avoidConditions: ['stormy']
      }
    }
  };

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
  // Quote Generator Functions
  const addQuoteItem = () => {
    const newId = Math.max(...quoteItems.map(item => item.id)) + 1;
    setQuoteItems([...quoteItems, { 
      id: newId, 
      description: '', 
      quantity: '', 
      rate: '', 
      amount: 0 
    }]);
  };
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Construction Tools</Text>
          <FileText color="#FFF" size={24} />
        </View>
        
        {/* Quote Generator */}
        <GlassCard variant="electric" style={styles.calculatorCard}>
          <Text style={styles.cardTitle}>Quote Generator</Text>
          <Text style={styles.cardSubtitle}>Create professional construction quotes</Text>
          
          {/* Quote Details */}
          <View style={styles.quoteDetailsSection}>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Client Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={quoteDetails.clientName}
                  onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, clientName: text }))}
                  placeholder="Client Name"
                  placeholderTextColor="#64748B"
                />
              </View>
              
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Project Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={quoteDetails.projectName}
                  onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, projectName: text }))}
                  placeholder="Project Name"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Quote Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={quoteDetails.quoteNumber}
                  onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, quoteNumber: text }))}
                  placeholder="Q2025-001"
                  placeholderTextColor="#64748B"
                />
              </View>
              
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Valid Until</Text>
                <TextInput
                  style={styles.textInput}
                  value={quoteDetails.validUntil}
                  onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, validUntil: text }))}
                  placeholder="2025-02-15"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>
          </View>
          
          {/* Quote Items */}
          <View style={styles.quoteItemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quote Items</Text>
              <Pressable style={styles.addItemButton} onPress={addQuoteItem}>
                <Plus color="#10B981" size={16} />
                <Text style={styles.addItemText}>Add Item</Text>
              </Pressable>
            </View>
            
            {quoteItems.map((item, index) => (
              <View key={item.id} style={styles.quoteItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemNumber}>Item {index + 1}</Text>
                  {quoteItems.length > 1 && (
                    <Pressable onPress={() => removeQuoteItem(item.id)}>
                      <Trash2 color="#EF4444" size={16} />
                    </Pressable>
                  )}
                </View>
                
                <TextInput
                  style={styles.textInput}
                  value={item.description}
                  onChangeText={(text) => updateQuoteItem(item.id, 'description', text)}
                  placeholder="Description of work/materials"
                  placeholderTextColor="#64748B"
                />
                
                <View style={styles.itemInputRow}>
                  <View style={styles.itemInputThird}>
                    <Text style={styles.inputLabel}>Qty</Text>
                    <TextInput
                      style={styles.textInput}
                      value={item.quantity}
                      onChangeText={(text) => updateQuoteItem(item.id, 'quantity', text)}
                      placeholder="1"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.itemInputThird}>
                    <Text style={styles.inputLabel}>Rate ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={item.rate}
                      onChangeText={(text) => updateQuoteItem(item.id, 'rate', text)}
                      placeholder="85"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.itemInputThird}>
                    <Text style={styles.inputLabel}>Amount</Text>
                    <View style={styles.amountDisplay}>
                      <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          {/* Quote Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes & Terms</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={quoteDetails.notes}
              onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, notes: text }))}
              placeholder="Payment terms, conditions, etc."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Quote Summary */}
          <GlassCard variant="cyan" style={styles.quoteSummary}>
            <Text style={styles.summaryTitle}>Quote Summary</Text>
            
            {(() => {
              const totals = calculateQuoteTotal();
              return (
                <View style={styles.summaryBreakdown}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal:</Text>
                    <Text style={styles.summaryValue}>${totals.subtotal.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>GST (15%):</Text>
                    <Text style={styles.summaryValue}>${totals.gst.toFixed(2)}</Text>
                  </View>
                  
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total (incl. GST):</Text>
                    <Text style={styles.totalValue}>${totals.total.toFixed(2)}</Text>
                  </View>
                </View>
              );
            })()}
            
            <View style={styles.quoteActions}>
              <Pressable style={styles.quoteActionButton} onPress={copyQuote}>
                <Copy color="#06B6D4" size={16} />
                <Text style={styles.quoteActionText}>Copy Quote</Text>
              </Pressable>
              
              <Pressable style={styles.quoteActionButton} onPress={shareQuote}>
                <ShareIcon color="#06B6D4" size={16} />
                <Text style={styles.quoteActionText}>Share Quote</Text>
              </Pressable>
            </View>
          </GlassCard>
        </GlassCard>
                          <View style={styles.issuesSection}>
                            <Text style={styles.issuesTitle}>Weather Concerns:</Text>
                            {assessment.issues.map((issue, index) => (
                              <Text key={index} style={styles.issueText}>• {issue}</Text>
                            ))}
                          </View>
                        )}
                        
                        {assessment.suitability === 'Excellent' && (
                          <View style={styles.recommendationSection}>
                            <Text style={styles.recommendationText}>
                              ✅ Perfect conditions for {trade.name.toLowerCase()}
                            </Text>
                          </View>
                        )}
                        
                        {assessment.suitability === 'Dangerous' && (
                          <View style={styles.warningSection}>
                            <Text style={styles.warningText}>
                              ⚠️ Work not recommended - safety risk
                            </Text>
                          </View>
                        )}
                      </GlassCard>
                    );
                  })}
                </View>
              )}
            </View>
            
            {/* Weather Tips */}
            <GlassCard variant="default" style={styles.weatherTipsCard}>
              <View style={styles.tipsHeader}>
                <Text style={{ fontSize: 20 }}>🌤️</Text>
                <Text style={styles.tipsTitle}>Weather Safety Tips</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Check weather forecast before starting work</Text>
                <Text style={styles.tipItem}>• Have backup indoor tasks for bad weather days</Text>
                <Text style={styles.tipItem}>• Ensure proper safety gear for conditions</Text>
                <Text style={styles.tipItem}>• Consider rescheduling for extreme weather</Text>
                <Text style={styles.tipItem}>• Monitor conditions throughout the day</Text>
                <Text style={styles.tipItem}>• Prioritize worker safety over deadlines</Text>
              </View>
            </GlassCard>
          </GlassCard>
        )}
        
        {/* Markup Calculator */}
        {activeQuoteTool === 'markup' && (
          <GlassCard variant="purple" style={styles.calculatorCard}>
            <View style={styles.calculatorHeader}>
              <Percent color="#8B5CF6" size={24} />
              <Text style={styles.calculatorTitle}>Markup & Margin Calculator</Text>
            </View>
            
            {/* Calculation Mode */}
            <View style={styles.markupModeSection}>
              <Text style={styles.sectionTitle}>Calculation Mode</Text>
              <View style={styles.markupModeButtons}>
                <Pressable
                  style={[
                    styles.markupModeButton,
                    markupInputs.calculationMode === 'markup' && styles.activeMarkupMode
                  ]}
                  onPress={() => setMarkupInputs(prev => ({ ...prev, calculationMode: 'markup' }))}
                >
                  <Text style={[
                    styles.markupModeText,
                    markupInputs.calculationMode === 'markup' && styles.activeMarkupModeText
                  ]}>
                    Markup %
                  </Text>
                  <Text style={styles.markupModeDescription}>
                    Add percentage to cost
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.markupModeButton,
                    markupInputs.calculationMode === 'margin' && styles.activeMarkupMode
                  ]}
                  onPress={() => setMarkupInputs(prev => ({ ...prev, calculationMode: 'margin' }))}
                >
                  <Text style={[
                    styles.markupModeText,
                    markupInputs.calculationMode === 'margin' && styles.activeMarkupModeText
                  ]}>
                    Margin %
                  </Text>
                  <Text style={styles.markupModeDescription}>
                    Percentage of selling price
                  </Text>
                </Pressable>
              </View>
            </View>
            
            {/* Markup Inputs */}
            <View style={styles.markupInputsSection}>
              {markupInputs.calculationMode === 'markup' ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cost Price ($)</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.input}
                        value={markupInputs.costPrice}
                        onChangeText={(text) => setMarkupInputs(prev => ({ ...prev, costPrice: text }))}
                        placeholder="0.00"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Markup Percentage (%)</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={markupInputs.markupPercentage}
                        onChangeText={(text) => setMarkupInputs(prev => ({ ...prev, markupPercentage: text }))}
                        placeholder="30"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentSymbol}>%</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Selling Price ($)</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.input}
                        value={markupInputs.sellingPrice}
                        onChangeText={(text) => setMarkupInputs(prev => ({ ...prev, sellingPrice: text }))}
                        placeholder="0.00"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Margin Percentage (%)</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={markupInputs.markupPercentage}
                        onChangeText={(text) => setMarkupInputs(prev => ({ ...prev, markupPercentage: text }))}
                        placeholder="25"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentSymbol}>%</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            
            {/* Markup Results */}
            <View style={styles.markupResultsSection}>
              <Text style={styles.sectionTitle}>Calculation Results</Text>
              
              <GlassCard variant="electric" style={styles.markupResultCard}>
                <View style={styles.markupResultRow}>
                  <Text style={styles.markupResultLabel}>Cost Price:</Text>
                  <Text style={styles.markupResultValue}>
                    ${markupResults.costPrice.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.markupResultRow}>
                  <Text style={styles.markupResultLabel}>Selling Price:</Text>
                  <Text style={styles.markupResultValue}>
                    ${markupResults.sellingPrice.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.markupResultRow}>
                  <Text style={styles.markupResultLabel}>Profit Amount:</Text>
                  <Text style={[styles.markupResultValue, { color: '#10B981' }]}>
                    ${markupResults.profitAmount.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.markupResultDivider} />
                
                <View style={styles.markupResultRow}>
                  <Text style={styles.markupResultLabel}>Markup %:</Text>
                  <Text style={styles.markupResultValue}>
                    {markupResults.markupPercentage.toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.markupResultRow}>
                  <Text style={styles.markupResultLabel}>Margin %:</Text>
                  <Text style={styles.markupResultValue}>
                    {markupResults.marginPercentage.toFixed(1)}%
                  </Text>
                </View>
              </GlassCard>
              
              {/* Markup Tips */}
              <GlassCard variant="default" style={styles.markupTipsCard}>
                <View style={styles.tipsHeader}>
                  <Info color="#F59E0B" size={20} />
                  <Text style={styles.tipsTitle}>Pricing Tips</Text>
                </View>
                <View style={styles.tipsList}>
                  <Text style={styles.tipItem}>• Standard construction markup: 20-50%</Text>
                  <Text style={styles.tipItem}>• Include overhead costs in your base price</Text>
                  <Text style={styles.tipItem}>• Consider market rates and competition</Text>
                  <Text style={styles.tipItem}>• Factor in project complexity and risk</Text>
                  <Text style={styles.tipItem}>• Markup vs Margin: Know the difference!</Text>
                </View>
              </GlassCard>
            </View>
          </GlassCard>
        )}

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
  quoteDetailsSection: {
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
  quoteDetailsGrid: {
    gap: 16,
  },
  quoteDetailItem: {
    marginBottom: 0,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  quoteItemsSection: {
    marginBottom: 24,
  },
  quoteItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  quoteItemsList: {
    maxHeight: 400,
  },
  quoteItemCard: {
    marginVertical: 0,
    marginBottom: 12,
  },
  quoteItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteItemNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  removeItemButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 6,
    borderRadius: 12,
  },
  quoteItemInputs: {
    gap: 12,
  },
  quoteItemDescription: {
    marginBottom: 0,
  },
  quoteItemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quoteItemQuantity: {
    flex: 1,
  },
  quoteItemRate: {
    flex: 1,
  },
  quoteItemAmount: {
    flex: 1,
  },
  amountDisplay: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  quoteNotesSection: {
    marginBottom: 24,
  },
  quoteTotalCard: {
    marginVertical: 0,
  },
  quoteTotalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  quoteTotalBreakdown: {
    marginBottom: 20,
  },
  quoteTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteTotalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  quoteTotalValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  quoteTotalFinal: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    marginTop: 8,
  },
  quoteTotalFinalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  quoteTotalFinalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  quoteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quoteActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  quoteActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  markupModeSection: {
    marginBottom: 24,
  },
  markupModeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  markupModeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  activeMarkupMode: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  markupModeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#94A3B8',
    marginBottom: 4,
  },
  activeMarkupModeText: {
    color: '#FFF',
  },
  markupModeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  markupInputsSection: {
    marginBottom: 24,
  },
  percentSymbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  markupResultsSection: {
    gap: 16,
  },
});