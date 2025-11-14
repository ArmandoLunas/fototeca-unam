'use client';
import Link from 'next/link';
import Image from 'next/image';
import HamburgerMenu from './HamburgerMenu';
import { useState } from 'react';

export default function TopBar({ section }: { section?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-[#caa357] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-32 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="flex items-center gap-3">
              <Image src="/fi-escudo-color.png" alt="Escudo" width={100} height={100} />
              <span className="text-5xl font-semibold">Fototeca</span>
            </Link>

            {section && (
              <>
                <span className="text-white/80">|</span>
                <span className="text-base text-white/90">{section}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Opcional: icono de cámara */}
            {/* <Image src="/camera.svg" alt="Camera" width={28} height={28} /> */}

            <Image
              src="/LOGOFotoTeca.png"
              alt="Foto de usuario"
              width={150}
              height={150}
              className="rounded-full object-cover"
            />

            <div className="flex flex-col items-end">
              <button
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-2 rounded bg-[#0f2743] px-3 py-1 text-sm font-semibold shadow hover:bg-[#0c1f36]"
                aria-expanded={open}
                aria-controls="main-menu"
              >
                ☰ Menú
              </button>
            </div>
          </div>
        </div>

        <HamburgerMenu open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}