'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Columns,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    router.push('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isActiveLink = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  const getLinkClass = (path: string) => {
    const active = isActiveLink(path);
    return `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${
      active
        ? 'bg-amber-600 text-white shadow-lg'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Patrícia
            </h1>
            <p className="text-[9px] text-amber-400 uppercase tracking-[0.3em] font-black mt-1">
              Transista Profissional
            </p>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <Link
            href="/admin"
            onClick={closeSidebar}
            className={getLinkClass('/admin')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            href="/admin/clients"
            onClick={closeSidebar}
            className={getLinkClass('/admin/clients')}
          >
            <Users size={20} /> Clientes
          </Link>
          <Link
            href="/admin/schedule"
            onClick={closeSidebar}
            className={getLinkClass('/admin/schedule')}
          >
            <Calendar size={20} /> Agenda
          </Link>
          <Link
            href="/admin/tasks"
            onClick={closeSidebar}
            className={getLinkClass('/admin/tasks')}
          >
            <Columns size={20} /> Tarefas
          </Link>
          <Link
            href="/admin/finance"
            onClick={closeSidebar}
            className={getLinkClass('/admin/finance')}
          >
            <DollarSign size={20} /> Financeiro
          </Link>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold border border-red-500/20"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              aria-label="Alternar menu"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
              Painel de Controle
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                Patrícia Transista
              </p>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                Artista Capilar
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-500 shadow-md p-0.5 object-cover"
              alt="Patrícia"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
          <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
