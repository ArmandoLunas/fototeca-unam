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
      {/* Este div se ajusta al tamaño de la imagen */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen: el tamaño manda */}
        <img
          src={src}
          alt={title}
          className="block max-w-[90vw] max-h-[90vh] w-auto h-auto rounded-lg"
        />

        {/* Sombra gradiente exactamente del tamaño de la imagen */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/80 rounded-lg" />

        {/* Título arriba */}
        <h2 className="absolute top-4 left-4 text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
          {title}
        </h2>

        {/* Descripción abajo */}
        <p className="absolute bottom-10 right-4 text-white text-sm md:text-lg max-w-xs md:max-w-md text-right drop-shadow-lg">
          {description}
        </p>

        {/* Ver más */}
        <a
          href={`/detalle?src=${encodeURIComponent(src)}&title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`}
          className="absolute bottom-3 right-4 text-white underline text-sm md:text-base"
        >
          ver más +
        </a>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-2xl md:text-3xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
