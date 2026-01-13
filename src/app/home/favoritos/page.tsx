'use client';

import { useState } from 'react';
import TopBar from '@/components/public/TopBar';
import ModalImage from '@/components/ModalImage'; // ajusta la ruta si es distinta

type ImageItem = {
  id: number;
  src: string;
  title: string;
  description: string;
};

const IMAGES: ImageItem[] = [
  {
    id: 1,
    src: '/castillo.jpg',
    title: 'Castillo de Chapultepec',
    description: 'Imagen aérea del castillo.',
  },
  {
    id: 2,
    src: '/sotero.jpg',
    title: 'Sotero prieto',
    description: 'Retrato de Sotero Prieto.',
  },
  {
    id: 3,
    src: '/mineria.jpg',
    title: 'Facultad de Ingeniería de Argentina',
    description: 'Argentina.',
  },
  {
    id: 4,
    src: '/niko2.jpg',
    title: 'Who!?',
    description: 'Pintura de un hombre desconcertado y su inocente esposa.',
  },
  {
    id: 5,
    src: '/Albert-Einstein.png',
    title: 'Albert Einstein',
    description: 'Tremendo outfit.',
  },
  {
    id: 6,
    src: '/palacio.png',
    title: 'Palacio de minería',
    description: 'Imegen reciente del palacio de minería.',
  },
  // agrega más objetos si quieres
];

export default function FavoritosPage() {
  const [selected, setSelected] = useState<ImageItem | null>(null);

  return (
    <>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Favoritos</h1>
        <p className="text-neutral-600 mb-6">
          Tus imágenes favoritas en un tablero tipo Pinterest.
        </p>

        {/* GRID ESTILO PINTEREST (MASONRY) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {IMAGES.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(img)}
              className="w-full mb-4 break-inside-avoid cursor-pointer group text-left"
            >
              <div className="overflow-hidden rounded-xl shadow-sm bg-white group-hover:shadow-md transition-shadow">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
              <p className="mt-2 text-sm text-neutral-800 group-hover:text-[#DC9B4F]">
                {img.title}
              </p>
            </button>
          ))}
        </div>

        {/* MODAL */}
        {selected && (
          <ModalImage
            src={selected.src}
            title={selected.title}
            description={selected.description}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </>
  );
}
