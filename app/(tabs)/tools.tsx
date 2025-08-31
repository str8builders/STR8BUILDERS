import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { FileText, Plus, Trash2, Copy, Share as ShareIcon, ExternalLink, BookOpen, Shield, Building, Hammer, AlertTriangle, CheckCircle, Download, Search } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

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
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateQuoteItem = (id: number, field: string, value: string) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
          const rate = parseFloat(field === 'rate' ? value : item.rate) || 0;
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
    const total = subtotal + gst;
    
    return { subtotal, gst, total };
  };

  const copyQuote = () => {
    // Implementation for copying quote
  };

  const shareQuote = () => {
    // Implementation for sharing quote
  };

  const openExternalLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  // New Zealand Building Resources
  const buildingResources = [
    {
      category: 'Health & Safety',
      icon: <Shield color="#EF4444" size={20} />,
      color: '#EF4444',
      resources: [
        {
          name: 'WorkSafe New Zealand',
          description: 'Official workplace health and safety guidance',
          url: 'https://www.worksafe.govt.nz/',
          type: 'Official'
        },
        {
          name: 'Construction Health & Safety Manual',
          description: 'Comprehensive safety guidelines for construction',
          url: 'https://www.worksafe.govt.nz/topic-and-industry/construction/',
          type: 'Guide'
        },
        {
          name: 'Site Safe NZ',
          description: 'Construction industry safety organization',
          url: 'https://www.sitesafe.org.nz/',
          type: 'Organization'
        },
        {
          name: 'Health & Safety at Work Act',
          description: 'Legal requirements and compliance',
          url: 'https://www.worksafe.govt.nz/laws-and-regulations/acts/hswa/',
          type: 'Legal'
        }
      ]
    },
    {
      category: 'Building Codes & Standards',
      icon: <Building color="#3B82F6" size={20} />,
      color: '#3B82F6',
      resources: [
        {
          name: 'New Zealand Building Code',
          description: 'Official building standards and requirements',
          url: 'https://www.building.govt.nz/building-code-compliance/',
          type: 'Official'
        },
        {
          name: 'Building Consent Authority',
          description: 'Local council building consent information',
          url: 'https://www.building.govt.nz/getting-a-building-consent/',
          type: 'Process'
        },
        {
          name: 'NZS 3604 Timber Framing',
          description: 'Standard for light timber frame buildings',
          url: 'https://www.standards.govt.nz/',
          type: 'Standard'
        },
        {
          name: 'E2/AS1 External Moisture',
          description: 'Acceptable solution for external moisture',
          url: 'https://www.building.govt.nz/building-code-compliance/e-moisture/',
          type: 'Standard'
        }
      ]
    },
    {
      category: 'Product Guides & Systems',
      icon: <Hammer color="#10B981" size={20} />,
      color: '#10B981',
      resources: [
        {
          name: 'GIB® Systems Guide',
          description: 'Plasterboard installation and finishing guide',
          url: 'https://www.gib.co.nz/assets/Uploads/GIB-Systems-Guide.pdf',
          type: 'Guide'
        },
        {
          name: 'MiTek Connector Guide',
          description: 'Timber connector installation guide',
          url: 'https://www.mitek.com.au/literature/',
          type: 'Guide'
        },
        {
          name: 'James Hardie Installation',
          description: 'Fiber cement installation guidelines',
          url: 'https://www.jameshardie.co.nz/homeowner/installation-guides',
          type: 'Guide'
        },
        {
          name: 'Colorsteel Roofing Guide',
          description: 'Steel roofing installation manual',
          url: 'https://www.colorsteel.co.nz/technical-resources/',
          type: 'Guide'
        },
        {
          name: 'Pink® Batts Installation',
          description: 'Insulation installation guide',
          url: 'https://www.pinkbatts.co.nz/technical-support/',
          type: 'Guide'
        },
        {
          name: 'Resene Paint Systems',
          description: 'Paint specification and application guide',
          url: 'https://www.resene.co.nz/technical/',
          type: 'Guide'
        }
      ]
    },
    {
      category: 'Industry Organizations',
      icon: <BookOpen color="#06B6D4" size={20} />,
      color: '#06B6D4',
      resources: [
        {
          name: 'Certified Builders NZ',
          description: 'Professional building organization',
          url: 'https://www.certifiedbuilders.co.nz/',
          type: 'Organization'
        },
        {
          name: 'Master Builders NZ',
          description: 'Industry association and training',
          url: 'https://www.masterbuilder.org.nz/',
          type: 'Organization'
        },
        {
          name: 'Building Industry Federation',
          description: 'Industry advocacy and support',
          url: 'https://www.bif.org.nz/',
          type: 'Organization'
        },
        {
          name: 'NZCB - NZ Certified Builders',
          description: 'Certification and professional development',
          url: 'https://www.nzcb.nz/',
          type: 'Certification'
        }
      ]
    },
    {
      category: 'Technical Resources',
      icon: <CheckCircle color="#8B5CF6" size={20} />,
      color: '#8B5CF6',
      resources: [
        {
          name: 'BRANZ Technical Papers',
          description: 'Building research and technical information',
          url: 'https://www.branz.co.nz/',
          type: 'Research'
        },
        {
          name: 'CodeMark Certificates',
          description: 'Product certification database',
          url: 'https://www.codemark.co.nz/',
          type: 'Database'
        },
        {
          name: 'MBIE Building Resources',
          description: 'Ministry guidance and updates',
          url: 'https://www.building.govt.nz/',
          type: 'Official'
        },
        {
          name: 'NZ Building Performance',
          description: 'Building performance and compliance',
          url: 'https://www.building.govt.nz/building-performance/',
          type: 'Performance'
        }
      ]
    },
    {
      category: 'Emergency & Weather',
      icon: <AlertTriangle color="#F59E0B" size={20} />,
      color: '#F59E0B',
      resources: [
        {
          name: 'MetService Weather',
          description: 'Official NZ weather forecasts',
          url: 'https://www.metservice.com/',
          type: 'Weather'
        },
        {
          name: 'Civil Defence Emergency',
          description: 'Emergency management information',
          url: 'https://www.civildefence.govt.nz/',
          type: 'Emergency'
        },
        {
          name: 'GeoNet Earthquake Info',
          description: 'Earthquake and geological hazards',
          url: 'https://www.geonet.org.nz/',
          type: 'Geological'
        },
        {
          name: 'Fire Emergency NZ',
          description: 'Fire safety and emergency response',
          url: 'https://www.fireandemergency.nz/',
          type: 'Emergency'
        }
      ]
    }
  ];

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'Official': return '#3B82F6';
      case 'Guide': return '#10B981';
      case 'Organization': return '#06B6D4';
      case 'Legal': return '#EF4444';
      case 'Standard': return '#8B5CF6';
      case 'Research': return '#F59E0B';
      case 'Emergency': return '#DC2626';
      case 'Weather': return '#0EA5E9';
      default: return '#94A3B8';
    }
  };

  const calculateMarkupResults = () => {
    const costPrice = parseFloat(markupInputs.costPrice) || 0;
    const markupPercentage = parseFloat(markupInputs.markupPercentage) || 0;
    const sellingPrice = parseFloat(markupInputs.sellingPrice) || 0;

    let results = {
      costPrice: 0,
      sellingPrice: 0,
      profitAmount: 0,
      markupPercentage: 0,
      marginPercentage: 0
    };

    if (markupInputs.calculationMode === 'markup') {
      results.costPrice = costPrice;
      results.sellingPrice = costPrice * (1 + markupPercentage / 100);
      results.profitAmount = results.sellingPrice - costPrice;
      results.markupPercentage = markupPercentage;
      results.marginPercentage = results.sellingPrice > 0 ? (results.profitAmount / results.sellingPrice) * 100 : 0;
    } else {
      results.sellingPrice = sellingPrice;
      results.marginPercentage = markupPercentage;
      results.profitAmount = sellingPrice * (markupPercentage / 100);
      results.costPrice = sellingPrice - results.profitAmount;
      results.markupPercentage = results.costPrice > 0 ? (results.profitAmount / results.costPrice) * 100 : 0;
    }

    return results;
  };

  const markupResults = calculateMarkupResults();

  const assessWeatherSuitability = (trade: any) => {
    const temp = parseFloat(weatherData.temperature);
    const wind = parseFloat(weatherData.windSpeed);
    const humidity = parseFloat(weatherData.humidity);
    const precipitation = parseFloat(weatherData.precipitation);
    const condition = weatherData.condition;

    const req = trade.requirements;
    const issues = [];

    if (temp < req.minTemp) issues.push(`Temperature too low (${temp}°C < ${req.minTemp}°C)`);
    if (temp > req.maxTemp) issues.push(`Temperature too high (${temp}°C > ${req.maxTemp}°C)`);
    if (wind > req.maxWind) issues.push(`Wind too strong (${wind}km/h > ${req.maxWind}km/h)`);
    if (humidity > req.maxHumidity) issues.push(`Humidity too high (${humidity}% > ${req.maxHumidity}%)`);
    if (precipitation > req.maxPrecipitation) issues.push(`Too much precipitation (${precipitation}mm > ${req.maxPrecipitation}mm)`);
    if (req.avoidConditions.includes(condition)) issues.push(`Weather condition not suitable (${condition})`);

    let suitability = 'Excellent';
    if (issues.length > 0) {
      if (issues.some(issue => issue.includes('stormy') || issue.includes('too strong') || temp < 0)) {
        suitability = 'Dangerous';
      } else if (issues.length >= 3) {
        suitability = 'Poor';
      } else {
        suitability = 'Caution';
      }
    }

    return { suitability, issues };
  };

  const [activeQuoteTool, setActiveQuoteTool] = useState('quote');
  
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
        
        {/* New Zealand Building Resources */}
        <GlassCard variant="cyan" style={styles.calculatorCard}>
          <View style={styles.calculatorHeader}>
            <Text style={{ fontSize: 24 }}>🏗️</Text>
            <Text style={styles.calculatorTitle}>NZ Building Resources</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Essential resources for New Zealand construction professionals
          </Text>
          
          <View style={styles.resourcesContainer}>
            {buildingResources.map((category, categoryIndex) => (
              <GlassCard key={categoryIndex} variant="default" style={styles.resourceCategory}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryTitleContainer}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                      {category.icon}
                    </View>
                    <Text style={styles.categoryTitle}>{category.category}</Text>
                  </View>
                  <Text style={styles.resourceCount}>
                    {category.resources.length} resources
                  </Text>
                </View>
                
                <View style={styles.resourcesList}>
                  {category.resources.map((resource, resourceIndex) => (
                    <Pressable
                      key={resourceIndex}
                      style={styles.resourceItem}
                      onPress={() => openExternalLink(resource.url)}
                    >
                      <View style={styles.resourceInfo}>
                        <View style={styles.resourceHeader}>
                          <Text style={styles.resourceName}>{resource.name}</Text>
                          <View style={[
                            styles.resourceTypeBadge,
                            { backgroundColor: getResourceTypeColor(resource.type) }
                          ]}>
                            <Text style={styles.resourceTypeText}>{resource.type}</Text>
                          </View>
                        </View>
                        <Text style={styles.resourceDescription}>{resource.description}</Text>
                      </View>
                      <ExternalLink color="#94A3B8" size={16} />
                    </Pressable>
                  ))}
                </View>
              </GlassCard>
            ))}
          </View>
          
          {/* Quick Access Favorites */}
          <GlassCard variant="electric" style={styles.favoritesCard}>
            <View style={styles.favoritesHeader}>
              <Text style={{ fontSize: 20 }}>⭐</Text>
              <Text style={styles.favoritesTitle}>Quick Access Favorites</Text>
            </View>
            
            <View style={styles.favoritesList}>
              <Pressable 
                style={styles.favoriteItem}
                onPress={() => openExternalLink('https://www.building.govt.nz/building-code-compliance/')}
              >
                <Building color="#3B82F6" size={18} />
                <Text style={styles.favoriteText}>NZ Building Code</Text>
                <ExternalLink color="#94A3B8" size={14} />
              </Pressable>
              
              <Pressable 
                style={styles.favoriteItem}
                onPress={() => openExternalLink('https://www.worksafe.govt.nz/')}
              >
                <Shield color="#EF4444" size={18} />
                <Text style={styles.favoriteText}>WorkSafe NZ</Text>
                <ExternalLink color="#94A3B8" size={14} />
              </Pressable>
              
              <Pressable 
                style={styles.favoriteItem}
                onPress={() => openExternalLink('https://www.gib.co.nz/assets/Uploads/GIB-Systems-Guide.pdf')}
              >
                <FileText color="#10B981" size={18} />
                <Text style={styles.favoriteText}>GIB® Guide</Text>
                <ExternalLink color="#94A3B8" size={14} />
              </Pressable>
              
              <Pressable 
                style={styles.favoriteItem}
                onPress={() => openExternalLink('https://www.metservice.com/')}
              >
                <AlertTriangle color="#F59E0B" size={18} />
                <Text style={styles.favoriteText}>MetService</Text>
                <ExternalLink color="#94A3B8" size={14} />
              </Pressable>
            </View>
          </GlassCard>
          
          {/* Resource Search Tips */}
          <GlassCard variant="purple" style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={{ fontSize: 20 }}>💡</Text>
              <Text style={styles.tipsTitle}>Resource Tips</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Bookmark frequently used guides for quick access</Text>
              <Text style={styles.tipItem}>• Check WorkSafe for latest safety updates</Text>
              <Text style={styles.tipItem}>• Verify building code changes before starting projects</Text>
              <Text style={styles.tipItem}>• Download PDF guides for offline access on site</Text>
              <Text style={styles.tipItem}>• Join industry organizations for ongoing support</Text>
              <Text style={styles.tipItem}>• Stay updated with MBIE building performance news</Text>
            </View>
          </GlassCard>
        </GlassCard>

        {/* Weather Impact Tool */}
        {activeQuoteTool === 'weather' && (
          <GlassCard variant="orange" style={styles.calculatorCard}>
            <View style={styles.calculatorHeader}>
              <Text style={{ fontSize: 24 }}>🌤️</Text>
              <Text style={styles.calculatorTitle}>Weather Impact Assessment</Text>
            </View>
            
            {/* Weather Input */}
            <View style={styles.weatherInputSection}>
              <Text style={styles.sectionTitle}>Current Weather Conditions</Text>
              
              <View style={styles.weatherInputGrid}>
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Temperature (°C)</Text>
                  <TextInput
                    style={styles.textInput}
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
                    style={styles.textInput}
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
                    style={styles.textInput}
                    value={weatherData.humidity}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, humidity: text }))}
                    placeholder="65"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.weatherInputItem}>
                  <Text style={styles.inputLabel}>Precipitation (mm)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={weatherData.precipitation}
                    onChangeText={(text) => setWeatherData(prev => ({ ...prev, precipitation: text }))}
                    placeholder="0"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            {/* Trade Selection */}
            <View style={styles.tradeSelectionSection}>
              <Text style={styles.sectionTitle}>Select Trades to Assess</Text>
              <View style={styles.tradeGrid}>
                {Object.entries(tradeRequirements).map(([key, trade]) => (
                  <Pressable
                    key={key}
                    style={[
                      styles.tradeButton,
                      selectedTrades.includes(key) && styles.selectedTradeButton
                    ]}
                    onPress={() => {
                      if (selectedTrades.includes(key)) {
                        setSelectedTrades(selectedTrades.filter(t => t !== key));
                      } else {
                        setSelectedTrades([...selectedTrades, key]);
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
            
            {/* Assessment Results */}
            <View style={styles.assessmentResults}>
              <Text style={styles.sectionTitle}>Weather Suitability Assessment</Text>
              
              {selectedTrades.length === 0 ? (
                <GlassCard variant="default" style={styles.noTradesCard}>
                  <Text style={styles.noTradesText}>Select trades to see weather assessment</Text>
                </GlassCard>
              ) : (
                <View style={styles.assessmentGrid}>
                  {selectedTrades.map(tradeKey => {
                    const trade = tradeRequirements[tradeKey];
                    const assessment = assessWeatherSuitability(trade);
                    
                    return (
                      <GlassCard 
                        key={tradeKey} 
                        variant={
                          assessment.suitability === 'Excellent' ? 'electric' :
                          assessment.suitability === 'Caution' ? 'orange' :
                          assessment.suitability === 'Poor' ? 'purple' : 'default'
                        }
                        style={styles.assessmentCard}
                      >
                        <View style={styles.assessmentHeader}>
                          <Text style={styles.tradeIcon}>{trade.icon}</Text>
                          <View style={styles.assessmentTitleSection}>
                            <Text style={styles.assessmentTradeTitle}>{trade.name}</Text>
                            <Text style={[
                              styles.suitabilityBadge,
                              assessment.suitability === 'Excellent' && styles.excellentBadge,
                              assessment.suitability === 'Caution' && styles.cautionBadge,
                              assessment.suitability === 'Poor' && styles.poorBadge,
                              assessment.suitability === 'Dangerous' && styles.dangerousBadge
                            ]}>
                              {assessment.suitability}
                            </Text>
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
              <Text style={{ fontSize: 24 }}>%</Text>
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
                  <Text style={{ fontSize: 20 }}>💡</Text>
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
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  effectiveRateContainer: {
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
    color: '#FFF',
  },
  quoteDetailsSection: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
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
  quoteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  itemInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  itemInputThird: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    textAlign: 'center',
  },
  quoteNotesSection: {
    marginBottom: 24,
  },
  quoteSummary: {
    marginVertical: 0,
  },
  summaryBreakdown: {
    marginBottom: 20,
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
  resourcesContainer: {
    gap: 16,
  },
  resourceCategory: {
    marginVertical: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  resourceCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resourcesList: {
    gap: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resourceName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    flex: 1,
  },
  resourceTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  resourceTypeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 18,
  },
  favoritesCard: {
    marginVertical: 0,
    marginTop: 16,
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  favoritesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  favoriteItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favoriteText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    flex: 1,
  },
  tipsCard: {
    marginVertical: 0,
    marginTop: 16,
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
  weatherInputSection: {
    marginBottom: 24,
  },
  weatherInputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weatherInputItem: {
    flex: 1,
    minWidth: '45%',
  },
  tradeSelectionSection: {
    marginBottom: 24,
  },
  tradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: '30%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedTradeButton: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  tradeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tradeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    textAlign: 'center',
  },
  selectedTradeText: {
    color: '#FFF',
  },
  assessmentResults: {
    marginBottom: 24,
  },
  noTradesCard: {
    marginVertical: 0,
    alignItems: 'center',
    padding: 24,
  },
  noTradesText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  assessmentGrid: {
    gap: 12,
  },
  assessmentCard: {
    marginVertical: 0,
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  assessmentTitleSection: {
    flex: 1,
  },
  assessmentTradeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  suitabilityBadge: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  excellentBadge: {
    backgroundColor: '#10B981',
    color: '#FFF',
  },
  cautionBadge: {
    backgroundColor: '#F59E0B',
    color: '#FFF',
  },
  poorBadge: {
    backgroundColor: '#8B5CF6',
    color: '#FFF',
  },
  dangerousBadge: {
    backgroundColor: '#EF4444',
    color: '#FFF',
  },
  issuesSection: {
    marginTop: 12,
  },
  issuesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  issueText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  recommendationSection: {
    marginTop: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  recommendationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  warningSection: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  weatherTipsCard: {
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
    marginBottom: 8,
  },
  markupResultLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  markupResultValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
});