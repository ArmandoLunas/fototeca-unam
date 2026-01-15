// app/components/layout/Footer.tsx
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#003D79] text-white text-xs py-15 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          
          <Image
            src="/Logo.png"
            alt="UNAM"
            width={150}
            height={80}
          />
          
        </div>

        <div className="text-[10px] md:text-[11px] text-center">
          <p>Universidad Nacional Autónoma de México — Derechos reservados.</p>
          <p>
            Facultad de Ingeniería, Av. Universidad 3000, Ciudad Universitaria,
            Coyoacán, CDMX, C.P. 04510.
          </p>
        </div>

        <div className="text-[11px]">
          <a
            href="/aviso-de-privacidad"
            className="underline underline-offset-2 hover:text-slate-200"
          >
            Aviso de privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
