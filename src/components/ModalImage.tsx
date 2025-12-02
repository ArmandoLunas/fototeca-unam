"use client";

type Props = {
  src: string;
  title: string;
  description: string;
  onClose: () => void;
};

export default function ModalImage({ src, title, description, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-[85%] max-w-4xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenedor con sombras arriba/abajo */}
        <div className="relative">
          <img src={src} className="w-full rounded-lg" />

          {/* Sombra gradiente */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-transparent to-black opacity-80" />

          {/* Título arriba */}
          <h2 className="absolute top-6 left-6 text-white text-3xl font-bold drop-shadow-lg">
            {title}
          </h2>

          {/* Descripción abajo */}
          <p className="absolute bottom-10 right-6 text-white text-lg max-w-md text-right drop-shadow-lg">
            {description}
          </p>

          {/* Ver más */}
          <a
            href={`/detalle?src=${encodeURIComponent(src)}&title=${encodeURIComponent(
              title
            )}&description=${encodeURIComponent(description)}`}
            className="absolute bottom-4 right-6 text-white underline"
          >
            ver más +
          </a>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white text-3xl"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
