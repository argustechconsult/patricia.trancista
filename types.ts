
export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastSessionDate?: string;
  treatmentStage: 'First Contact' | 'Measurement' | 'Regular' | 'Post-care';
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  time: string;
  type: 'Box Braids' | 'Nagô' | 'Twist' | 'Entrelace' | 'Penteado';
  status: 'scheduled' | 'completed' | 'cancelled';
  meetLink?: string; // Mantido para consultas virtuais de avaliação
  price: number;
  duration: number; // em minutos
}

export interface GlobalSettings {
  defaultPrice: number;
  defaultDuration: number;
}

export interface SessionReport {
  id: string;
  appointmentId: string;
  clientId: string;
  content: string;
  date: string;
  observations: string; // Detalhes do cabelo
  evolution: string; // Manutenção
  conduct: string; // Produtos usados
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  clientId?: string;
  status: 'todo' | 'doing' | 'done';
}

export enum AppRoute {
  LANDING = '/',
  LOGIN = '/login',
  ADMIN_DASHBOARD = '/admin',
  ADMIN_CLIENTS = '/admin/clients',
  ADMIN_SCHEDULE = '/admin/schedule',
  ADMIN_FINANCE = '/admin/finance',
  ADMIN_TASKS = '/admin/tasks'
}
