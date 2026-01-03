'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Client,
  Appointment,
  FinancialRecord,
  KanbanTask,
  SessionReport,
  GlobalSettings,
} from '@/types';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  sessionReports: SessionReport[];
  setSessionReports: React.Dispatch<React.SetStateAction<SessionReport[]>>;
  finances: FinancialRecord[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  kanbanTasks: KanbanTask[];
  setKanbanTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
  registerNewBooking: (
    clientData: { name: string; email: string; phone: string },
    appointmentData: { date: string; time: string },
  ) => Appointment;
  handleLogin: () => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [settings, setSettings] = useState<GlobalSettings>({
    defaultPrice: 180,
    defaultDuration: 240,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sessionReports, setSessionReports] = useState<SessionReport[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);

  // Hydration to avoid server/client mismatch
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('patricia_auth') === 'true');

    const savedSettings = localStorage.getItem('patricia_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedClients = localStorage.getItem('patricia_clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients([
        {
          id: '1',
          name: 'Aline Oliveira',
          address: 'Rua Principal, 45',
          phone: '21988776655',
          email: 'aline@email.com',
          status: 'active',
          treatmentStage: 'Regular',
          lastSessionDate: '2023-11-05',
        },
        {
          id: '2',
          name: 'Beatriz Santos',
          address: 'Av. Brasil, 200',
          phone: '21977665544',
          email: 'bia@email.com',
          status: 'active',
          treatmentStage: 'Measurement',
          lastSessionDate: '2023-10-12',
        },
      ]);
    }

    const savedAppointments = localStorage.getItem('patricia_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      setAppointments([
        {
          id: 'app-aline-1',
          clientId: '1',
          date: tomorrowStr,
          time: '09:00',
          type: 'Box Braids',
          status: 'scheduled',
          price: 350,
          duration: 360,
        },
      ]);
    }

    const savedReports = localStorage.getItem('patricia_reports');
    if (savedReports) setSessionReports(JSON.parse(savedReports));

    const savedFinances = localStorage.getItem('patricia_finances');
    if (savedFinances) setFinances(JSON.parse(savedFinances));

    const savedKanban = localStorage.getItem('patricia_kanban');
    if (savedKanban) {
      setKanbanTasks(JSON.parse(savedKanban));
    } else {
      setKanbanTasks([
        { id: 'k1', title: 'Comprar Jumbo Loiro 27', status: 'todo' },
        { id: 'k2', title: 'Agulhas de crochet novas', status: 'doing' },
      ]);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('patricia_clients', JSON.stringify(clients));
    localStorage.setItem('patricia_appointments', JSON.stringify(appointments));
    localStorage.setItem('patricia_reports', JSON.stringify(sessionReports));
    localStorage.setItem('patricia_finances', JSON.stringify(finances));
    localStorage.setItem('patricia_kanban', JSON.stringify(kanbanTasks));
    localStorage.setItem('patricia_settings', JSON.stringify(settings));
  }, [
    clients,
    appointments,
    sessionReports,
    finances,
    kanbanTasks,
    settings,
    isInitialized,
  ]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('patricia_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('patricia_auth');
  };

  const registerNewBooking = (
    clientData: { name: string; email: string; phone: string },
    appointmentData: { date: string; time: string },
  ) => {
    let existingClient = clients.find(
      (c) => c.email.toLowerCase() === clientData.email.toLowerCase(),
    );
    let clientId = '';

    if (!existingClient) {
      clientId = Date.now().toString();
      const newClient: Client = {
        id: clientId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: 'A combinar',
        status: 'pending',
        treatmentStage: 'First Contact',
      };
      setClients((prev) => [...prev, newClient]);
    } else {
      clientId = existingClient.id;
    }

    const price = settings.defaultPrice;
    const duration = settings.defaultDuration;

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      clientId: clientId,
      date: appointmentData.date,
      time: appointmentData.time,
      type: 'Box Braids',
      status: 'scheduled',
      price: price,
      duration: duration,
    };

    setAppointments((prev) => [...prev, newAppointment]);

    const newFinancialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Online - ${clientData.name}`,
      amount: price,
      type: 'income',
      date: appointmentData.date,
      category: 'Serviço',
    };
    setFinances((prev) => [...prev, newFinancialRecord]);

    return newAppointment;
  };

  // Only render children after hydration to prevent mismatches
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        settings,
        setSettings,
        clients,
        setClients,
        appointments,
        setAppointments,
        sessionReports,
        setSessionReports,
        finances,
        setFinances,
        kanbanTasks,
        setKanbanTasks,
        registerNewBooking,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
