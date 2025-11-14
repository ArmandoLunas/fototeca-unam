import SectionFrame from '@/components/public/SectionFrame';

export default function HomePage() {
  return (
    <>
      {/* Hero frame */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="mt-8 h-128 rounded-md border border-dashed bg-white shadow-sm flex items-center justify-center text-neutral-500">
          Carrusel
        </div>
      </section>

      {/* Sección “Laboratorios” a modo de ejemplo */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-lg text-blue-900 font-semibold mb-4">Laboratorios</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-md border border-dashed bg-white shadow-sm flex items-center justify-center text-neutral-500"
            >
              Imagen {i + 1}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}