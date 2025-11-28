import { prisma } from "@/lib/db";

export default async function EfemeridesPage() {

  // obtener posts cuyo tipo es "Efeméride"
  const posts = await prisma.post.findMany({
    where: { tipo: "Efeméride" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Efemérides</h1>

      {posts.length === 0 && (
        <p className="text-neutral-600">
          No hay efemérides registradas aún.
        </p>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-blue-900">
              {post.titulo}
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              Publicado el {post.createdAt.toLocaleDateString()}
            </p>

            <a
              href={`/home/novedades/efemerides/${post.id}`}
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
