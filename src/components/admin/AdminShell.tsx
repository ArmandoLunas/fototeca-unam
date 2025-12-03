'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import AdminSidebar from './AdminSidebar';
import Footer from '@/components/layout/Footer';

export default function AdminShell({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* HEADER */}
      <header className="h-32 bg-[#0f2743] text-white flex items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <Image src="/fi-escudo-color.png" alt="Escudo" width={100} height={100} />
          <span className="text-5xl font-semibold tracking-wide">Fototeca</span>
          <span className="text-white/60 text-3xl">|</span>
          <span className="text-2xl">Administración</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Mismo contenedor siempre, sin cambiar a <span> vs <button> */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setUserMenu(v => !v)}
            >
              {/* Icono usuario */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <span className="font-semibold text-white text-sm">
                {session?.user?.name || 'Usuario'}
              </span>
            </button>

            {userMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-neutral-800 rounded shadow-lg py-2 z-50">
                <Link
                  href="/home"
                  className="block px-4 py-2 hover:bg-neutral-200 text-sm"
                  onClick={() => setUserMenu(false)}
                >
                  Inicio
                </Link>

                <Link
                  href="/home/cuenta"
                  className="block px-4 py-2 hover:bg-neutral-200 text-sm"
                  onClick={() => setUserMenu(false)}
                >
                  Cuenta
                </Link>

                <Link
                  href="/home/aportaciones"
                  className="block px-4 py-2 hover:bg-neutral-200 text-sm"
                  onClick={() => setUserMenu(false)}
                >
                  Aportaciones
                </Link>

                <Link
                  href="/home/favoritos"
                  className="block px-4 py-2 hover:bg-neutral-200 text-sm"
                  onClick={() => setUserMenu(false)}
                >
                  Favoritos
                </Link>

                <button
                  onClick={() => {
                    setUserMenu(false);
                    signOut({ callbackUrl: '/home' });
                  }}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-red-700 hover:bg-red-100 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO + SIDEBAR */}
      <div className="flex flex-1">
        <aside className="w-60 bg-[#2b3b4f]">
          <AdminSidebar />
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
