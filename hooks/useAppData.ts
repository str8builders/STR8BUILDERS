import { useState, useEffect } from 'react';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Completed' | 'Pending';
  projectCount: number;
  totalBilled: number;
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

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedClients = localStorage.getItem('str8build_clients');
      const savedProjects = localStorage.getItem('str8build_projects');
      const savedTimesheets = localStorage.getItem('str8build_timesheets');
      const savedInvoices = localStorage.getItem('str8build_invoices');

      if (savedClients) setClients(JSON.parse(savedClients).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })));
      if (savedProjects) setProjects(JSON.parse(savedProjects).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
      if (savedTimesheets) setTimesheets(JSON.parse(savedTimesheets).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })));
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices).map((i: any) => ({ ...i, createdAt: new Date(i.createdAt) })));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Client operations
  const addClient = (clientData: Omit<Client, 'id' | 'projectCount' | 'totalBilled' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      projectCount: 0,
      totalBilled: 0,
      createdAt: new Date(),
    };
    
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveData('str8build_clients', updatedClients);
    return newClient;
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    );
    setClients(updatedClients);
    saveData('str8build_clients', updatedClients);
  };

  const deleteClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    saveData('str8build_clients', updatedClients);
  };

  // Project operations
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveData('str8build_projects', updatedProjects);

    // Update client project count
    const client = clients.find(c => c.id === projectData.clientId);
    if (client) {
      updateClient(client.id, { projectCount: client.projectCount + 1 });
    }

    return newProject;
  };

  // Timesheet operations
  const addTimesheetEntry = (entryData: Omit<TimesheetEntry, 'id' | 'createdAt'>) => {
    const newEntry: TimesheetEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedTimesheets = [...timesheets, newEntry];
    setTimesheets(updatedTimesheets);
    saveData('str8build_timesheets', updatedTimesheets);
    return newEntry;
  };

  const updateTimesheetEntry = (entryId: string, updates: Partial<TimesheetEntry>) => {
    const updatedTimesheets = timesheets.map(entry => 
      entry.id === entryId ? { ...entry, ...updates } : entry
    );
    setTimesheets(updatedTimesheets);
    saveData('str8build_timesheets', updatedTimesheets);
  };

  // Invoice operations
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(4, '0')}`;
  };

  const createInvoice = (clientId: string, timesheetEntryIds: string[], notes?: string) => {
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
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      clientId,
      clientName: client.name,
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount: totalAmount,
      status: 'Draft',
      items,
      notes,
      createdAt: new Date(),
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    saveData('str8build_invoices', updatedInvoices);

    // Mark timesheet entries as invoiced
    selectedEntries.forEach(entry => {
      updateTimesheetEntry(entry.id, { invoiced: true, invoiceId: newInvoice.id });
    });

    // Update client total billed
    updateClient(clientId, { totalBilled: client.totalBilled + totalAmount });

    return newInvoice;
  };

  const updateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, ...updates } : invoice
    );
    setInvoices(updatedInvoices);
    saveData('str8build_invoices', updatedInvoices);
  };

  const deleteInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Mark associated timesheet entries as not invoiced
    invoice.items.forEach(item => {
      if (item.timesheetEntryId) {
        updateTimesheetEntry(item.timesheetEntryId, { invoiced: false, invoiceId: undefined });
      }
    });

    // Update client total billed
    const client = clients.find(c => c.id === invoice.clientId);
    if (client) {
      updateClient(client.id, { totalBilled: client.totalBilled - invoice.amount });
    }

    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    saveData('str8build_invoices', updatedInvoices);
  };

  // Helper functions
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
    // Data
    clients,
    projects,
    timesheets,
    invoices,
    
    // Client operations
    addClient,
    updateClient,
    deleteClient,
    
    // Project operations
    addProject,
    
    // Timesheet operations
    addTimesheetEntry,
    updateTimesheetEntry,
    
    // Invoice operations
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Helper functions
    getClientInvoices,
    getClientTimesheets,
    getUnbilledTimesheets,
    getTotalUnbilledHours,
    getTotalUnbilledAmount,
    getProjectsByClient,
  };
};