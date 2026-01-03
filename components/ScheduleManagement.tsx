
import React, { useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock, Check, Scissors, DollarSign, Timer, Settings, CalendarDays } from 'lucide-react';
import { Appointment, Client, FinancialRecord, GlobalSettings } from '../types';

interface ScheduleProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: Client[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
}

const ScheduleManagement: React.FC<ScheduleProps> = ({ appointments, setAppointments, clients, setFinances, settings, setSettings }) => {
  const [showModal, setShowModal] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Appointment>>({
    clientId: '', date: '', time: '', type: 'Box Braids', status: 'scheduled', 
    price: settings.defaultPrice, duration: settings.defaultDuration
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.clientId || !newApp.date || !newApp.time) return;

    const appointmentPrice = Number(newApp.price) || settings.defaultPrice;
    const client = clients.find(c => c.id === newApp.clientId);

    const app: Appointment = {
      id: Date.now().toString(),
      clientId: newApp.clientId!,
      date: newApp.date!,
      time: newApp.time!,
      type: newApp.type as any || 'Box Braids',
      status: 'scheduled',
      price: appointmentPrice,
      duration: Number(newApp.duration) || settings.defaultDuration
    };

    setAppointments(prev => [...prev, app]);

    const financialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Manual (${app.type}) - ${client?.name || 'Cliente'}`,
      amount: appointmentPrice,
      type: 'income',
      date: newApp.date!,
      category: 'Serviço'
    };
    setFinances(prev => [...prev, financialRecord]);

    setShowModal(false);
    setNewApp({ clientId: '', date: '', time: '', type: 'Box Braids', status: 'scheduled', price: settings.defaultPrice, duration: settings.defaultDuration });
  };

  const markCompleted = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  };

  const handleTypeChange = (type: any) => {
    const prices: Record<string, number> = {
      'Box Braids': 350,
      'Nagô': 150,
      'Twist': 300,
      'Entrelace': 400,
      'Penteado': 120
    };
    const durations: Record<string, number> = {
      'Box Braids': 360,
      'Nagô': 90,
      'Twist': 240,
      'Entrelace': 240,
      'Penteado': 60
    };
    setNewApp({ ...newApp, type, price: prices[type] || settings.defaultPrice, duration: durations[type] || settings.defaultDuration });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda de Atendimentos</h2>
          <p className="text-sm text-slate-500">Gestão de horários de Patrícia Transista.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 transition-all shadow-lg">
          <Plus size={20} /> Novo Agendamento
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Settings size={24} /></div>
          <div><h3 className="font-bold text-slate-800">Padrões do Salão</h3><p className="text-xs text-slate-400">Valores e tempos base.</p></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between relative">
            <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" value={settings.defaultDuration} onChange={(e) => setSettings({...settings, defaultDuration: Number(e.target.value)})} className="w-full bg-transparent text-right font-black text-amber-700 outline-none" />
          </div>
          <div className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" value={settings.defaultPrice} onChange={(e) => setSettings({...settings, defaultPrice: Number(e.target.value)})} className="w-full bg-transparent text-right font-black text-amber-700 outline-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {appointments.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(app => {
          const client = clients.find(c => c.id === app.clientId);
          return (
            <div key={app.id} className={`p-6 rounded-3xl border ${app.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-amber-100 shadow-sm shadow-amber-50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-600">
                  {app.type}
                </div>
                {app.status === 'scheduled' && (
                  <button onClick={() => markCompleted(app.id)} className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg"><Check size={20} /></button>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-4 truncate">{client?.name || 'Cliente'}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-600 text-sm">
                  <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-amber-600" />{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR')}</div>
                  <div className="flex items-center gap-2"><Clock size={16} className="text-amber-600" />{app.time}</div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                   <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs"><Timer size={14} />{app.duration} min</div>
                   <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs"><DollarSign size={14} />R$ {app.price}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-600 text-white">
              <h3 className="text-xl font-bold">Novo Agendamento</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cliente</label>
                <select required value={newApp.clientId} onChange={(e) => setNewApp({...newApp, clientId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4">
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required value={newApp.date} onChange={(e) => setNewApp({...newApp, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                <input type="time" required value={newApp.time} onChange={(e) => setNewApp({...newApp, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
              </div>
              <div className="space-y-4 pt-2">
                <label className="text-sm font-bold text-slate-700">Técnica</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Box Braids', 'Nagô', 'Twist', 'Entrelace', 'Penteado'].map(t => (
                    <button type="button" key={t} onClick={() => handleTypeChange(t)} className={`py-2 rounded-xl border-2 font-bold text-xs transition-all ${newApp.type === t ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700">Salvar Agendamento</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
