import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { DollarSign, Plus, Download, Send, Clock, CheckCircle, X, Calendar } from 'lucide-react-native';

interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
}

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      clientName: 'Auckland Properties Ltd',
      projectName: 'Kitchen Renovation',
      amount: 12500,
      status: 'paid',
      date: '2025-09-15',
      dueDate: '2025-10-15',
    },
    {
      id: 'INV-002',
      clientName: 'Bay Commercial',
      projectName: 'Office Fit-out',
      amount: 28750,
      status: 'sent',
      date: '2025-09-28',
      dueDate: '2025-10-28',
    },
    {
      id: 'INV-003',
      clientName: 'Residential Build Co',
      projectName: 'Bathroom Remodel',
      amount: 8900,
      status: 'draft',
      date: '2025-10-01',
      dueDate: '2025-11-01',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    projectName: '',
    amount: '',
    dueDate: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'sent':
        return '#3B82F6';
      case 'overdue':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle color="#10B981" size={16} />;
      case 'sent':
        return <Send color="#3B82F6" size={16} />;
      case 'overdue':
        return <Clock color="#EF4444" size={16} />;
      default:
        return <Clock color="#94A3B8" size={16} />;
    }
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.projectName || !newInvoice.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const invoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: newInvoice.clientName,
      projectName: newInvoice.projectName,
      amount: parseFloat(newInvoice.amount),
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setInvoices([invoice, ...invoices]);
    setNewInvoice({ clientName: '', projectName: '', amount: '', dueDate: '' });
    setShowCreateModal(false);
    Alert.alert('Success', 'Invoice created successfully!');
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const draftAmount = invoices
    .filter(inv => inv.status === 'draft')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Finance & Invoicing</Text>
            <Text style={styles.subtitle}>Manage your invoices and payments</Text>
          </View>
          <Pressable style={styles.createButton} onPress={() => setShowCreateModal(true)}>
            <Plus color="#FFF" size={20} />
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statIcon}>
              <CheckCircle color="#10B981" size={24} />
            </View>
            <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock color="#3B82F6" size={24} />
            </View>
            <Text style={styles.statValue}>${pendingAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign color="#94A3B8" size={24} />
            </View>
            <Text style={styles.statValue}>${draftAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Draft</Text>
          </GlassCard>
        </View>

        <GlassCard variant="default" style={styles.invoiceList}>
          <Text style={styles.sectionTitle}>Recent Invoices</Text>

          {invoices.map((invoice) => (
            <Pressable
              key={invoice.id}
              style={styles.invoiceItem}
              onPress={() => Alert.alert(invoice.id, `Client: ${invoice.clientName}\nProject: ${invoice.projectName}\nAmount: $${invoice.amount.toLocaleString()}\nStatus: ${invoice.status.toUpperCase()}`)}
            >
              <View style={styles.invoiceLeft}>
                <Text style={styles.invoiceId}>{invoice.id}</Text>
                <Text style={styles.invoiceClient}>{invoice.clientName}</Text>
                <Text style={styles.invoiceProject}>{invoice.projectName}</Text>
              </View>

              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</Text>
                <View style={styles.statusBadge}>
                  {getStatusIcon(invoice.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                    {invoice.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </GlassCard>

        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6' }]}
            onPress={() => Alert.alert('Export', 'Export to PDF coming soon!')}
          >
            <Download color="#3B82F6" size={20} />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Export All</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981' }]}
            onPress={() => Alert.alert('Send', 'Send invoices coming soon!')}
          >
            <Send color="#10B981" size={20} />
            <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Send Batch</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Invoice</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Client Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvoice.clientName}
                  onChangeText={(text) => setNewInvoice(prev => ({ ...prev, clientName: text }))}
                  placeholder="Enter client name"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvoice.projectName}
                  onChangeText={(text) => setNewInvoice(prev => ({ ...prev, projectName: text }))}
                  placeholder="Enter project name"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount (NZD) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvoice.amount}
                  onChangeText={(text) => setNewInvoice(prev => ({ ...prev, amount: text }))}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Due Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvoice.dueDate}
                  onChangeText={(text) => setNewInvoice(prev => ({ ...prev, dueDate: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#64748B"
                />
                <Text style={styles.inputHint}>Leave blank for 30 days from today</Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
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
  createButton: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceList: {
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  invoiceLeft: {
    flex: 1,
  },
  invoiceId: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  invoiceClient: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginBottom: 2,
  },
  invoiceProject: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 8,
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
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});
