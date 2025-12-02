import { prisma } from "@/lib/db";

export default async function SabiasQuePostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { blocks: { orderBy: { order: "asc" } } }
  });

  if (!post) {
    return <div className="p-8 text-red-600">Publicación no encontrada</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      {/* Título */}
      <h1 className="text-3xl font-bold text-blue-900 text-center">
        {post.titulo}
      </h1>

      {/* Bloques */}
      {post.blocks.map(b => (
        <div key={b.id} className="space-y-6 text-center">

          {/* Imagen: solo si existe */}
          {b.imageUrl && (
            <img
              src={b.imageUrl}
              className="w-full max-w-md mx-auto rounded-md shadow"
              alt={b.tituloSeccion || ""}
            />
          )}

          {/* Texto */}
          <div className="space-y-2">
            {b.tituloSeccion && (
              <h2 className="text-xl font-semibold text-blue-900">
                {b.tituloSeccion}
              </h2>
            )}
            <p className="text-neutral-700">{b.descripcion}</p>
          </div>

        </div>
      ))}
    </div>
  );
}
