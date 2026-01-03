import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Patrícia Transista - Arte em Tranças',
  description: 'Especialista em Box Braids, Nagô e Penteados Afro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFFAF3] text-slate-900 font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
