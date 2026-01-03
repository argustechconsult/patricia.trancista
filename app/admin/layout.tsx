'use client';

import AdminLayout from '@/components/AdminLayout';
import { useAppContext } from '@/context/AppContext';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleLogout } = useAppContext();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}
