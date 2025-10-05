import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Image } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { DollarSign, Camera, Receipt, Plus, TrendingUp, TrendingDown, X, Check } from 'lucide-react-native';

interface Expense {
  id: string;
  amount: number;
  category: string;
  vendor: string;
  project: string;
  date: Date;
  receiptUrl?: string;
  description: string;
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 450,
      category: 'Materials',
      vendor: 'Bunnings',
      project: 'Kitchen Renovation',
      date: new Date(2025, 9, 1),
      receiptUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
      description: 'Timber studs and plywood',
    },
    {
      id: '2',
      amount: 1200,
      category: 'Subcontractor',
      vendor: 'ABC Electrical',
      project: 'Office Fit-out',
      date: new Date(2025, 9, 3),
      description: 'Electrical rough-in labor',
    },
    {
      id: '3',
      amount: 85,
      category: 'Fuel',
      vendor: 'Z Energy',
      project: 'Multiple',
      date: new Date(2025, 9, 4),
      description: 'Fuel for work vehicles',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Materials',
    vendor: '',
    project: '',
    description: '',
  });
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const categories = ['Materials', 'Subcontractor', 'Fuel', 'Tools', 'Equipment', 'Other'];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses
    .filter(exp => exp.date.getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);
  const lastMonthExpenses = 1450;
  const percentChange = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1);

  const expensesByCategory = categories.map(cat => ({
    category: cat,
    amount: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
  })).filter(item => item.amount > 0);

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.vendor || !newExpense.project) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      vendor: newExpense.vendor,
      project: newExpense.project,
      date: new Date(),
      description: newExpense.description,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      amount: '',
      category: 'Materials',
      vendor: '',
      project: '',
      description: '',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Expense added successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Expense Tracking</Text>
            <Text style={styles.subtitle}>Track and manage expenses</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Plus color="#FFF" size={24} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <GlassCard variant="default" style={styles.statCard}>
            <DollarSign color="#EF4444" size={24} />
            <Text style={styles.statValue}>${thisMonthExpenses.toLocaleString()}</Text>
            <Text style={styles.statLabel}>This Month</Text>
            <View style={styles.changeIndicator}>
              {parseFloat(percentChange) >= 0 ? (
                <TrendingUp color="#EF4444" size={14} />
              ) : (
                <TrendingDown color="#10B981" size={14} />
              )}
              <Text style={[
                styles.changeText,
                { color: parseFloat(percentChange) >= 0 ? '#EF4444' : '#10B981' }
              ]}>
                {Math.abs(parseFloat(percentChange))}%
              </Text>
            </View>
          </GlassCard>

          <GlassCard variant="default" style={styles.statCard}>
            <Receipt color="#3B82F6" size={24} />
            <Text style={styles.statValue}>{expenses.length}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </GlassCard>
        </View>

        <GlassCard variant="default" style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>Spending by Category</Text>
          {expensesByCategory.map((item) => {
            const percentage = (item.amount / thisMonthExpenses * 100).toFixed(0);
            return (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>${item.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
            );
          })}
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.map((expense) => (
            <Pressable
              key={expense.id}
              style={styles.expenseCard}
              onPress={() => expense.receiptUrl && setSelectedReceipt(expense.receiptUrl)}
            >
              <GlassCard variant="default" style={styles.expenseCardInner}>
                <View style={styles.expenseLeft}>
                  <View style={styles.expenseIcon}>
                    {expense.receiptUrl ? (
                      <Receipt color="#10B981" size={20} />
                    ) : (
                      <DollarSign color="#94A3B8" size={20} />
                    )}
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseVendor}>{expense.vendor}</Text>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <View style={styles.expenseMeta}>
                      <Text style={styles.expenseCategory}>{expense.category}</Text>
                      <Text style={styles.expenseDot}>•</Text>
                      <Text style={styles.expenseProject}>{expense.project}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>${expense.amount.toLocaleString()}</Text>
                  <Text style={styles.expenseDate}>
                    {expense.date.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X color="#94A3B8" size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer}>
              <Pressable style={styles.receiptButton}>
                <Camera color="#3B82F6" size={24} />
                <Text style={styles.receiptButtonText}>Scan Receipt</Text>
                <Text style={styles.receiptHint}>Auto-extract amount & vendor</Text>
              </Pressable>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount (NZD) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newExpense.amount}
                  onChangeText={(text) => setNewExpense(prev => ({ ...prev, amount: text }))}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category *</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      style={[
                        styles.categoryButton,
                        newExpense.category === cat && styles.categoryButtonActive
                      ]}
                      onPress={() => setNewExpense(prev => ({ ...prev, category: cat }))}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        newExpense.category === cat && styles.categoryButtonTextActive
                      ]}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vendor *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newExpense.vendor}
                  onChangeText={(text) => setNewExpense(prev => ({ ...prev, vendor: text }))}
                  placeholder="e.g., Bunnings, PlaceMakers"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newExpense.project}
                  onChangeText={(text) => setNewExpense(prev => ({ ...prev, project: text }))}
                  placeholder="Select or enter project"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newExpense.description}
                  onChangeText={(text) => setNewExpense(prev => ({ ...prev, description: text }))}
                  placeholder="What was purchased?"
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddExpense}
              >
                <Check color="#FFF" size={20} />
                <Text style={styles.saveButtonText}>Add Expense</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={selectedReceipt !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={styles.receiptOverlay}>
          <Pressable style={styles.receiptClose} onPress={() => setSelectedReceipt(null)}>
            <X color="#FFF" size={24} />
          </Pressable>
          {selectedReceipt && (
            <Image source={{ uri: selectedReceipt }} style={styles.receiptImage} />
          )}
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
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 8,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  categoryCard: {
    padding: 16,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  categoryAmount: {
    fontSize: 14,
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
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 12,
  },
  expenseCard: {
    marginBottom: 12,
  },
  expenseCardInner: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseVendor: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 6,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expenseCategory: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  expenseDot: {
    fontSize: 11,
    color: '#64748B',
  },
  expenseProject: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
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
    maxHeight: 450,
  },
  receiptButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginTop: 12,
  },
  receiptHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  categoryButtonTextActive: {
    color: '#3B82F6',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
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
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
  receiptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  receiptImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});
