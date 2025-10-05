import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calculator, Ruler, DollarSign, Percent, Users, FileText, Plus, Minus, X, Divide, Equal, Mail, Phone, MapPin, Eye, Send, Download, Trash2, Check, Mic, Camera, Clock, Trophy, TrendingUp, CloudRain } from 'lucide-react-native';
import { useAppData } from '@/hooks/useAppData';
import { generateInvoicePDF, shareViaPDF, sendViaEmail } from '@/utils/pdfGenerator';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import { PhotoDocumentation } from '@/components/photos/PhotoDocumentation';
import { ExpenseTracker } from '@/components/expenses/ExpenseTracker';
import { QuickWinTimer } from '@/components/timer/QuickWinTimer';
import { AchievementSystem } from '@/components/gamification/AchievementSystem';
import { CashFlowPredictor } from '@/components/cashflow/CashFlowPredictor';
import { TradeWeatherImpact } from '@/components/weather/TradeWeatherImpact';

export default function Tools() {
  const {
    clients,
    invoices,
    addClient,
    deleteClient,
    getClientInvoices,
    getUnbilledTimesheets,
    getTotalUnbilledAmount,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'clients' | 'calculator' | 'converter' | 'voice' | 'photos' | 'expenses' | 'timer' | 'achievements' | 'cashflow' | 'weather'>('weather');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedTimesheets, setSelectedTimesheets] = useState<string[]>([]);
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Form state for adding new client
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    hourlyRate: '85'
  });
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Material Calculator state
  const [materialCalc, setMaterialCalc] = useState({
    length: '',
    width: '',
    height: '',
    materialType: 'concrete',
    wastage: '10'
  });

  const materials = {
    concrete: { name: 'Concrete', unit: 'm³', density: 2400 },
    steel: { name: 'Steel Reinforcement', unit: 'kg', density: 7850 },
    timber: { name: 'Timber', unit: 'm³', density: 600 },
    gravel: { name: 'Gravel', unit: 'm³', density: 1600 },
  };

  const handleAddClient = () => {
    if (!newClient.name.trim()) {
      Alert.alert('Error', 'Client name is required');
      return;
    }
    
    addClient({
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      address: newClient.address,
      status: 'Active',
      hourlyRate: parseFloat(newClient.hourlyRate) || 85,
    });
    
    setNewClient({ name: '', email: '', phone: '', address: '', hourlyRate: '85' });
    setShowAddClientModal(false);
    Alert.alert('Success', 'Client added successfully!');
  };

  const handleCreateInvoice = () => {
    if (!selectedClient || selectedTimesheets.length === 0) {
      Alert.alert('Error', 'Please select timesheet entries to invoice');
      return;
    }

    const invoice = createInvoice(selectedClient.id, selectedTimesheets, invoiceNotes);
    if (invoice) {
      setSelectedTimesheets([]);
      setInvoiceNotes('');
      setShowInvoiceModal(false);
      Alert.alert('Success', `Invoice ${invoice.invoiceNumber} created successfully!`);
    } else {
      Alert.alert('Error', 'Failed to create invoice');
    }
  };

  const handleDownloadInvoicePDF = async (invoice: any) => {
    try {
      setIsGeneratingPDF(true);
      const pdfUri = await generateInvoicePDF(invoice);
      await shareViaPDF(pdfUri, `Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailInvoice = async (invoice: any) => {
    try {
      setIsGeneratingPDF(true);
      const pdfUri = await generateInvoicePDF(invoice);
      const client = clients.find(c => c.id === invoice.clientId);
      
      await sendViaEmail(
        pdfUri,
        `Invoice-${invoice.invoiceNumber}.pdf`,
        client?.email || '',
        `Invoice ${invoice.invoiceNumber} from STR8 BUILD`,
        `Hi ${client?.name || 'there'},\n\nPlease find attached invoice ${invoice.invoiceNumber} for the amount of $${(invoice.amount * 1.15).toFixed(2)} (incl. GST).\n\nPayment is due by ${invoice.dueDate}.\n\nThank you for your business!\n\nBest regards,\nC.SAMU\nSTR8 BUILD`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send email. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Paid':
        return '#10B981';
      case 'Completed':
        return '#6B7280';
      case 'Pending':
      case 'Sent':
        return '#F59E0B';
      case 'Draft':
        return '#94A3B8';
      case 'Overdue':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  // Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearCalculator = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const calculateMaterial = () => {
    const length = parseFloat(materialCalc.length) || 0;
    const width = parseFloat(materialCalc.width) || 0;
    const height = parseFloat(materialCalc.height) || 0;
    const wastagePercent = parseFloat(materialCalc.wastage) || 0;

    if (length <= 0 || width <= 0 || height <= 0) {
      Alert.alert('Error', 'Please enter valid dimensions');
      return null;
    }

    const volume = length * width * height;
    const material = materials[materialCalc.materialType as keyof typeof materials];
    const baseQuantity = volume;
    const withWastage = baseQuantity * (1 + wastagePercent / 100);

    return {
      volume: volume.toFixed(3),
      baseQuantity: baseQuantity.toFixed(3),
      withWastage: withWastage.toFixed(3),
      material,
      wastageAmount: (withWastage - baseQuantity).toFixed(3)
    };
  };

  const renderClientsInvoices = () => (
    <ScrollView style={styles.clientsContainer} showsVerticalScrollIndicator={false}>
      {/* Quick Stats */}
      <GlassCard variant="cyan" style={styles.statsCard}>
        <Text style={styles.cardTitle}>Quick Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{clients.length}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{invoices.length}</Text>
            <Text style={styles.statLabel}>Total Invoices</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${invoices.filter(inv => inv.status === 'Sent').reduce((sum, inv) => sum + inv.amount, 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Outstanding</Text>
          </View>
        </View>
      </GlassCard>

      {/* Add Client Button */}
      <GlassCard variant="electric" style={styles.addClientCard}>
        <Pressable 
          style={styles.addClientButton}
          onPress={() => setShowAddClientModal(true)}
        >
          <Plus color="#3B82F6" size={24} />
          <Text style={styles.addClientText}>Add New Client</Text>
        </Pressable>
      </GlassCard>

      {/* Clients List */}
      <GlassCard variant="teal" style={styles.clientsListCard}>
        <Text style={styles.cardTitle}>Clients & Invoices</Text>
        
        {clients.length === 0 ? (
          <View style={styles.emptyState}>
            <Users color="#14B8A6" size={32} />
            <Text style={styles.emptyTitle}>No Clients Yet</Text>
            <Text style={styles.emptyDescription}>Add your first client to start managing invoices</Text>
          </View>
        ) : (
          <View style={styles.clientsList}>
            {clients.map((client) => {
              const clientInvoices = getClientInvoices(client.id);
              const unbilledAmount = getTotalUnbilledAmount(client.id);
              
              return (
                <View key={client.id} style={styles.clientItem}>
                  <Pressable 
                    style={styles.clientHeader}
                    onPress={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
                  >
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>{client.name}</Text>
                      <View style={styles.clientStats}>
                        <Text style={styles.clientStat}>{clientInvoices.length} invoices</Text>
                        <Text style={styles.clientStat}>•</Text>
                        <Text style={styles.clientStat}>${unbilledAmount.toFixed(0)} unbilled</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                      <Text style={styles.statusText}>{client.status}</Text>
                    </View>
                  </Pressable>
                  
                  {selectedClient?.id === client.id && (
                    <View style={styles.clientDetails}>
                      <View style={styles.contactInfo}>
                        {client.email && (
                          <View style={styles.contactRow}>
                            <Mail color="#94A3B8" size={14} />
                            <Text style={styles.contactText}>{client.email}</Text>
                          </View>
                        )}
                        {client.phone && (
                          <View style={styles.contactRow}>
                            <Phone color="#94A3B8" size={14} />
                            <Text style={styles.contactText}>{client.phone}</Text>
                          </View>
                        )}
                        {client.address && (
                          <View style={styles.contactRow}>
                            <MapPin color="#94A3B8" size={14} />
                            <Text style={styles.contactText}>{client.address}</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.clientActions}>
                        <Pressable 
                          style={styles.clientActionButton}
                          onPress={() => {
                            setSelectedClient(client);
                            setShowInvoiceModal(true);
                          }}
                        >
                          <Plus color="#10B981" size={16} />
                          <Text style={styles.clientActionText}>Create Invoice</Text>
                        </Pressable>
                        
                        <Pressable 
                          style={[styles.clientActionButton, styles.deleteClientButton]}
                          onPress={() => {
                            Alert.alert(
                              'Delete Client',
                              'Are you sure you want to delete this client?',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                  text: 'Delete', 
                                  style: 'destructive',
                                  onPress: () => {
                                    deleteClient(client.id);
                                    setSelectedClient(null);
                                  }
                                }
                              ]
                            );
                          }}
                        >
                          <Trash2 color="#EF4444" size={16} />
                          <Text style={[styles.clientActionText, { color: '#EF4444' }]}>Delete</Text>
                        </Pressable>
                      </View>
                      
                      {/* Client Invoices */}
                      {clientInvoices.length > 0 && (
                        <View style={styles.invoicesSection}>
                          <Text style={styles.invoicesSectionTitle}>Recent Invoices</Text>
                          {clientInvoices.slice(0, 3).map((invoice) => (
                            <View key={invoice.id} style={styles.invoiceItem}>
                              <View style={styles.invoiceInfo}>
                                <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
                                <Text style={styles.invoiceDate}>{invoice.date}</Text>
                              </View>
                              <View style={styles.invoiceAmount}>
                                <Text style={styles.invoiceAmountText}>${invoice.amount.toFixed(2)}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
                                  <Text style={styles.statusText}>{invoice.status}</Text>
                                </View>
                              </View>
                              <View style={styles.invoiceActions}>
                                <Pressable 
                                  style={styles.invoiceAction}
                                  onPress={() => setSelectedInvoice(invoice)}
                                >
                                  <Eye color="#94A3B8" size={14} />
                                </Pressable>
                                <Pressable 
                                  style={styles.invoiceAction}
                                  onPress={() => handleDownloadInvoicePDF(invoice)}
                                  disabled={isGeneratingPDF}
                                >
                                  <Download color="#94A3B8" size={14} />
                                </Pressable>
                                <Pressable 
                                  style={styles.invoiceAction}
                                  onPress={() => handleEmailInvoice(invoice)}
                                  disabled={isGeneratingPDF}
                                >
                                  <Send color="#94A3B8" size={14} />
                                </Pressable>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </GlassCard>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Client</Text>
              <Pressable onPress={() => setShowAddClientModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Client Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClient.name}
                  onChangeText={(text) => setNewClient(prev => ({ ...prev, name: text }))}
                  placeholder="Enter client name"
                  placeholderTextColor="#64748B"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClient.email}
                  onChangeText={(text) => setNewClient(prev => ({ ...prev, email: text }))}
                  placeholder="client@example.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClient.phone}
                  onChangeText={(text) => setNewClient(prev => ({ ...prev, phone: text }))}
                  placeholder="+64 27 123 4567"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newClient.address}
                  onChangeText={(text) => setNewClient(prev => ({ ...prev, address: text }))}
                  placeholder="Client address"
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
                <TextInput
                  style={styles.textInput}
                  value={newClient.hourlyRate}
                  onChangeText={(text) => setNewClient(prev => ({ ...prev, hourlyRate: text }))}
                  placeholder="85"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowAddClientModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddClient}
              >
                <Text style={styles.saveButtonText}>Add Client</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Create Invoice Modal */}
      {showInvoiceModal && selectedClient && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Invoice for {selectedClient.name}</Text>
              <Pressable onPress={() => setShowInvoiceModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Select Unbilled Time Entries</Text>
              
              {getUnbilledTimesheets(selectedClient.id).length === 0 ? (
                <Text style={styles.emptyDescription}>No unbilled time entries available</Text>
              ) : (
                <View style={styles.timesheetSelection}>
                  {getUnbilledTimesheets(selectedClient.id).map((entry) => (
                    <Pressable
                      key={entry.id}
                      style={[
                        styles.timesheetSelectItem,
                        selectedTimesheets.includes(entry.id) && styles.selectedTimesheetItem
                      ]}
                      onPress={() => {
                        if (selectedTimesheets.includes(entry.id)) {
                          setSelectedTimesheets(prev => prev.filter(id => id !== entry.id));
                        } else {
                          setSelectedTimesheets(prev => [...prev, entry.id]);
                        }
                      }}
                    >
                      <View style={styles.timesheetSelectInfo}>
                        <Text style={styles.timesheetSelectProject}>{entry.projectName}</Text>
                        <Text style={styles.timesheetSelectDate}>{entry.date}</Text>
                        <Text style={styles.timesheetSelectDescription}>{entry.description}</Text>
                      </View>
                      <View style={styles.timesheetSelectAmount}>
                        <Text style={styles.timesheetSelectHours}>{entry.hours}h</Text>
                        <Text style={styles.timesheetSelectPrice}>${(entry.hours * entry.rate).toFixed(2)}</Text>
                      </View>
                      {selectedTimesheets.includes(entry.id) && (
                        <Check color="#10B981" size={20} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={invoiceNotes}
                  onChangeText={setInvoiceNotes}
                  placeholder="Add any notes for this invoice..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowInvoiceModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleCreateInvoice}
              >
                <Text style={styles.saveButtonText}>Create Invoice</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice #{selectedInvoice.invoiceNumber}</Text>
              <Pressable onPress={() => setSelectedInvoice(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.invoiceDetail}>
              <GlassCard variant="electric" style={styles.invoiceDetailCard}>
                <View style={styles.invoiceDetailHeader}>
                  <Text style={styles.invoiceDetailClient}>{selectedInvoice.clientName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedInvoice.status) }]}>
                    <Text style={styles.statusText}>{selectedInvoice.status}</Text>
                  </View>
                </View>
                
                <View style={styles.invoiceDetailInfo}>
                  <View style={styles.invoiceDetailRow}>
                    <Text style={styles.invoiceDetailLabel}>Date:</Text>
                    <Text style={styles.invoiceDetailValue}>{selectedInvoice.date}</Text>
                  </View>
                  <View style={styles.invoiceDetailRow}>
                    <Text style={styles.invoiceDetailLabel}>Due Date:</Text>
                    <Text style={styles.invoiceDetailValue}>{selectedInvoice.dueDate}</Text>
                  </View>
                  <View style={styles.invoiceDetailRow}>
                    <Text style={styles.invoiceDetailLabel}>Total Amount:</Text>
                    <Text style={styles.invoiceDetailAmount}>${selectedInvoice.amount.toFixed(2)}</Text>
                  </View>
                </View>
                
                <Text style={styles.invoiceItemsTitle}>Items:</Text>
                {selectedInvoice.items.map((item: any, index: number) => (
                  <View key={index} style={styles.invoiceItem}>
                    <Text style={styles.invoiceItemDescription}>{item.description}</Text>
                    <View style={styles.invoiceItemDetails}>
                      <Text style={styles.invoiceItemHours}>{item.hours}h × ${item.rate}</Text>
                      <Text style={styles.invoiceItemAmount}>${item.amount.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
              </GlassCard>
              
              <View style={styles.invoiceDetailActions}>
                <Pressable 
                  style={[styles.actionButton, styles.markPaidButton]}
                  onPress={() => {
                    updateInvoice(selectedInvoice.id, { status: 'Paid' });
                    setSelectedInvoice({ ...selectedInvoice, status: 'Paid' });
                    Alert.alert('Success', 'Invoice marked as paid');
                  }}
                >
                  <Check color="#FFF" size={16} />
                  <Text style={styles.actionButtonText}>Mark as Paid</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionButton, styles.downloadButton]}
                  onPress={() => handleDownloadInvoicePDF(selectedInvoice)}
                  disabled={isGeneratingPDF}
                >
                  <Download color="#FFF" size={16} />
                  <Text style={styles.actionButtonText}>
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderCalculator = () => (
    <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
      {/* Basic Calculator */}
      <GlassCard variant="electric" style={styles.calculatorCard}>
        <Text style={styles.cardTitle}>Basic Calculator</Text>
        
        <View style={styles.calculatorDisplay}>
          <Text style={styles.displayText}>{display}</Text>
        </View>
        
        <View style={styles.calculatorButtons}>
          <View style={styles.buttonRow}>
            <Pressable style={[styles.calcButton, styles.clearButton]} onPress={clearCalculator}>
              <Text style={styles.clearButtonText}>C</Text>
            </Pressable>
            <Pressable style={[styles.calcButton, styles.operatorButton]} onPress={() => inputOperation('/')}>
              <Divide color="#FFF" size={20} />
            </Pressable>
            <Pressable style={[styles.calcButton, styles.operatorButton]} onPress={() => inputOperation('*')}>
              <X color="#FFF" size={20} />
            </Pressable>
            <Pressable style={[styles.calcButton, styles.operatorButton]} onPress={() => inputOperation('-')}>
              <Minus color="#FFF" size={20} />
            </Pressable>
          </View>
          
          <View style={styles.buttonRow}>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('7')}>
              <Text style={styles.buttonText}>7</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('8')}>
              <Text style={styles.buttonText}>8</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('9')}>
              <Text style={styles.buttonText}>9</Text>
            </Pressable>
            <Pressable style={[styles.calcButton, styles.operatorButton]} onPress={() => inputOperation('+')}>
              <Plus color="#FFF" size={20} />
            </Pressable>
          </View>
          
          <View style={styles.buttonRow}>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('4')}>
              <Text style={styles.buttonText}>4</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('5')}>
              <Text style={styles.buttonText}>5</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('6')}>
              <Text style={styles.buttonText}>6</Text>
            </Pressable>
            <Pressable style={[styles.calcButton, styles.equalsButton]} onPress={performCalculation} rowSpan={2}>
              <Equal color="#FFF" size={20} />
            </Pressable>
          </View>
          
          <View style={styles.buttonRow}>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('1')}>
              <Text style={styles.buttonText}>1</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('2')}>
              <Text style={styles.buttonText}>2</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('3')}>
              <Text style={styles.buttonText}>3</Text>
            </Pressable>
          </View>
          
          <View style={styles.buttonRow}>
            <Pressable style={[styles.calcButton, styles.zeroButton]} onPress={() => inputNumber('0')}>
              <Text style={styles.buttonText}>0</Text>
            </Pressable>
            <Pressable style={styles.calcButton} onPress={() => inputNumber('.')}>
              <Text style={styles.buttonText}>.</Text>
            </Pressable>
          </View>
        </View>
      </GlassCard>

      {/* Material Calculator */}
      <GlassCard variant="teal" style={styles.materialCard}>
        <Text style={styles.cardTitle}>Material Calculator</Text>
        
        <View style={styles.materialForm}>
          <View style={styles.dimensionsRow}>
            <View style={styles.dimensionInput}>
              <Text style={styles.inputLabel}>Length (m)</Text>
              <TextInput
                style={styles.textInput}
                value={materialCalc.length}
                onChangeText={(text) => setMaterialCalc(prev => ({ ...prev, length: text }))}
                placeholder="0.0"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.dimensionInput}>
              <Text style={styles.inputLabel}>Width (m)</Text>
              <TextInput
                style={styles.textInput}
                value={materialCalc.width}
                onChangeText={(text) => setMaterialCalc(prev => ({ ...prev, width: text }))}
                placeholder="0.0"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.dimensionInput}>
              <Text style={styles.inputLabel}>Height (m)</Text>
              <TextInput
                style={styles.textInput}
                value={materialCalc.height}
                onChangeText={(text) => setMaterialCalc(prev => ({ ...prev, height: text }))}
                placeholder="0.0"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.materialTypeRow}>
            <View style={styles.materialTypeContainer}>
              <Text style={styles.inputLabel}>Material Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(materials).map(([key, material]) => (
                  <Pressable
                    key={key}
                    style={[
                      styles.materialTypeButton,
                      materialCalc.materialType === key && styles.selectedMaterialType
                    ]}
                    onPress={() => setMaterialCalc(prev => ({ ...prev, materialType: key }))}
                  >
                    <Text style={[
                      styles.materialTypeText,
                      materialCalc.materialType === key && styles.selectedMaterialTypeText
                    ]}>
                      {material.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.wastageContainer}>
              <Text style={styles.inputLabel}>Wastage (%)</Text>
              <TextInput
                style={styles.textInput}
                value={materialCalc.wastage}
                onChangeText={(text) => setMaterialCalc(prev => ({ ...prev, wastage: text }))}
                placeholder="10"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        
        {(() => {
          const result = calculateMaterial();
          return result ? (
            <View style={styles.materialResults}>
              <Text style={styles.resultsTitle}>Calculation Results</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Volume:</Text>
                <Text style={styles.resultValue}>{result.volume} {result.material.unit}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Base Quantity:</Text>
                <Text style={styles.resultValue}>{result.baseQuantity} {result.material.unit}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Wastage Amount:</Text>
                <Text style={styles.resultValue}>{result.wastageAmount} {result.material.unit}</Text>
              </View>
              <View style={[styles.resultRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Required:</Text>
                <Text style={styles.totalValue}>{result.withWastage} {result.material.unit}</Text>
              </View>
            </View>
          ) : null;
        })()}
      </GlassCard>
    </ScrollView>
  );

  const renderConverter = () => (
    <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
      <GlassCard variant="purple" style={styles.converterCard}>
        <Text style={styles.cardTitle}>Unit Converter</Text>
        <Text style={styles.comingSoon}>Unit conversion tools coming soon...</Text>
        <Text style={styles.comingSoonDesc}>
          Convert between metric and imperial units for construction measurements
        </Text>
      </GlassCard>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Tools</Text>
        </View>
        
        <View style={styles.tabBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabBar}
            contentContainerStyle={styles.tabBarContent}
          >
            <Pressable
              style={[styles.tab, activeTab === 'weather' && styles.activeTab]}
              onPress={() => setActiveTab('weather')}
            >
              <View style={styles.tabIcon}>
                <CloudRain color={activeTab === 'weather' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'weather' && styles.activeTabText]}>Weather</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'timer' && styles.activeTab]}
              onPress={() => setActiveTab('timer')}
            >
              <View style={styles.tabIcon}>
                <Clock color={activeTab === 'timer' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'timer' && styles.activeTabText]}>Timer</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'voice' && styles.activeTab]}
              onPress={() => setActiveTab('voice')}
            >
              <View style={styles.tabIcon}>
                <Mic color={activeTab === 'voice' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'voice' && styles.activeTabText]}>Voice</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
              onPress={() => setActiveTab('photos')}
            >
              <View style={styles.tabIcon}>
                <Camera color={activeTab === 'photos' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
              onPress={() => setActiveTab('expenses')}
            >
              <View style={styles.tabIcon}>
                <DollarSign color={activeTab === 'expenses' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>Expenses</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'cashflow' && styles.activeTab]}
              onPress={() => setActiveTab('cashflow')}
            >
              <View style={styles.tabIcon}>
                <TrendingUp color={activeTab === 'cashflow' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'cashflow' && styles.activeTabText]}>Cash Flow</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <View style={styles.tabIcon}>
                <Trophy color={activeTab === 'achievements' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>Achievements</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'clients' && styles.activeTab]}
              onPress={() => setActiveTab('clients')}
            >
              <View style={styles.tabIcon}>
                <Users color={activeTab === 'clients' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'clients' && styles.activeTabText]}>Clients</Text>
            </Pressable>

            <Pressable
              style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
              onPress={() => setActiveTab('calculator')}
            >
              <View style={styles.tabIcon}>
                <Calculator color={activeTab === 'calculator' ? '#FFF' : '#94A3B8'} size={20} />
              </View>
              <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>Calculator</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'weather' && <TradeWeatherImpact />}
          {activeTab === 'timer' && <QuickWinTimer />}
          {activeTab === 'voice' && <VoiceRecorder />}
          {activeTab === 'photos' && <PhotoDocumentation />}
          {activeTab === 'expenses' && <ExpenseTracker />}
          {activeTab === 'cashflow' && <CashFlowPredictor />}
          {activeTab === 'achievements' && <AchievementSystem />}
          {activeTab === 'clients' && renderClientsInvoices()}
          {activeTab === 'calculator' && renderCalculator()}
          {activeTab === 'converter' && renderConverter()}
        </View>
      </View>
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
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  tabBarContainer: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBar: {
    maxHeight: 80,
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 85,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabContent: {
    flex: 1,
  },
  calculatorContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calculatorCard: {
    marginVertical: 0,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 20,
  },
  calculatorDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  calculatorButtons: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  calcButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  clearButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#EF4444',
  },
  clearButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  operatorButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: '#3B82F6',
  },
  equalsButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: '#10B981',
  },
  zeroButton: {
    flex: 2,
  },
  materialCard: {
    marginVertical: 0,
    marginBottom: 20,
  },
  materialForm: {
    marginBottom: 20,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dimensionInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  materialTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  materialTypeContainer: {
    flex: 2,
  },
  materialTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedMaterialType: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  materialTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  selectedMaterialTypeText: {
    color: '#FFF',
  },
  wastageContainer: {
    flex: 1,
  },
  materialResults: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  resultValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(20, 184, 166, 0.3)',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#14B8A6',
  },
  converterContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  converterCard: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 40,
  },
  comingSoon: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginTop: 20,
    marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  clientsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsCard: {
    marginVertical: 0,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  addClientCard: {
    marginVertical: 0,
    marginBottom: 16,
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  addClientText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  clientsListCard: {
    marginVertical: 0,
    flex: 1,
  },
  clientsList: {
    gap: 12,
  },
  clientItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  clientStats: {
    flexDirection: 'row',
    gap: 8,
  },
  clientStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  clientDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  contactInfo: {
    gap: 8,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  clientActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 6,
  },
  deleteClientButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  clientActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  invoicesSection: {
    gap: 8,
  },
  invoicesSectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  invoiceDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  invoiceAmount: {
    alignItems: 'flex-end',
  },
  invoiceAmountText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  invoiceAction: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1a1b3a',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    flex: 1,
  },
  formContainer: {
    maxHeight: 400,
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
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#06B6D4',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  timesheetSelection: {
    gap: 8,
    marginBottom: 16,
  },
  timesheetSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 12,
  },
  selectedTimesheetItem: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  timesheetSelectInfo: {
    flex: 1,
  },
  timesheetSelectProject: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  timesheetSelectDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  timesheetSelectDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  timesheetSelectAmount: {
    alignItems: 'flex-end',
  },
  timesheetSelectHours: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  timesheetSelectPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginTop: 2,
  },
  invoiceDetail: {
    flex: 1,
  },
  invoiceDetailCard: {
    marginVertical: 0,
    marginBottom: 16,
  },
  invoiceDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceDetailClient: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  invoiceDetailInfo: {
    gap: 8,
    marginBottom: 16,
  },
  invoiceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceDetailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceDetailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  invoiceDetailAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  invoiceItemsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  invoiceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  invoiceItemDescription: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 4,
  },
  invoiceItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceItemHours: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceItemAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  invoiceDetailActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  markPaidButton: {
    backgroundColor: '#10B981',
  },
  downloadButton: {
    backgroundColor: '#06B6D4',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});