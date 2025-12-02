'use client';

import Link from 'next/link';

export default function FavoritosPage() {
    const tipos = [
        { id: 'fotos', label: 'Fotos', icon: '📷' },
        { id: 'videos', label: 'Videos', icon: '🎥' },
        { id: 'documentos', label: 'Documentos', icon: '📄' },
        { id: 'colecciones', label: 'Colecciones', icon: '📚' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Favoritos</h1>

            <p className="text-neutral-600 mb-8">
                Selecciona el tipo de contenido favorito que deseas ver:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tipos.map((tipo) => (
                    <Link
                        key={tipo.id}
                        href={`/home/favoritos/${tipo.id}`}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-[#DC9B4F] group"
                    >
                        <div className="text-4xl mb-3 text-center">{tipo.icon}</div>
                        <h3 className="text-lg font-semibold text-center text-neutral-800 group-hover:text-[#DC9B4F] transition-colors">
                            {tipo.label}
                        </h3>
                    </Link>
                ))}
            </div>
        </div>

    );
}
