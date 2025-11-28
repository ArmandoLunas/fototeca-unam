import { prisma } from "@/lib/db";

export default async function ExposicionPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { blocks: { orderBy: { order: "asc" } } }
  });

  if (!post) return <p>Publicación no encontrada</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-blue-900">{post.titulo}</h1>

      {post.blocks.map((b, idx) => {
        const hasImage = !!b.imageUrl;
        const isEven = idx % 2 === 0; // 0,2,4 → even; 1,3,5 → odd

        // CASO SIN IMAGEN → CENTRADO
        if (!hasImage) {
            return (
            <div key={b.id} className="max-w-3xl mx-auto py-4">
                {b.tituloSeccion && (
                <h2 className="text-2xl font-semibold text-center mb-2">{b.tituloSeccion}</h2>
                )}
                <p className="text-justify text-lg leading-relaxed">
                {b.descripcion}
                </p>
            </div>
            );
        }

        // CASO CON IMAGEN → INTERCALADO
        return (
            <div
            key={b.id}
            className={`flex flex-col md:flex-row items-start gap-6 py-6`}
            >
            {/* TEXTO */}
            <div
                className={`flex-1 prose text-justify ${
                isEven ? "md:order-1" : "md:order-2"
                }`}
            >
                {b.tituloSeccion && (
                <h2 className="text-2xl text-neutral-800 font-semibold mb-2">{b.tituloSeccion}</h2>
                )}
                <p className="text-lg text-neutral-700 leading-relaxed">{b.descripcion}</p>
            </div>

            {/* IMAGEN */}
            <img
                src={b.imageUrl}
                alt=""
                className={`w-full md:w-80 rounded-md shadow-md object-cover ${
                isEven ? "md:order-2" : "md:order-1"
                }`}
            />
            </div>
        );
        })}

    </div>
  );
}
