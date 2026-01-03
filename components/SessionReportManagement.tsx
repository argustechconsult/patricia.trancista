
import React, { useState, useMemo } from 'react';
import { Search, FileText, ChevronRight, Save, Calendar, User, BookOpen, PenTool, History, ArrowLeft, ClipboardList, ChevronLeft, Layout, Sidebar as SidebarIcon, Scissors } from 'lucide-react';
import { Appointment, Client, SessionReport } from '../types';

interface ReportsProps {
  appointments: Appointment[];
  clients: Client[];
  reports: SessionReport[];
  setReports: React.Dispatch<React.SetStateAction<SessionReport[]>>;
}

const SessionReportManagement: React.FC<ReportsProps> = ({ appointments, clients, reports, setReports }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<{ appointmentId: string, clientId: string } | null>(null);
  const [formData, setFormData] = useState({ observations: '', evolution: '', conduct: '' });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const filteredClients = useMemo(() => {
    const clientsWithLastDate = clients.map(client => {
      const clientApps = appointments.filter(a => a.clientId === client.id);
      const lastApp = clientApps.length > 0 
        ? [...clientApps].sort((a, b) => b.date.localeCompare(a.date))[0]
        : null;
      return { ...client, lastDate: lastApp ? lastApp.date : '0000-00-00' };
    });
    return (patientSearch.trim() 
      ? clientsWithLastDate.filter(c => c.name.toLowerCase().includes(patientSearch.toLowerCase()))
      : clientsWithLastDate).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }, [clients, appointments, patientSearch]);

  const clientAppointments = useMemo(() => {
    if (!selectedClientId) return [];
    return appointments.filter(app => app.clientId === selectedClientId).sort((a, b) => b.date.localeCompare(a.date));
  }, [appointments, selectedClientId]);

  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);

  const openEditor = (app: Appointment) => {
    const existing = reports.find(r => r.appointmentId === app.id);
    if (existing) {
      setFormData({ observations: existing.observations, evolution: existing.evolution, conduct: existing.conduct });
    } else {
      setFormData({ observations: '', evolution: '', conduct: '' });
    }
    setEditingReport({ appointmentId: app.id, clientId: app.clientId });
  };

  const handleSave = () => {
    if (!editingReport) return;
    const newReport: SessionReport = {
      id: editingReport.appointmentId,
      appointmentId: editingReport.appointmentId,
      clientId: editingReport.clientId,
      date: new Date().toISOString(),
      content: `${formData.observations}\n${formData.evolution}\n${formData.conduct}`,
      ...formData
    };
    setReports(prev => {
      const filtered = prev.filter(r => r.appointmentId !== editingReport.appointmentId);
      return [...filtered, newReport];
    });
    setEditingReport(null);
  };

  if (editingReport) {
    const app = appointments.find(a => a.id === editingReport.appointmentId);
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-full animate-scale-up overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <button onClick={() => setEditingReport(null)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-amber-600 transition-all border border-slate-100 shadow-sm"><ChevronLeft size={24} /></button>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-amber-100"><Scissors size={28} /></div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ficha Técnica do Cabelo</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-0.5 rounded-full">{selectedClient?.name}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date((app?.date || '') + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingReport(null)} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100">Cancelar</button>
            <button onClick={handleSave} className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-amber-700 shadow-xl shadow-amber-100"><Save size={22} /> Salvar Ficha</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#FCFBF7] p-8 lg:p-14">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700 flex items-center gap-3 ml-2">Diagnóstico dos Fios & Material</label>
              <textarea value={formData.observations} onChange={(e) => setFormData({...formData, observations: e.target.value})} placeholder="Estado do couro cabeludo, quantidade de jumbo e cores utilizadas..." className="w-full bg-white border border-slate-200 rounded-[2rem] p-10 min-h-[200px] outline-none text-slate-800 leading-relaxed shadow-sm font-medium text-xl" />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700 flex items-center gap-3 ml-2">Manutenção & Cuidados</label>
              <textarea value={formData.evolution} onChange={(e) => setFormData({...formData, evolution: e.target.value})} placeholder="Como a cliente cuidou das tranças anteriores, recomendações feitas..." className="w-full bg-white border border-slate-200 rounded-[2rem] p-10 min-h-[200px] outline-none text-slate-800 leading-relaxed shadow-sm font-medium text-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico de Visual</h2>
          <p className="text-slate-500 text-sm">Gerencie as técnicas e materiais usados em cada cliente.</p>
        </div>
        <button onClick={() => setSidebarVisible(!sidebarVisible)} className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-amber-600 transition-all shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
          {sidebarVisible ? <SidebarIcon size={18} /> : <Layout size={18} />} {sidebarVisible ? 'Recolher' : 'Mostrar'}
        </button>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-[600px]">
        {sidebarVisible && (
          <div className={`lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden`}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar cliente..." value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredClients.map(client => (
                <button key={client.id} onClick={() => setSelectedClientId(client.id)} className={`w-full p-6 flex items-center gap-4 hover:bg-amber-50/30 transition-all text-left ${selectedClientId === client.id ? 'bg-amber-50/50 border-r-4 border-amber-500' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${selectedClientId === client.id ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{client.name.charAt(0)}</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate text-slate-700">{client.name}</p>
                    <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">Última trança: {client.lastDate !== '0000-00-00' ? client.lastDate : 'Sem registro'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={`${sidebarVisible ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden`}>
          {selectedClientId ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><History className="text-amber-600" size={22} /> Histórico de {selectedClient?.name}</h3>
                <div className="bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100 font-black text-xs text-slate-500">{clientAppointments.length} Visitas</div>
              </div>
              <div className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto space-y-4">
                  {clientAppointments.map(app => {
                    const report = reports.find(r => r.appointmentId === app.id);
                    return (
                      <button key={app.id} onClick={() => openEditor(app)} className="w-full p-8 rounded-[2rem] border transition-all flex items-center justify-between text-left bg-white border-slate-200 hover:border-amber-300 hover:shadow-xl">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}><Calendar size={28} /></div>
                          <div>
                            <p className="font-bold text-slate-800 text-xl">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs font-black text-slate-400 uppercase">{app.type}</p>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-amber-500" size={28} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-50/20">
              <div className="w-32 h-32 bg-white rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-center mb-8"><Scissors size={64} className="opacity-10" /></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Fichas de Atendimento</h3>
              <p>Selecione uma cliente para ver os detalhes de cada trabalho realizado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionReportManagement;
