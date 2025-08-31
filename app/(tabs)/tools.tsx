import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calculator, DollarSign, Percent, TrendingDown, TrendingUp, Info, Wrench, FileText, Plus, Minus, Copy, Share } from 'lucide-react-native';

export default function Tools() {
  // Tax Calculator State
  const [grossIncome, setGrossIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [selectedTaxRate, setSelectedTaxRate] = useState('30'); // Default to 30% tax rate
  const [calculationType, setCalculationType] = useState<'annual' | 'monthly' | 'weekly'>('annual');
  
  // Quote Generator State
  const [activeQuoteTool, setActiveQuoteTool] = useState<'tax' | 'quote' | 'markup' | 'weather'>('tax');
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
  
  const removeQuoteItem = (id: number) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter(item => item.id !== id));
    }
  };
  
  const updateQuoteItem = (id: number, field: string, value: string) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const quantity = parseFloat(field === 'quantity' ? value : updatedItem.quantity) || 0;
          const rate = parseFloat(field === 'rate' ? value : updatedItem.rate) || 0;
          updatedItem.amount = quantity * rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };
  
  const calculateQuoteTotal = () => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.amount, 0);
    const gst = subtotal * 0.15;
    return { subtotal, gst, total: subtotal + gst };
  };
  
  // Markup Calculator Functions
  const calculateMarkup = () => {
    const cost = parseFloat(markupInputs.costPrice) || 0;
    const markup = parseFloat(markupInputs.markupPercentage) || 0;
    const selling = parseFloat(markupInputs.sellingPrice) || 0;
    
    if (markupInputs.calculationMode === 'markup') {
      // Calculate selling price from cost + markup
      const calculatedSelling = cost * (1 + markup / 100);
      const profit = calculatedSelling - cost;
      const marginPercentage = cost > 0 ? (profit / calculatedSelling) * 100 : 0;
      
      return {
        costPrice: cost,
        sellingPrice: calculatedSelling,
        markupAmount: profit,
        markupPercentage: markup,
        marginPercentage: marginPercentage,
        profitAmount: profit
      };
    } else {
      // Calculate from selling price and margin
      const marginDecimal = markup / 100;
      const calculatedCost = selling * (1 - marginDecimal);
      const profit = selling - calculatedCost;
      const markupPercentage = calculatedCost > 0 ? (profit / calculatedCost) * 100 : 0;
      
      return {
        costPrice: calculatedCost,
        sellingPrice: selling,
        markupAmount: profit,
        markupPercentage: markupPercentage,
        marginPercentage: markup,
        profitAmount: profit
      };
    }
  };

  // Weather Impact Functions
  const calculateWorkSuitability = (tradeKey: string) => {
    const trade = tradeRequirements[tradeKey as keyof typeof tradeRequirements];
    const temp = parseFloat(weatherData.temperature);
    const wind = parseFloat(weatherData.windSpeed);
    const humidity = parseFloat(weatherData.humidity);
    const precipitation = parseFloat(weatherData.precipitation);
    
    let score = 100;
    const issues: string[] = [];
    
    // Temperature check
    if (temp < trade.requirements.minTemp) {
      score -= 30;
      issues.push(`Too cold (${temp}°C < ${trade.requirements.minTemp}°C)`);
    } else if (temp > trade.requirements.maxTemp) {
      score -= 25;
      issues.push(`Too hot (${temp}°C > ${trade.requirements.maxTemp}°C)`);
    }
    
    // Wind check
    if (wind > trade.requirements.maxWind) {
      score -= 25;
      issues.push(`Too windy (${wind}km/h > ${trade.requirements.maxWind}km/h)`);
    }
    
    // Humidity check
    if (humidity > trade.requirements.maxHumidity) {
      score -= 15;
      issues.push(`High humidity (${humidity}% > ${trade.requirements.maxHumidity}%)`);
    }
    
    // Precipitation check
    if (precipitation > trade.requirements.maxPrecipitation) {
      score -= 35;
      issues.push(`Rain/precipitation (${precipitation}mm > ${trade.requirements.maxPrecipitation}mm)`);
    }
    
    // Condition check
    if (trade.requirements.avoidConditions.includes(weatherData.condition)) {
      score -= 40;
      issues.push(`Unsuitable conditions (${weatherData.condition})`);
    }
    
    score = Math.max(0, score);
    
    let suitability: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Dangerous';
    if (score >= 90) suitability = 'Excellent';
    else if (score >= 70) suitability = 'Good';
    else if (score >= 50) suitability = 'Fair';
    else if (score >= 30) suitability = 'Poor';
    else suitability = 'Dangerous';
    
    return { score, suitability, issues };
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'Excellent':
        return '#10B981';
      case 'Good':
        return '#3B82F6';
      case 'Fair':
        return '#F59E0B';
      case 'Poor':
        return '#EF4444';
      case 'Dangerous':
        return '#DC2626';
      default:
        return '#94A3B8';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'partly-cloudy':
        return '⛅';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      case 'stormy':
        return '⛈️';
      default:
        return '☁️';
    }
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
  
  const markupResults = calculateMarkup();
  const quoteTotal = calculateQuoteTotal();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Construction Tools</Text>
          <Calculator color="#FFF" size={24} />
        </View>
        
        {/* Tool Selector */}
        <GlassCard variant="default" style={styles.toolSelector}>
          <View style={styles.toolTabs}>
            <Pressable 
              style={[styles.toolTab, activeQuoteTool === 'tax' && styles.activeToolTab]}
              onPress={() => setActiveQuoteTool('tax')}
            >
              <Calculator color={activeQuoteTool === 'tax' ? '#FFF' : '#94A3B8'} size={20} />
              <Text style={[styles.toolTabText, activeQuoteTool === 'tax' && styles.activeToolTabText]}>
                Tax Calculator
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.toolTab, activeQuoteTool === 'quote' && styles.activeToolTab]}
              onPress={() => setActiveQuoteTool('quote')}
            >
              <FileText color={activeQuoteTool === 'quote' ? '#FFF' : '#94A3B8'} size={20} />
              <Text style={[styles.toolTabText, activeQuoteTool === 'quote' && styles.activeToolTabText]}>
                Quote Generator
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.toolTab, activeQuoteTool === 'markup' && styles.activeToolTab]}
              onPress={() => setActiveQuoteTool('markup')}
            >
              <Percent color={activeQuoteTool === 'markup' ? '#FFF' : '#94A3B8'} size={20} />
              <Text style={[styles.toolTabText, activeQuoteTool === 'markup' && styles.activeToolTabText]}>
                Markup Calculator
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.toolTab, activeQuoteTool === 'weather' && styles.activeToolTab]}
              onPress={() => setActiveQuoteTool('weather')}
            >
              <Text style={{ fontSize: 20 }}>{getWeatherIcon(weatherData.condition)}</Text>
              <Text style={[styles.toolTabText, activeQuoteTool === 'weather' && styles.activeToolTabText]}>
                Weather Impact
              </Text>
            </Pressable>
          </View>
        </GlassCard>

        {/* Tax & GST Calculator */}
        {activeQuoteTool === 'tax' && (
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
        )}
        
        {/* Quote Generator */}
        {activeQuoteTool === 'quote' && (
          <GlassCard variant="teal" style={styles.calculatorCard}>
            <View style={styles.calculatorHeader}>
              <FileText color="#14B8A6" size={24} />
              <Text style={styles.calculatorTitle}>Professional Quote Generator</Text>
            </View>
            
            {/* Quote Details */}
            <View style={styles.quoteDetailsSection}>
              <Text style={styles.sectionTitle}>Quote Details</Text>
              <View style={styles.quoteDetailsGrid}>
                <View style={styles.quoteDetailItem}>
                  <Text style={styles.inputLabel}>Client Name</Text>
                  <TextInput
                    style={styles.input}
                    value={quoteDetails.clientName}
                    onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, clientName: text }))}
                    placeholder="Enter client name"
                    placeholderTextColor="#64748B"
                  />
                </View>
                
                <View style={styles.quoteDetailItem}>
                  <Text style={styles.inputLabel}>Project Name</Text>
                  <TextInput
                    style={styles.input}
                    value={quoteDetails.projectName}
                    onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, projectName: text }))}
                    placeholder="Enter project name"
                    placeholderTextColor="#64748B"
                  />
                </View>
                
                <View style={styles.quoteDetailItem}>
                  <Text style={styles.inputLabel}>Quote Number</Text>
                  <TextInput
                    style={styles.input}
                    value={quoteDetails.quoteNumber}
                    onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, quoteNumber: text }))}
                    placeholder="QT-2025-0001"
                    placeholderTextColor="#64748B"
                  />
                </View>
                
                <View style={styles.quoteDetailItem}>
                  <Text style={styles.inputLabel}>Valid Until</Text>
                  <TextInput
                    style={styles.input}
                    value={quoteDetails.validUntil}
                    onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, validUntil: text }))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>
            </View>
            
            {/* Quote Items */}
            <View style={styles.quoteItemsSection}>
              <View style={styles.quoteItemsHeader}>
                <Text style={styles.sectionTitle}>Quote Items</Text>
                <Pressable style={styles.addItemButton} onPress={addQuoteItem}>
                  <Plus color="#14B8A6" size={16} />
                  <Text style={styles.addItemText}>Add Item</Text>
                </Pressable>
              </View>
              
              <ScrollView style={styles.quoteItemsList}>
                {quoteItems.map((item, index) => (
                  <GlassCard key={item.id} variant="default" style={styles.quoteItemCard}>
                    <View style={styles.quoteItemHeader}>
                      <Text style={styles.quoteItemNumber}>Item {index + 1}</Text>
                      {quoteItems.length > 1 && (
                        <Pressable 
                          style={styles.removeItemButton}
                          onPress={() => removeQuoteItem(item.id)}
                        >
                          <Minus color="#EF4444" size={16} />
                        </Pressable>
                      )}
                    </View>
                    
                    <View style={styles.quoteItemInputs}>
                      <View style={styles.quoteItemDescription}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                          style={styles.input}
                          value={item.description}
                          onChangeText={(text) => updateQuoteItem(item.id, 'description', text)}
                          placeholder="Describe the work or materials"
                          placeholderTextColor="#64748B"
                          multiline
                        />
                      </View>
                      
                      <View style={styles.quoteItemRow}>
                        <View style={styles.quoteItemQuantity}>
                          <Text style={styles.inputLabel}>Quantity</Text>
                          <TextInput
                            style={styles.input}
                            value={item.quantity}
                            onChangeText={(text) => updateQuoteItem(item.id, 'quantity', text)}
                            placeholder="1"
                            placeholderTextColor="#64748B"
                            keyboardType="numeric"
                          />
                        </View>
                        
                        <View style={styles.quoteItemRate}>
                          <Text style={styles.inputLabel}>Rate ($)</Text>
                          <TextInput
                            style={styles.input}
                            value={item.rate}
                            onChangeText={(text) => updateQuoteItem(item.id, 'rate', text)}
                            placeholder="0.00"
                            placeholderTextColor="#64748B"
                            keyboardType="numeric"
                          />
                        </View>
                        
                        <View style={styles.quoteItemAmount}>
                          <Text style={styles.inputLabel}>Amount</Text>
                          <Text style={styles.amountDisplay}>
                            ${item.amount.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </ScrollView>
            </View>
            
            {/* Quote Notes */}
            <View style={styles.quoteNotesSection}>
              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={quoteDetails.notes}
                onChangeText={(text) => setQuoteDetails(prev => ({ ...prev, notes: text }))}
                placeholder="Terms and conditions, payment terms, etc."
                placeholderTextColor="#64748B"
                multiline
                numberOfLines={3}
              />
            </View>
            
            {/* Quote Total */}
            <GlassCard variant="electric" style={styles.quoteTotalCard}>
              <Text style={styles.quoteTotalTitle}>Quote Summary</Text>
              
              <View style={styles.quoteTotalBreakdown}>
                <View style={styles.quoteTotalRow}>
                  <Text style={styles.quoteTotalLabel}>Subtotal:</Text>
                  <Text style={styles.quoteTotalValue}>${quoteTotal.subtotal.toFixed(2)}</Text>
                </View>
                
                <View style={styles.quoteTotalRow}>
                  <Text style={styles.quoteTotalLabel}>GST (15%):</Text>
                  <Text style={styles.quoteTotalValue}>${quoteTotal.gst.toFixed(2)}</Text>
                </View>
                
                <View style={[styles.quoteTotalRow, styles.quoteTotalFinal]}>
                  <Text style={styles.quoteTotalFinalLabel}>Total (incl. GST):</Text>
                  <Text style={styles.quoteTotalFinalValue}>${quoteTotal.total.toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.quoteActions}>
                <Pressable style={styles.quoteActionButton}>
                  <Copy color="#14B8A6" size={16} />
                  <Text style={styles.quoteActionText}>Copy Quote</Text>
                </Pressable>
                
                <Pressable style={styles.quoteActionButton}>
                  <Share color="#14B8A6" size={16} />
                  <Text style={styles.quoteActionText}>Share Quote</Text>
                </Pressable>
              </View>
            </GlassCard>
          </GlassCard>
        )}
        
        {/* Weather Impact Calculator */}
        {activeQuoteTool === 'weather' && (
          <GlassCard variant="cyan" style={styles.calculatorCard}>
            <View style={styles.calculatorHeader}>
              <Text style={{ fontSize: 24 }}>{getWeatherIcon(weatherData.condition)}</Text>
              <Text style={styles.calculatorTitle}>Weather Impact Calculator</Text>
            </View>
            
            {/* Weather Input Section */}
            <View style={styles.weatherInputSection}>
              <Text style={styles.sectionTitle}>Current Weather Conditions</Text>
              
              <View style={styles.weatherInputGrid}>
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Temperature (°C)</Text>
                  <TextInput
                    style={styles.input}
                    value={weatherData.temperature}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, temperature: text }))}
                    placeholder="18"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Wind Speed (km/h)</Text>
                  <TextInput
                    style={styles.input}
                    value={weatherData.windSpeed}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, windSpeed: text }))}
                    placeholder="15"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Humidity (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={weatherData.humidity}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, humidity: text }))}
                    placeholder="65"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Rain (mm)</Text>
                  <TextInput
                    style={styles.input}
                    value={weatherData.precipitation}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, precipitation: text }))}
                    placeholder="0"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              {/* Weather Condition Selector */}
              <View style={styles.conditionSelector}>
                <Text style={styles.inputLabel}>Weather Condition</Text>
                <View style={styles.conditionButtons}>
                  {[
                    { key: 'sunny', label: 'Sunny', icon: '☀️' },
                    { key: 'partly-cloudy', label: 'Partly Cloudy', icon: '⛅' },
                    { key: 'cloudy', label: 'Cloudy', icon: '☁️' },
                    { key: 'rainy', label: 'Rainy', icon: '🌧️' },
                    { key: 'stormy', label: 'Stormy', icon: '⛈️' },
                  ].map((condition) => (
                    <Pressable
                      key={condition.key}
                      style={[
                        styles.conditionButton,
                        weatherData.condition === condition.key && styles.activeConditionButton
                      ]}
                      onPress={() => setWeatherData(prev => ({ ...prev, condition: condition.key as any }))}
                    >
                      <Text style={styles.conditionIcon}>{condition.icon}</Text>
                      <Text style={[
                        styles.conditionText,
                        weatherData.condition === condition.key && styles.activeConditionText
                      ]}>
                        {condition.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            
            {/* Trade Selection */}
            <View style={styles.tradeSelectionSection}>
              <Text style={styles.sectionTitle}>Select Trades to Assess</Text>
              <View style={styles.tradesGrid}>
                {Object.entries(tradeRequirements).map(([key, trade]) => (
                  <Pressable
                    key={key}
                    style={[
                      styles.tradeButton,
                      selectedTrades.includes(key) && styles.selectedTradeButton
                    ]}
                    onPress={() => {
                      if (selectedTrades.includes(key)) {
                        setSelectedTrades(prev => prev.filter(t => t !== key));
                      } else {
                        setSelectedTrades(prev => [...prev, key]);
                      }
                    }}
                  >
                    <Text style={styles.tradeIcon}>{trade.icon}</Text>
                    <Text style={[
                      styles.tradeText,
                      selectedTrades.includes(key) && styles.selectedTradeText
                    ]}>
                      {trade.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            {/* Weather Impact Results */}
            <View style={styles.weatherResultsSection}>
              <Text style={styles.sectionTitle}>Work Suitability Assessment</Text>
              
              {selectedTrades.length === 0 ? (
                <GlassCard variant="default" style={styles.noTradesSelected}>
                  <Text style={styles.noTradesText}>Select trades to see weather impact assessment</Text>
                </GlassCard>
              ) : (
                <View style={styles.tradeAssessments}>
                  {selectedTrades.map((tradeKey) => {
                    const trade = tradeRequirements[tradeKey as keyof typeof tradeRequirements];
                    const assessment = calculateWorkSuitability(tradeKey);
                    
                    return (
                      <GlassCard key={tradeKey} variant="electric" style={styles.assessmentCard}>
                        <View style={styles.assessmentHeader}>
                          <View style={styles.tradeInfo}>
                            <Text style={styles.tradeIconLarge}>{trade.icon}</Text>
                            <Text style={styles.tradeName}>{trade.name}</Text>
                          </View>
                          <View style={styles.suitabilityBadge}>
                            <Text style={[
                              styles.suitabilityText,
                              { color: getSuitabilityColor(assessment.suitability) }
                            ]}>
                              {assessment.suitability}
                            </Text>
                            <Text style={styles.scoreText}>{assessment.score}/100</Text>
                          </View>
                        </View>
                        
                        {assessment.issues.length > 0 && (
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
  toolSelector: {
    marginVertical: 0,
    marginBottom: 16,
  },
  toolTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  toolTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeToolTab: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  toolTabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  activeToolTabText: {
    color: '#FFF',
  },
  quoteDetailsSection: {
    marginBottom: 24,
  },
  quoteDetailsGrid: {
    gap: 16,
  },
  quoteDetailItem: {
    marginBottom: 0,
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
  markupResultCard: {
    marginVertical: 0,
  },
  markupResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  markupResultLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  markupResultValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  markupResultDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    marginVertical: 8,
  },
  markupTipsCard: {
    marginVertical: 0,
  },
  weatherInputSection: {
    marginBottom: 24,
  },
  weatherInputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  weatherInputItem: {
    flex: 1,
    minWidth: '45%',
  },
  conditionSelector: {
    marginBottom: 0,
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  activeConditionButton: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  conditionIcon: {
    fontSize: 16,
  },
  conditionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  activeConditionText: {
    color: '#FFF',
  },
  tradeSelectionSection: {
    marginBottom: 24,
  },
  tradesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
    marginBottom: 4,
  },
  selectedTradeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tradeIcon: {
    fontSize: 16,
  },
  tradeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedTradeText: {
    color: '#FFF',
  },
  weatherResultsSection: {
    marginBottom: 24,
  },
  noTradesSelected: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 20,
  },
  noTradesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  tradeAssessments: {
    gap: 12,
  },
  assessmentCard: {
    marginVertical: 0,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tradeIconLarge: {
    fontSize: 24,
  },
  tradeName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  suitabilityBadge: {
    alignItems: 'flex-end',
  },
  suitabilityText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  issuesSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  issuesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  issueText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginBottom: 4,
  },
  recommendationSection: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    textAlign: 'center',
  },
  warningSection: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    textAlign: 'center',
  },
  weatherTipsCard: {
    marginVertical: 0,
  },
});