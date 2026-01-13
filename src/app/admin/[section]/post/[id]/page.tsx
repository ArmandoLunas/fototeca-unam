import { redirect } from "next/navigation";
import { prisma } from '@/lib/db';
import NewPostForm from '@/components/admin/NewPostForm';
import { labelFromSlug } from '@/lib/sections';

type Props = {
  params: { section: string; id: string };
};

export default async function EditPostPage({ params }: Props) {
  const { section, id } = params;

  // Protección para evitar que “new” caiga aquí
  if (id === "new") {
    redirect(`/admin/${section}/post/new`);
  }

  // Esperamos que el parámetro esté completamente resuelto
  const post = await prisma.post.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: 'asc' } } },
  });

  if (!post) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-red-600">Publicación no encontrada</h1>
      </div>
    );
  }

  // Mapear los bloques para prepararlos para el formulario
  const initialBlocks = post.blocks.map(b => ({
    title: b.tituloSeccion || '',
    content: b.descripcion,
    imageUrls: b.imageUrls || [],  // Pass the array of image URLs
  }));

  const label = labelFromSlug(section as any);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-blue-950 font-semibold">
        Editar {label}: {post.titulo}
      </h1>

      <NewPostForm
        defaultType={post.tipo}
        postId={post.id}
        initialTitle={post.titulo}
        initialNombres={post.nombres || ''}
        initialApellidoPaterno={post.apellidoPaterno || ''}
        initialApellidoMaterno={post.apellidoMaterno || ''}
        initialBlocks={initialBlocks}
        initialFechaEfemeride={post.fechaEfemeride?.toISOString().split('T')[0] || null}
        section={section}
      />
    </div>
  );
}
