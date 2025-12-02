"use client";

import { useState } from "react";
import ModalImage from "./ModalImage";

type Props = {
  images: {
    src: string;
    title: string;
    description: string;
  }[];
};

export default function GalleryGrid({ images }: Props) {
  const [modalData, setModalData] = useState<null | {
    src: string;
    title: string;
    description: string;
  }>(null);

  return (
    <section className="px-8 py-8">
      <h2 className="text-3xl font-semibold text-blue-900 mb-6">Laboratorios</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {images.map((img, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => setModalData(img)}
          >
            <img
              src={img.src}
              className="rounded-lg w-full h-40 object-cover shadow-md"
            />
            <p className="text-center mt-2 text-gray-700 font-medium">
              {img.title}
            </p>
          </div>
        ))}
      </div>

      {modalData && (
        <ModalImage {...modalData} onClose={() => setModalData(null)} />
      )}
    </section>
  );
}
