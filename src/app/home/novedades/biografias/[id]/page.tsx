import { prisma } from "@/lib/db";

export default async function BiografiaPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { blocks: { orderBy: { order: "asc" } } }
  });

  if (!post) return <p>Publicación no encontrada</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-blue-900">{post.titulo}</h1>

      {post.blocks.map((b, idx) => (
        <div key={b.id} className="flex flex-col md:flex-row gap-6 items-start">
          
          {b.imageUrl && (
            <img
              src={b.imageUrl}
              alt=""
              className={`w-80 rounded-md shadow-md ${
                idx % 2 === 0 ? "md:order-1" : "md:order-2"
              }`}
            />
          )}

          <div className="flex-1 prose text-justify">
            {b.tituloSeccion && (
              <h2 className="text-xl text-neutral-800 font-semibold">{b.tituloSeccion}</h2>
            )}
            <p className="text-neutral-700">{b.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
