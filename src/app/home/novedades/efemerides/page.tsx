"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SortOption = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc";

interface PostBlock {
  id: string;
  imageUrls: string[];
}

interface Post {
  id: string;
  titulo: string;
  createdAt: string;
  fechaEfemeride: string | null;
  blocks: PostBlock[];
}

export default function EfemeridesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts/efemerides");
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
      switch (sortOption) {
        case "date-desc": {
          const dateA = a.fechaEfemeride ? new Date(a.fechaEfemeride).getTime() : new Date(a.createdAt).getTime();
          const dateB = b.fechaEfemeride ? new Date(b.fechaEfemeride).getTime() : new Date(b.createdAt).getTime();
          return dateB - dateA;
        }
        case "date-asc": {
          const dateA = a.fechaEfemeride ? new Date(a.fechaEfemeride).getTime() : new Date(a.createdAt).getTime();
          const dateB = b.fechaEfemeride ? new Date(b.fechaEfemeride).getTime() : new Date(b.createdAt).getTime();
          return dateA - dateB;
        }
        case "alpha-asc":
          return a.titulo.localeCompare(b.titulo);
        case "alpha-desc":
          return b.titulo.localeCompare(a.titulo);
        default:
          return 0;
      }
    });
    setSortedPosts(sorted);
  }, [sortOption, posts]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Efemérides</h1>
        <p className="text-neutral-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Efemérides</h1>

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
            <option value="date-desc">Fecha (más reciente)</option>
            <option value="date-asc">Fecha (más antigua)</option>
            <option value="alpha-asc">Alfabético (A-Z)</option>
            <option value="alpha-desc">Alfabético (Z-A)</option>
          </select>
        </div>
      </div>

      {sortedPosts.length === 0 && (
        <p className="text-neutral-600">
          No hay efemérides registradas aún.
        </p>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => {
          const firstImage = post.blocks.find((block) => block.imageUrls && block.imageUrls.length > 0)?.imageUrls?.[0];

          return (
            <Link
              key={post.id}
              href={`/home/novedades/efemerides/${post.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative w-full h-48 bg-neutral-200">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={post.titulo}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Title and Date */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.titulo}
                  </h2>
                  {post.fechaEfemeride && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 w-fit">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-800">
                        {(() => {
                          const date = new Date(post.fechaEfemeride);
                          return new Intl.DateTimeFormat('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                          }).format(date);
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
