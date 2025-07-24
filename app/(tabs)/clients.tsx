import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Phone, Mail, MapPin, Building, Users, FileText, Clock, DollarSign, Calendar, Eye, Send, Download, X, ChevronRight, Timer, Receipt, Check, Trash2, CreditCard as Edit3 } from 'lucide-react-native';
import { useAppData } from '@/hooks/useAppData';
import { generateInvoicePDF, generateTimesheetPDF, shareViaPDF, sendViaEmail } from '@/utils/pdfGenerator';

export default function Clients() {
  const {
    clients,
    addClient,
    deleteClient,
    getClientInvoices,
    getClientTimesheets,
    getUnbilledTimesheets,
    getTotalUnbilledHours,
    getTotalUnbilledAmount,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  } = useAppData();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'timesheets'>('overview');
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

  const handleDeleteClient = (clientId: string) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteClient(clientId);
            if (selectedClient?.id === clientId) {
              setSelectedClient(null);
            }
            Alert.alert('Success', 'Client deleted successfully');
          }
        }
      ]
    );
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

  const handleUpdateInvoiceStatus = (invoiceId: string, status: string) => {
    updateInvoice(invoiceId, { status: status as any });
    Alert.alert('Success', `Invoice status updated to ${status}`);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteInvoice(invoiceId);
            Alert.alert('Success', 'Invoice deleted successfully');
          }
        }
      ]
    );
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

  const handleDownloadTimesheetPDF = async (clientId: string) => {
    try {
      setIsGeneratingPDF(true);
      const client = clients.find(c => c.id === clientId);
      const clientTimesheets = getClientTimesheets(clientId);
      
      if (!client || clientTimesheets.length === 0) {
        Alert.alert('Error', 'No timesheet data available');
        return;
      }

      const pdfUri = await generateTimesheetPDF(
        clientTimesheets, 
        client, 
        'All Time Entries'
      );
      await shareViaPDF(pdfUri, `Timesheet-${client.name.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate timesheet PDF. Please try again.');
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

  const renderClientCard = (client: any) => (
    <GlassCard key={client.id} variant="cyan" style={styles.clientCard}>
      <Pressable onPress={() => setSelectedClient(client)}>
        <View style={styles.clientHeader}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{client.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
              <Text style={styles.statusText}>{client.status}</Text>
            </View>
          </View>
          <ChevronRight color="#94A3B8" size={20} />
        </View>
        
        <View style={styles.clientStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{client.projectCount}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{getTotalUnbilledHours(client.id)}</Text>
            <Text style={styles.statLabel}>Unbilled Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${getTotalUnbilledAmount(client.id).toFixed(0)}</Text>
            <Text style={styles.statLabel}>Unbilled Amount</Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <Pressable style={styles.actionButton} onPress={() => {
            setSelectedClient(client);
            setActiveTab('invoices');
          }}>
            <FileText color="#3B82F6" size={16} />
            <Text style={styles.actionText}>Invoices</Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={() => {
            setSelectedClient(client);
            setActiveTab('timesheets');
          }}>
            <Clock color="#10B981" size={16} />
            <Text style={styles.actionText}>Timesheets</Text>
          </Pressable>
          
          <Pressable 
            style={styles.actionButton}
            onPress={() => {
              setSelectedClient(client);
              setActiveTab('timesheets');
              setShowInvoiceModal(true);
            }}
          >
            <DollarSign color="#F59E0B" size={16} />
            <Text style={styles.actionText}>Bill</Text>
          </Pressable>
        </View>
      </Pressable>
    </GlassCard>
  );

  const renderInvoicesList = () => {
    const clientInvoices = selectedClient ? getClientInvoices(selectedClient.id) : [];
    
    return (
      <View style={styles.invoicesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Invoices</Text>
          <Pressable 
            style={styles.addButton} 
            onPress={() => setShowInvoiceModal(true)}
          >
            <Plus color="#FFF" size={16} />
            <Text style={styles.addButtonText}>New Invoice</Text>
          </Pressable>
        </View>
        
        {clientInvoices.length === 0 ? (
          <GlassCard variant="electric" style={styles.emptyState}>
            <Receipt color="#3B82F6" size={32} />
            <Text style={styles.emptyTitle}>No Invoices</Text>
            <Text style={styles.emptyDescription}>Create your first invoice for this client</Text>
          </GlassCard>
        ) : (
          <View style={styles.invoicesList}>
            {clientInvoices.map((invoice) => (
              <GlassCard key={invoice.id} variant="electric" style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View>
                    <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
                    <Text style={styles.invoiceDate}>{invoice.date}</Text>
                  </View>
                  <View style={styles.invoiceAmount}>
                    <Text style={styles.amountText}>${invoice.amount.toFixed(2)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
                      <Text style={styles.statusText}>{invoice.status}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.invoiceActions}>
                  <Pressable 
                    style={styles.invoiceAction}
                    onPress={() => setSelectedInvoice(invoice)}
                  >
                    <Eye color="#94A3B8" size={16} />
                    <Text style={styles.actionText}>View</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.invoiceAction}
                    onPress={() => handleEmailInvoice(invoice)}
                    disabled={isGeneratingPDF}
                  >
                    <Send color="#94A3B8" size={16} />
                    <Text style={styles.actionText}>Email</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.invoiceAction}
                    onPress={() => handleDownloadInvoicePDF(invoice)}
                    disabled={isGeneratingPDF}
                  >
                    <Download color="#94A3B8" size={16} />
                    <Text style={styles.actionText}>PDF</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.invoiceAction}
                    onPress={() => handleDeleteInvoice(invoice.id)}
                  >
                    <Trash2 color="#EF4444" size={16} />
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                  </Pressable>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTimesheetsList = () => {
    const clientTimesheets = selectedClient ? getClientTimesheets(selectedClient.id) : [];
    
    return (
      <View style={styles.timesheetsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Timesheets</Text>
          <View style={styles.timesheetStats}>
            <Pressable 
              style={styles.downloadButton}
              onPress={() => selectedClient && handleDownloadTimesheetPDF(selectedClient.id)}
              disabled={isGeneratingPDF}
            >
              <Download color="#14B8A6" size={16} />
              <Text style={styles.downloadButtonText}>PDF</Text>
            </Pressable>
          </View>
        </View>
        
        {clientTimesheets.length === 0 ? (
          <GlassCard variant="teal" style={styles.emptyState}>
            <Timer color="#14B8A6" size={32} />
            <Text style={styles.emptyTitle}>No Time Entries</Text>
            <Text style={styles.emptyDescription}>Time entries will appear here when you use the job timer</Text>
          </GlassCard>
        ) : (
          <View style={styles.timesheetsList}>
            {clientTimesheets.map((entry) => (
              <GlassCard key={entry.id} variant="teal" style={styles.timesheetCard}>
                <View style={styles.timesheetHeader}>
                  <View>
                    <Text style={styles.projectName}>{entry.projectName}</Text>
                    <Text style={styles.timesheetDate}>{entry.date}</Text>
                  </View>
                  <View style={styles.timesheetAmount}>
                    <Text style={styles.hoursText}>{entry.hours}h</Text>
                    <Text style={styles.amountText}>${(entry.hours * entry.rate).toFixed(2)}</Text>
                  </View>
                </View>
                
                <Text style={styles.timesheetDescription}>{entry.description}</Text>
                
                <View style={styles.timesheetFooter}>
                  <Text style={styles.timeRange}>{entry.startTime} - {entry.endTime}</Text>
                  <View style={[
                    styles.invoiceStatus,
                    { backgroundColor: entry.invoiced ? '#10B981' : '#F59E0B' }
                  ]}>
                    <Text style={styles.invoiceStatusText}>
                      {entry.invoiced ? 'Invoiced' : 'Unbilled'}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Clients</Text>
          <Pressable style={styles.addButton} onPress={() => setShowAddClientModal(true)}>
            <Plus color="#FFF" size={20} />
          </Pressable>
        </View>
        
        {clients.length === 0 ? (
          <GlassCard variant="cyan" style={styles.emptyState}>
            <Users color="#06B6D4" size={48} />
            <Text style={styles.emptyTitle}>No Clients Yet</Text>
            <Text style={styles.emptyDescription}>
              Start by adding your first client to track projects, invoices, and timesheets.
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.clientsList}>
            {clients.map(renderClientCard)}
          </View>
        )}
      </ScrollView>

      {/* Client Detail Modal */}
      <Modal
        visible={selectedClient !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedClient(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedClient?.name}</Text>
              <Pressable onPress={() => setSelectedClient(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <View style={styles.tabBar}>
              <Pressable 
                style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                onPress={() => setActiveTab('overview')}
              >
                <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                  Overview
                </Text>
              </Pressable>
              <Pressable 
                style={[styles.tab, activeTab === 'invoices' && styles.activeTab]}
                onPress={() => setActiveTab('invoices')}
              >
                <Text style={[styles.tabText, activeTab === 'invoices' && styles.activeTabText]}>
                  Invoices
                </Text>
              </Pressable>
              <Pressable 
                style={[styles.tab, activeTab === 'timesheets' && styles.activeTab]}
                onPress={() => setActiveTab('timesheets')}
              >
                <Text style={[styles.tabText, activeTab === 'timesheets' && styles.activeTabText]}>
                  Timesheets
                </Text>
              </Pressable>
            </View>
            
            <ScrollView style={styles.tabContent}>
              {activeTab === 'overview' && selectedClient && (
                <View style={styles.overviewContent}>
                  <GlassCard variant="cyan" style={styles.contactCard}>
                    <Text style={styles.cardTitle}>Contact Information</Text>
                    <View style={styles.contactDetails}>
                      <View style={styles.contactRow}>
                        <Mail color="#94A3B8" size={16} />
                        <Text style={styles.contactText}>{selectedClient.email || 'No email'}</Text>
                      </View>
                      <View style={styles.contactRow}>
                        <Phone color="#94A3B8" size={16} />
                        <Text style={styles.contactText}>{selectedClient.phone || 'No phone'}</Text>
                      </View>
                      <View style={styles.contactRow}>
                        <MapPin color="#94A3B8" size={16} />
                        <Text style={styles.contactText}>{selectedClient.address || 'No address'}</Text>
                      </View>
                    </View>
                  </GlassCard>
                  
                  <GlassCard variant="electric" style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>Financial Summary</Text>
                    <View style={styles.summaryGrid}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>${selectedClient.totalBilled.toLocaleString()}</Text>
                        <Text style={styles.summaryLabel}>Total Billed</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>${getTotalUnbilledAmount(selectedClient.id).toFixed(0)}</Text>
                        <Text style={styles.summaryLabel}>Unbilled Amount</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{getTotalUnbilledHours(selectedClient.id)}</Text>
                        <Text style={styles.summaryLabel}>Unbilled Hours</Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>${selectedClient.hourlyRate}</Text>
                        <Text style={styles.summaryLabel}>Hourly Rate</Text>
                      </View>
                    </View>
                  </GlassCard>
                </View>
              )}
              
              {activeTab === 'invoices' && renderInvoicesList()}
              {activeTab === 'timesheets' && renderTimesheetsList()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Client Modal */}
      <Modal
        visible={showAddClientModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddClientModal(false)}
      >
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
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        visible={showInvoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInvoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Invoice</Text>
              <Pressable onPress={() => setShowInvoiceModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Select Unbilled Time Entries</Text>
              
              {selectedClient && getUnbilledTimesheets(selectedClient.id).length === 0 ? (
                <Text style={styles.emptyDescription}>No unbilled time entries available</Text>
              ) : (
                <View style={styles.timesheetSelection}>
                  {selectedClient && getUnbilledTimesheets(selectedClient.id).map((entry) => (
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
      </Modal>

      {/* Invoice Detail Modal */}
      <Modal
        visible={selectedInvoice !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedInvoice(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice #{selectedInvoice?.invoiceNumber}</Text>
              <Pressable onPress={() => setSelectedInvoice(null)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>
            
            {selectedInvoice && (
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
                  
                  {selectedInvoice.notes && (
                    <View style={styles.invoiceNotes}>
                      <Text style={styles.invoiceNotesTitle}>Notes:</Text>
                      <Text style={styles.invoiceNotesText}>{selectedInvoice.notes}</Text>
                    </View>
                  )}
                </GlassCard>
                
                <View style={styles.invoiceActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.markPaidButton]}
                    onPress={() => {
                      handleUpdateInvoiceStatus(selectedInvoice.id, 'Paid');
                      setSelectedInvoice(null);
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
                  
                  <Pressable 
                    style={[styles.actionButton, styles.emailButton]}
                    onPress={() => handleEmailInvoice(selectedInvoice)}
                    disabled={isGeneratingPDF}
                  >
                    <Send color="#FFF" size={16} />
                    <Text style={styles.actionButtonText}>Email PDF</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      handleDeleteInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                  >
                    <Trash2 color="#FFF" size={16} />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
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
  addButton: {
    backgroundColor: '#06B6D4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  clientsList: {
    gap: 16,
  },
  clientCard: {
    marginVertical: 0,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  clientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  statItem: {
    alignItems: 'center',
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  emptyState: {
    marginVertical: 0,
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabContent: {
    flex: 1,
  },
  overviewContent: {
    gap: 16,
  },
  contactCard: {
    marginVertical: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  contactDetails: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    flex: 1,
  },
  summaryCard: {
    marginVertical: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  invoicesContainer: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  invoicesList: {
    gap: 12,
  },
  invoiceCard: {
    marginVertical: 0,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 16,
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
  amountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  invoiceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  invoiceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timesheetsContainer: {
    gap: 16,
  },
  timesheetStats: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  timesheetsList: {
    gap: 12,
  },
  timesheetCard: {
    marginVertical: 0,
  },
  timesheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  timesheetDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  timesheetAmount: {
    alignItems: 'flex-end',
  },
  hoursText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  timesheetDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 12,
  },
  timesheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  timeRange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invoiceStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    backgroundColor: '#06B6D4',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  timesheetSelection: {
    gap: 12,
    marginBottom: 20,
  },
  timesheetSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  timesheetSelectAmount: {
    alignItems: 'flex-end',
  },
  timesheetSelectHours: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  timesheetSelectPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginTop: 2,
  },
  invoiceDetail: {
    flex: 1,
  },
  invoiceDetailCard: {
    marginVertical: 0,
    marginBottom: 20,
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
    marginBottom: 20,
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  invoiceItemsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  invoiceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  invoiceItemDescription: {
    fontSize: 14,
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
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceItemAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  invoiceNotes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  invoiceNotesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  invoiceNotesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
  markPaidButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  downloadButton: {
    backgroundColor: '#06B6D4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#14B8A6',
  },
  emailButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginLeft: 8,
  },
});