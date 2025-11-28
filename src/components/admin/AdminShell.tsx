'use client';
import Image from 'next/image';
import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Footer from '@/components/layout/Footer'; 


export default function AdminShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-dvh bg-neutral-100">
            <header className="h-32 bg-[#0f2743] text-white flex items-center justify-between px-5">
                <div className="flex items-center gap-4">
                    <Image src="/fi-escudo-color.png" alt="Escudo" width={100} height={100} />
                    <span className="text-5xl font-semibold tracking-wide">Fototeca</span>
                    <span className="text-white/60 text-3xl">|</span>
                    <span className="text-2xl">Administración</span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        className="text-sm hover:underline"
                        onClick={() => { window.location.href = '/api/auth/signout'; }}
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                    >
                        Cerrar sesión ↪
                    </button>
                </div>
            </header>

            <div className="flex">
                <aside className="w-60 bg-[#2b3b4f]">
                    <AdminSidebar />
                </aside>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

          {/* FOOTER REUTILIZABLE ABAJO DE TODO */}
      <Footer />
    </div>
  );
}