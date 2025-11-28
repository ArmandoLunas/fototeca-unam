import type { ReactNode } from 'react';
import TopBar from '@/components/public/TopBar';
import FloatingMenuButton from '@/components/public/FloatingMenuButton';
import Footer from '@/components/layout/Footer'; 

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <TopBar />
      <main>{children}</main>
      <FloatingMenuButton />  {/* ← flotante, no en el header */}

      <footer className="mt-8 bg-[#0f2743] text-white/80">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs leading-5">
          Universidad Nacional Autónoma de México — Derechos reservados.
        </div>
      </footer>
    </div>
  );
}