
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ClientManagement from './components/ClientManagement';
import ScheduleManagement from './components/ScheduleManagement';
import FinancialManagement from './components/FinancialManagement';
import KanbanBoard from './components/KanbanBoard';
import { Client, Appointment, FinancialRecord, KanbanTask, SessionReport, GlobalSettings } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('patricia_auth') === 'true';
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('patricia_settings');
    return saved ? JSON.parse(saved) : { defaultPrice: 180, defaultDuration: 240 };
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('patricia_clients');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Aline Oliveira', address: 'Rua Principal, 45', phone: '21988776655', email: 'aline@email.com', status: 'active', treatmentStage: 'Regular', lastSessionDate: '2023-11-05' },
      { id: '2', name: 'Beatriz Santos', address: 'Av. Brasil, 200', phone: '21977665544', email: 'bia@email.com', status: 'active', treatmentStage: 'Measurement', lastSessionDate: '2023-10-12' },
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('patricia_appointments');
    if (saved) return JSON.parse(saved);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return [
      { 
        id: 'app-aline-1', 
        clientId: '1', 
        date: tomorrowStr, 
        time: '09:00', 
        type: 'Box Braids', 
        status: 'scheduled', 
        price: 350,
        duration: 360
      }
    ];
  });

  const [sessionReports, setSessionReports] = useState<SessionReport[]>(() => {
    const saved = localStorage.getItem('patricia_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('patricia_finances');
    return saved ? JSON.parse(saved) : [];
  });

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('patricia_kanban');
    return saved ? JSON.parse(saved) : [
      { id: 'k1', title: 'Comprar Jumbo Loiro 27', status: 'todo' },
      { id: 'k2', title: 'Agulhas de crochet novas', status: 'doing' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('patricia_clients', JSON.stringify(clients));
    localStorage.setItem('patricia_appointments', JSON.stringify(appointments));
    localStorage.setItem('patricia_reports', JSON.stringify(sessionReports));
    localStorage.setItem('patricia_finances', JSON.stringify(finances));
    localStorage.setItem('patricia_kanban', JSON.stringify(kanbanTasks));
    localStorage.setItem('patricia_settings', JSON.stringify(settings));
  }, [clients, appointments, sessionReports, finances, kanbanTasks, settings]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('patricia_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('patricia_auth');
  };

  const registerNewBooking = (clientData: { name: string, email: string, phone: string }, appointmentData: { date: string, time: string }) => {
    let existingClient = clients.find(c => c.email.toLowerCase() === clientData.email.toLowerCase());
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
        treatmentStage: 'First Contact'
      };
      setClients(prev => [...prev, newClient]);
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
      duration: duration
    };
    
    setAppointments(prev => [...prev, newAppointment]);

    const newFinancialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Online - ${clientData.name}`,
      amount: price,
      type: 'income',
      date: appointmentData.date,
      category: 'Serviço'
    };
    setFinances(prev => [...prev, newFinancialRecord]);
    
    return newAppointment;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage appointments={appointments} onBookingComplete={registerNewBooking} settings={settings} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        
        {isAuthenticated ? (
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard clients={clients} appointments={appointments} finances={finances} />} />
            <Route path="clients" element={<ClientManagement clients={clients} setClients={setClients} />} />
            <Route path="schedule" element={<ScheduleManagement 
                appointments={appointments} 
                setAppointments={setAppointments} 
                clients={clients} 
                setFinances={setFinances}
                settings={settings}
                setSettings={setSettings}
              />} 
            />
            <Route path="finance" element={<FinancialManagement finances={finances} setFinances={setFinances} />} />
            <Route path="tasks" element={<KanbanBoard tasks={kanbanTasks} setTasks={setKanbanTasks} />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
