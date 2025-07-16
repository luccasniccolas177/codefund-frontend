// --- /app/layout.js (Rediseñado) ---
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CodeFund DApp',
  description: 'Crowdfunding descentralizado para proyectos de código.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
              {children}
            </main>
            <footer className="text-center p-6 text-slate-500 text-sm border-t border-slate-200">
              CodeFund &copy; 2025 - Plataforma de Crowdfunding Descentralizado
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
