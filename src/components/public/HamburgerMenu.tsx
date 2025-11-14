'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function HamburgerMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [novOpen, setNovOpen] = useState(false);

  if (!open) return null;

  return (
    <nav
      id="main-menu"
      className="bg-white text-[#0f2743] rounded-md shadow mb-4 max-w-6xl mx-auto px-4 py-2"
      aria-label="Menú principal"
    >
      <ul className="divide-y">
        <li>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="w-full text-left flex items-center justify-between gap-4"
              onClick={() => setNovOpen(v => !v)}
              aria-expanded={novOpen}
              aria-controls="submenu-novedades"
            >
              <span>Novedades</span>
              <span className="text-sm">{novOpen ? '▾' : '▸'}</span>
            </button>
          </div>

          {novOpen && (
            <ul id="submenu-novedades" className="bg-neutral-50 border-t">
              <li>
                <Link
                  href="/home/novedades/sabias-que"
                  onClick={onClose}
                  className="block px-6 py-3 hover:bg-neutral-100"
                >
                  ¿Sabías Qué?
                </Link>
              </li>
              <li>
                <Link
                  href="/home/novedades/efemerides"
                  onClick={onClose}
                  className="block px-6 py-3 hover:bg-neutral-100"
                >
                  Efemérides
                </Link>
              </li>
              <li>
                <Link
                  href="/home/novedades/biografias"
                  onClick={onClose}
                  className="block px-6 py-3 hover:bg-neutral-100"
                >
                  Biografías
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            href="/home/favoritos"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-neutral-50"
          >
            Favoritos
          </Link>
        </li>

        <li>
          <Link
            href="/home/exposiciones"
            onClick={onClose}
            className="block px-4 py-3 hover:bg-neutral-50"
          >
            Exposiciones
          </Link>
        </li>
      </ul>
    </nav>
  );
}