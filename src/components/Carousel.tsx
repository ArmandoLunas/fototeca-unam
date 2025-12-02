"use client";

import { useEffect, useState } from "react";
import ModalImage from "./ModalImage";

type Props = {
  images: {
    src: string;
    title?: string;
    description?: string;
  }[];
};

export default function Carousel({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalData, setModalData] = useState<null | {
    src: string;
    title: string;
    description: string;
  }>(null);

  // Cambiar automáticamente cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* IMAGEN PRINCIPAL */}
      <div className="w-full max-w-5xl h-[550px] rounded-lg overflow-hidden shadow-lg">
        <img
          src={images[currentIndex].src}
          alt=""
          className="w-full h-full object-cover cursor-pointer"
          onClick={() =>
            setModalData({
              src: images[currentIndex].src,
              title: images[currentIndex].title ?? "Sin título",
              description: images[currentIndex].description ?? "Sin descripción",
            })
          }
        />
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      {/* MODAL */}
      {modalData && (
        <ModalImage
          {...modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
