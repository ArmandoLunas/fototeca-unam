import { prisma } from "@/lib/db";
import Slideshow from "@/components/ui/Slideshow";

import Link from "next/link";
import Image from "next/image";

export default async function BiografiaPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { blocks: { orderBy: { order: 'asc' } } }
  });

  if (!post) {
    return <div className="text-center py-12 text-neutral-500">Publicación no encontrada</div>;
  }

  // Fetch recommendations: 3 random posts of type "Biografía" excluding current
  const allBiografias = await prisma.post.findMany({
    where: {
      tipo: "Biografía",
      id: { not: params.id }
    },
    select: {
      id: true,
      titulo: true,
      nombres: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      blocks: {
        take: 1,
        select: { imageUrls: true }
      }
    }
  });

  // Shuffle and take 3
  const recommendations = allBiografias
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Extract all images from blocks (flatten imageUrls arrays)
  const images = post.blocks
    .flatMap(b => b.imageUrls)
    .filter((url): url is string => !!url);

  // Display name: use name parts if available, otherwise use titulo
  const displayName = post.apellidoPaterno
    ? `${post.nombres || ''} ${post.apellidoPaterno} ${post.apellidoMaterno || ''}`.trim()
    : post.titulo;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header: Title (no date for biografías) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 flex-1">
          {displayName}
        </h1>
      </div>

      {/* Slideshow */}
      <div className="w-full">
        <Slideshow images={images} title={displayName} />
      </div>

      {/* Description Content */}
      <div className="max-w-4xl mx-auto space-y-8 pt-4">
        {post.blocks.map((b) => (
          <div key={b.id} className="prose prose-lg max-w-none text-justify text-neutral-700">
            {b.tituloSeccion && (
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">{b.tituloSeccion}</h2>
            )}
            <p className="leading-relaxed whitespace-pre-line">
              {b.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="pt-12 border-t border-neutral-200 mt-12">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Te podría interesar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => {
              const recImage = rec.blocks[0]?.imageUrls?.[0];
              const recDisplayName = rec.apellidoPaterno
                ? `${rec.nombres || ''} ${rec.apellidoPaterno} ${rec.apellidoMaterno || ''}`.trim()
                : rec.titulo;

              return (
                <Link key={rec.id} href={`/home/novedades/biografias/${rec.id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative w-full h-48 bg-neutral-200">
                      {recImage ? (
                        <Image
                          src={recImage}
                          alt={recDisplayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Title (no date for biografías) */}
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <h4 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {recDisplayName}
                      </h4>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
