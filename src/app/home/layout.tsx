import type { ReactNode } from 'react';
import TopBar from '@/components/public/TopBar';
import FloatingMenuButton from '@/components/public/FloatingMenuButton';
import Footer from '@/components/layout/Footer';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* Botón flotante (no afecta al layout porque suele ir fixed/absolute) */}
        <FloatingMenuButton />
      {/* BARRA SUPERIOR PÚBLICA */}
      <TopBar />
      {/* CONTENIDO DEL HOME */}
      <main className="flex-1 relative">
        {children}

        
      </main>

      {/* FOOTER REUTILIZABLE SIEMPRE HASTA ABAJO */}
      <Footer />
    </div>
  );
}
