'use client';

import Link from 'next/link';
import Image from 'next/image';
import HamburgerMenu from './HamburgerMenu';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';

import {
  SECTIONS,
  labelFromSlug,
  type SectionSlug,
} from '@/lib/sections';

type TopBarProps = {
  /** Texto manual (override). Si no se pasa, se intenta deducir de la ruta. */
  section?: string;
};

function useAutoSectionLabel(manualLabel?: string) {
  const pathname = usePathname();

  return useMemo(() => {
    if (manualLabel) return manualLabel;

    const parts = pathname.split('/').filter(Boolean);

    const match = [...parts].reverse().find(part =>
      SECTIONS.some(s => s.slug === part)
    );

    if (!match) return undefined;

    return labelFromSlug(match as SectionSlug);
  }, [manualLabel, pathname]);
}

export default function TopBar({ section }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { data: session } = useSession();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const sectionLabel = useAutoSectionLabel(section);

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
    <div className="w-full bg-[#caa357] text-white relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-32 flex items-center justify-between">
          
          {/* IZQUIERDA: LOGO + SECCIÓN */}
          <div className="flex items-center gap-6">
            {/* Logo que lleva a la página de Ingeniería UNAM */}
            <Link
              href="https://www.ingenieria.unam.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Image 
                src="/fi-escudo-color.png" 
                alt="Escudo FI UNAM" 
                width={100} 
                height={100} 
              />
              <span className="text-5xl font-semibold">Fototeca</span>
            </Link>

            {sectionLabel && (
              <>
                <span className="text-white/80">|</span>
                <span className="text-base text-white/90">
                  {sectionLabel}
                </span>
              </>
            )}
          </div>

          {/* DERECHA */}
          <div className="flex items-center gap-6">
            {/* SI NO HAY SESIÓN → BOTÓN INGRESAR */}
            {!session && (
              <Link
                href="/login"
                className="rounded bg-[#0f2743] px-4 py-2 text-sm font-semibold shadow hover:bg-[#0c1f36]"
              >
                Ingresar
              </Link>
            )}

            {/* SI HAY SESIÓN → MENÚ DE USUARIO */}
            {session && (
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
                    {session.user?.name || "Usuario"}
                  </span>
                </button>

                {/* DROPDOWN USUARIO */}
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-neutral-800 rounded shadow-lg py-2 z-50">
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
                        signOut({ callbackUrl: "/home" });
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
            )}

            {/* Imagen extra al extremo derecho */}
            <div className="hidden md:block">
              <Image
                src="/LOGOFotoTeca.png" // cambia a otra imagen si quieres
                alt="Logo extra"
                width={150}
                height={150}
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        <HamburgerMenu open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
