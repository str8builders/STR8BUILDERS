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

      if (savedClients) {
        setClients(JSON.parse(savedClients).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })));
      } else {
        // Add sample data if no saved data exists
        const sampleClients = createSampleData();
        setClients(sampleClients.clients);
        setProjects(sampleClients.projects);
        setTimesheets(sampleClients.timesheets);
        setInvoices(sampleClients.invoices);
        
        // Save sample data
        saveData('str8build_clients', sampleClients.clients);
        saveData('str8build_projects', sampleClients.projects);
        saveData('str8build_timesheets', sampleClients.timesheets);
        saveData('str8build_invoices', sampleClients.invoices);
      }
      
      if (savedProjects) setProjects(JSON.parse(savedProjects).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
      if (savedTimesheets) setTimesheets(JSON.parse(savedTimesheets).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })));
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices).map((i: any) => ({ ...i, createdAt: new Date(i.createdAt) })));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const createSampleData = () => {
    const sampleClients: Client[] = [
      {
        id: '1',
        name: 'Bay Park Developments',
        email: 'contact@baypark.co.nz',
        phone: '+64 7 574 2890',
        address: '123 Bay Park Road, Tauranga 3110',
        status: 'Active',
        projectCount: 2,
        totalBilled: 15750,
        hourlyRate: 85,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        name: 'Omokoroa Properties Ltd',
        email: 'admin@omokoroa.co.nz',
        phone: '+64 7 548 1234',
        address: '456 Omokoroa Road, Omokoroa 3114',
        status: 'Active',
        projectCount: 1,
        totalBilled: 8500,
        hourlyRate: 90,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        name: 'Mount Maunganui Homes',
        email: 'info@mounthomes.co.nz',
        phone: '+64 7 575 9876',
        address: '789 Maunganui Road, Mount Maunganui 3116',
        status: 'Completed',
        projectCount: 1,
        totalBilled: 12300,
        hourlyRate: 80,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
    ];

    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'Bay Park Renovation',
        client: 'Bay Park Developments',
        clientId: '1',
        location: '123 Bay Park Road, Tauranga',
        progress: 75,
        deadline: '2025-03-15',
        hourlyRate: 85,
        status: 'In Progress',
        estimatedCompletion: '2025-03-15',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        name: 'Omokoroa Deck Extension',
        client: 'Omokoroa Properties Ltd',
        clientId: '2',
        location: '456 Omokoroa Road, Omokoroa',
        progress: 45,
        deadline: '2025-02-28',
        hourlyRate: 90,
        status: 'In Progress',
        estimatedCompletion: '2025-02-28',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        name: 'Mount Maunganui Kitchen',
        client: 'Mount Maunganui Homes',
        clientId: '3',
        location: '789 Maunganui Road, Mount Maunganui',
        progress: 100,
        deadline: '2024-12-20',
        hourlyRate: 80,
        status: 'Completed',
        estimatedCompletion: '2024-12-20',
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      },
    ];

    const sampleTimesheets: TimesheetEntry[] = [
      {
        id: '1',
        clientId: '1',
        projectId: '1',
        projectName: 'Bay Park Renovation',
        clientName: 'Bay Park Developments',
        date: '2025-01-15',
        startTime: '08:00',
        endTime: '16:30',
        hours: 8.5,
        rate: 85,
        description: 'Framing work on main living area extension',
        invoiced: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        clientId: '1',
        projectId: '1',
        projectName: 'Bay Park Renovation',
        clientName: 'Bay Park Developments',
        date: '2025-01-16',
        startTime: '08:00',
        endTime: '17:00',
        hours: 9.0,
        rate: 85,
        description: 'Roof framing and installation of trusses',
        invoiced: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        clientId: '2',
        projectId: '2',
        projectName: 'Omokoroa Deck Extension',
        clientName: 'Omokoroa Properties Ltd',
        date: '2025-01-14',
        startTime: '09:00',
        endTime: '15:30',
        hours: 6.5,
        rate: 90,
        description: 'Foundation preparation and concrete pour',
        invoiced: false,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        clientId: '1',
        projectId: '1',
        projectName: 'Bay Park Renovation',
        clientName: 'Bay Park Developments',
        date: '2025-01-10',
        startTime: '08:30',
        endTime: '16:00',
        hours: 7.5,
        rate: 85,
        description: 'Site preparation and demolition work',
        invoiced: true,
        invoiceId: '1',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        clientId: '3',
        projectId: '3',
        projectName: 'Mount Maunganui Kitchen',
        clientName: 'Mount Maunganui Homes',
        date: '2024-12-15',
        startTime: '08:00',
        endTime: '17:30',
        hours: 9.5,
        rate: 80,
        description: 'Kitchen cabinet installation and finishing',
        invoiced: true,
        invoiceId: '2',
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
    ];

    const sampleInvoices: Invoice[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Bay Park Developments',
        invoiceNumber: 'INV-2025-0001',
        date: '2025-01-12',
        dueDate: '2025-02-11',
        amount: 637.50,
        status: 'Sent',
        items: [
          {
            id: '1',
            description: 'Bay Park Renovation - Site preparation and demolition work',
            hours: 7.5,
            rate: 85,
            amount: 637.50,
            timesheetEntryId: '4',
          },
        ],
        notes: 'Payment terms: Net 30 days. Please reference invoice number when making payment.',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        clientId: '3',
        clientName: 'Mount Maunganui Homes',
        invoiceNumber: 'INV-2024-0015',
        date: '2024-12-18',
        dueDate: '2025-01-17',
        amount: 760.00,
        status: 'Paid',
        items: [
          {
            id: '2',
            description: 'Mount Maunganui Kitchen - Kitchen cabinet installation and finishing',
            hours: 9.5,
            rate: 80,
            amount: 760.00,
            timesheetEntryId: '5',
          },
        ],
        notes: 'Final invoice for kitchen renovation project. Thank you for your business!',
        createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        clientId: '2',
        clientName: 'Omokoroa Properties Ltd',
        invoiceNumber: 'INV-2025-0002',
        date: '2025-01-17',
        dueDate: '2025-02-16',
        amount: 1485.00,
        status: 'Draft',
        items: [
          {
            id: '3',
            description: 'Omokoroa Deck Extension - Foundation preparation and concrete pour',
            hours: 6.5,
            rate: 90,
            amount: 585.00,
          },
          {
            id: '4',
            description: 'Omokoroa Deck Extension - Deck framing and structural work',
            hours: 10.0,
            rate: 90,
            amount: 900.00,
          },
        ],
        notes: 'Deck extension project - Phase 1 and 2 completed.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    return {
      clients: sampleClients,
      projects: sampleProjects,
      timesheets: sampleTimesheets,
      invoices: sampleInvoices,
    };
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