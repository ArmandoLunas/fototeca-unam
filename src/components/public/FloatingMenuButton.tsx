'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // Solo añade el listener si ref.current existe
    if (ref.current) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [ref, handler]);
}

export default function FloatingMenuButton() {
  const [open, setOpen] = useState(false);
  const [openNovedades, setOpenNovedades] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(panelRef, () => {
    setOpen(false);
    setOpenNovedades(false);
  });

  return (
    <>
      {/* Botón flotante circular gris con "tres rayas" */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir menú"
        className="
          fixed z-50
          top-40 left-18 md:bottom-8 md:right-20
          h-12 w-12 rounded-full
          bg-neutral-300 hover:bg-neutral-400
          text-neutral-800
          shadow-lg ring-1 ring-black/10
          flex items-center justify-center
        "
      >
        {/* Icono "hamburger" con tres líneas */}
        <span className="text-xl">☰</span>
      </button>

      {/* Panel flotante */}
      {open && (
        <div
          ref={panelRef}
          className="
            fixed z-50
            top-40 left-32 md:right-8
            w-64
            bg-white rounded-lg shadow-xl ring-1 ring-black/10
            overflow-hidden
          "
        >
          <nav className="py-2 text-sm text-neutral-800">
            <ul className="divide-y divide-neutral-100">
              <li>
                <Link
                  href="/home"
                  className="block px-4 py-3 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  Inicio
                </Link>
              </li>

              <li className="relative">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-neutral-50 flex items-center justify-between"
                  onClick={() => setOpenNovedades(v => !v)}
                  aria-expanded={openNovedades}
                >
                  <span>Novedades</span>
                  <span className="text-xs">{openNovedades ? '▾' : '▸'}</span>
                </button>

                {/* Submenú flotante */}
                {openNovedades && (
                  <div
                    className="
                      absolute z-50
                      top-0 left-full
                      ml-2
                      w-56 bg-white rounded-md shadow-xl ring-1 ring-black/10
                    "
                  >
                    <ul className="py-1 text-sm">
                      <li>
                        <Link
                          href="/home/novedades/sabias-que"
                          className="block px-4 py-2 hover:bg-neutral-50"
                          onClick={() => {
                            setOpen(false);
                            setOpenNovedades(false);
                          }}
                        >
                          ¿Sabías Qué?
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home/novedades/efemerides"
                          className="block px-4 py-2 hover:bg-neutral-50"
                          onClick={() => {
                            setOpen(false);
                            setOpenNovedades(false);
                          }}
                        >
                          Efemérides
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/home/novedades/biografias"
                          className="block px-4 py-2 hover:bg-neutral-50"
                          onClick={() => {
                            setOpen(false);
                            setOpenNovedades(false);
                          }}
                        >
                          Biografías
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <Link
                  href="/home/favoritos"
                  className="block px-4 py-3 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  Favoritos
                </Link>
              </li>

              <li>
                <Link
                  href="/home/exposiciones"
                  className="block px-4 py-3 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  Exposiciones
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}