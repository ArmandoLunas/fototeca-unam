import { prisma } from "@/lib/db";
import CategorySearch from "@/components/public/CategorySearch";

type PageProps = {
  searchParams: {
    q?: string;
  };
};

export default async function SabiasQuePage({ searchParams }: PageProps) {
  const q = searchParams.q?.trim() || "";

  const posts = await prisma.post.findMany({
    where: {
      tipo: "¿Sabías qué?",
      ...(q
        ? {
            titulo: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">¿Sabías qué?</h1>

      {/* Buscador reutilizando tu componente */}
      <CategorySearch placeholder="Buscar por título..." />

      {posts.length === 0 && (
        <p className="text-neutral-600">No hay publicaciones aún.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-blue-900">
              {post.titulo}
            </h2>

            <p className="text-neutral-600 text-sm mt-2">
              Publicado el{" "}
              {post.createdAt
                .toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })
                .toLocaleUpperCase()}
            </p>

            <a
              href={`/home/novedades/sabias-que/${post.id}`}
              className="text-blue-700 underline mt-4 inline-block"
            >
              Ver publicación →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
