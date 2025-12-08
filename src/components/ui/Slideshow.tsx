"use client";

import { useState } from "react";
import Image from "next/image";

interface SlideshowProps {
    images: string[];
    title?: string;
}

export default function Slideshow({ images, title }: SlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-96 bg-neutral-200 rounded-xl flex items-center justify-center text-neutral-400">
                Sin imágenes
            </div>
        );
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative flex flex-col items-center py-6 group">
            {/* Image Container matching Carousel dimensions and style */}
            <div className="relative w-full max-w-5xl h-[550px] rounded-lg overflow-hidden shadow-lg bg-neutral-100">
                <Image
                    src={images[currentIndex]}
                    alt={title ? `${title} - imagen ${currentIndex + 1}` : `Imagen ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Controls - Only show if more than 1 image */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                            aria-label="Imagen anterior"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                            aria-label="Siguiente imagen"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Indicators matching Carousel style */}
            {images.length > 1 && (
                <div className="absolute bottom-10 flex gap-2 z-10">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${idx === currentIndex ? "bg-gray-800" : "bg-gray-400"
                                }`}
                            aria-label={`Ir a imagen ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
