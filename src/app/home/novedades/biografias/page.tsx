"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SortOption = "apellido-asc" | "apellido-desc";

interface PostBlock {
  id: string;
  imageUrls: string[];
}

interface Post {
  id: string;
  titulo: string;
  nombres: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  blocks: PostBlock[];
}

export default function BiografiasPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("apellido-asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts/biografias");
        const data = await response.json();
        setPosts(data);
        setSortedPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      const apellidoA = a.apellidoPaterno || a.titulo;
      const apellidoB = b.apellidoPaterno || b.titulo;

      if (sortOption === "apellido-asc") {
        return apellidoA.localeCompare(apellidoB, 'es');
      } else {
        return apellidoB.localeCompare(apellidoA, 'es');
      }
    });
    setSortedPosts(sorted);
  }, [sortOption, posts]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Biografías</h1>
        <p className="text-neutral-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Biografías</h1>

        {/* Sort Menu */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-neutral-700">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="apellido-asc">Apellido (A-Z)</option>
            <option value="apellido-desc">Apellido (Z-A)</option>
          </select>
        </div>
      </div>

      {sortedPosts.length === 0 && (
        <p className="text-neutral-600">
          No hay biografías registradas aún.
        </p>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => {
          const firstImage = post.blocks.find((block) => block.imageUrls && block.imageUrls.length > 0)?.imageUrls?.[0];

          // Display name: use name parts if available, otherwise use titulo
          const displayName = post.apellidoPaterno
            ? `${post.nombres || ''} ${post.apellidoPaterno} ${post.apellidoMaterno || ''}`.trim()
            : post.titulo;

          return (
            <Link
              key={post.id}
              href={`/home/novedades/biografias/${post.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative w-full h-48 bg-neutral-200">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Name (no date) */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {displayName}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
