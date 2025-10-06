import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Completed' | 'Pending';
  projectCount?: number;
  totalBilled?: number;
  hourlyRate: number;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  location: string;
  progress: number;
  deadline: string;
  hourlyRate: number;
  status: 'Planning' | 'In Progress' | 'Nearly Complete' | 'Completed';
  estimatedCompletion: string;
  createdAt: Date;
}

export interface TimesheetEntry {
  id: string;
  clientId: string;
  projectId: string;
  projectName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  description: string;
  invoiced: boolean;
  invoiceId?: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
  timesheetEntryId?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  projectName?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  items: InvoiceItem[];
  notes?: string;
  createdAt: Date;
}

export const useAppData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadClients(),
        loadProjects(),
        loadTimesheets(),
        loadInvoices(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading clients:', error);
      return;
    }

    if (data) {
      setClients(data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        address: c.address || '',
        status: c.status || 'Active',
        hourlyRate: c.hourly_rate || 0,
        createdAt: new Date(c.created_at),
      })));
    }
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients (name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading projects:', error);
      return;
    }

    if (data) {
      setProjects(data.map(p => ({
        id: p.id,
        name: p.name,
        client: p.clients?.name || '',
        clientId: p.client_id,
        location: p.location || '',
        progress: p.progress || 0,
        deadline: p.deadline || '',
        hourlyRate: p.hourly_rate || 0,
        status: p.status || 'Planning',
        estimatedCompletion: p.estimated_completion || '',
        createdAt: new Date(p.created_at),
      })));
    }
  };

  const loadTimesheets = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        clients (name),
        projects (name)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading timesheets:', error);
      return;
    }

    if (data) {
      setTimesheets(data.map(t => ({
        id: t.id,
        clientId: t.client_id,
        projectId: t.project_id,
        projectName: t.projects?.name || '',
        clientName: t.clients?.name || '',
        date: t.date,
        startTime: t.start_time || '',
        endTime: t.end_time || '',
        hours: t.hours || 0,
        rate: t.rate || 0,
        description: t.description || '',
        invoiced: t.invoiced || false,
        invoiceId: t.invoice_id,
        createdAt: new Date(t.created_at),
      })));
    }
  };

  const loadInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading invoices:', error);
      return;
    }

    if (data) {
      setInvoices(data.map(i => ({
        id: i.id,
        clientId: i.client_id,
        clientName: i.clients?.name || '',
        invoiceNumber: i.invoice_number,
        date: i.date,
        dueDate: i.due_date,
        amount: i.amount || 0,
        status: i.status || 'Draft',
        items: i.items || [],
        notes: i.notes,
        createdAt: new Date(i.created_at),
      })));
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'projectCount' | 'totalBilled' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        status: clientData.status,
        hourly_rate: clientData.hourlyRate,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
      throw error;
    }

    if (data) {
      await loadClients();
      return data;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    const { error } = await supabase
      .from('clients')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        status: updates.status,
        hourly_rate: updates.hourlyRate,
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    await loadClients();
  };

  const deleteClient = async (clientId: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }

    await loadClients();
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: projectData.name,
        client_id: projectData.clientId,
        location: projectData.location,
        progress: projectData.progress,
        deadline: projectData.deadline,
        hourly_rate: projectData.hourlyRate,
        status: projectData.status,
        estimated_completion: projectData.estimatedCompletion,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding project:', error);
      throw error;
    }

    if (data) {
      await loadProjects();
      return data;
    }
  };

  const addTimesheetEntry = async (entryData: Omit<TimesheetEntry, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        client_id: entryData.clientId,
        project_id: entryData.projectId,
        date: entryData.date,
        start_time: entryData.startTime,
        end_time: entryData.endTime,
        hours: entryData.hours,
        rate: entryData.rate,
        description: entryData.description,
        invoiced: entryData.invoiced,
        invoice_id: entryData.invoiceId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding timesheet entry:', error);
      throw error;
    }

    if (data) {
      await loadTimesheets();
      return data;
    }
  };

  const updateTimesheetEntry = async (entryId: string, updates: Partial<TimesheetEntry>) => {
    const { error } = await supabase
      .from('time_entries')
      .update({
        date: updates.date,
        start_time: updates.startTime,
        end_time: updates.endTime,
        hours: updates.hours,
        rate: updates.rate,
        description: updates.description,
        invoiced: updates.invoiced,
        invoice_id: updates.invoiceId,
      })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating timesheet entry:', error);
      throw error;
    }

    await loadTimesheets();
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(4, '0')}`;
  };

  const createInvoice = async (clientId: string, timesheetEntryIds: string[], notes?: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    const selectedEntries = timesheets.filter(entry =>
      timesheetEntryIds.includes(entry.id) && !entry.invoiced
    );

    if (selectedEntries.length === 0) return null;

    const items: InvoiceItem[] = selectedEntries.map(entry => ({
      id: Date.now().toString() + Math.random(),
      description: `${entry.projectName} - ${entry.description}`,
      hours: entry.hours,
      rate: entry.rate,
      amount: entry.hours * entry.rate,
      timesheetEntryId: entry.id,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        client_id: clientId,
        invoice_number: generateInvoiceNumber(),
        date: new Date().toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        amount: totalAmount,
        status: 'Draft',
        items: items,
        notes: notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }

    if (data) {
      for (const entry of selectedEntries) {
        await updateTimesheetEntry(entry.id, { invoiced: true, invoiceId: data.id });
      }
      await loadInvoices();
      return data;
    }
  };

  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    const { error } = await supabase
      .from('invoices')
      .update({
        status: updates.status,
        amount: updates.amount,
        due_date: updates.dueDate,
        notes: updates.notes,
        items: updates.items,
      })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }

    await loadInvoices();
  };

  const deleteInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    for (const item of invoice.items) {
      if (item.timesheetEntryId) {
        await updateTimesheetEntry(item.timesheetEntryId, { invoiced: false, invoiceId: undefined });
      }
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId);

    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }

    await loadInvoices();
  };

  const getClientInvoices = (clientId: string) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  };

  const getClientTimesheets = (clientId: string) => {
    return timesheets.filter(timesheet => timesheet.clientId === clientId);
  };

  const getUnbilledTimesheets = (clientId: string) => {
    return timesheets.filter(entry => entry.clientId === clientId && !entry.invoiced);
  };

  const getTotalUnbilledHours = (clientId: string) => {
    return getUnbilledTimesheets(clientId).reduce((total, entry) => total + entry.hours, 0);
  };

  const getTotalUnbilledAmount = (clientId: string) => {
    return getUnbilledTimesheets(clientId).reduce((total, entry) => total + (entry.hours * entry.rate), 0);
  };

  const getProjectsByClient = (clientId: string) => {
    return projects.filter(project => project.clientId === clientId);
  };

  return {
    clients,
    projects,
    timesheets,
    invoices,
    loading,

    addClient,
    updateClient,
    deleteClient,

    addProject,

    addTimesheetEntry,
    updateTimesheetEntry,

    createInvoice,
    updateInvoice,
    deleteInvoice,

    getClientInvoices,
    getClientTimesheets,
    getUnbilledTimesheets,
    getTotalUnbilledHours,
    getTotalUnbilledAmount,
    getProjectsByClient,

    refreshData: loadData,
  };
};
