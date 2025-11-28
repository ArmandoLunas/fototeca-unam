import { prisma } from '@/lib/db';
import PostSectionRenderer, { PublicSection } from '@/components/public/PostSectionRenderer';
import TopBar from '@/components/public/TopBar';

export default async function ExposicionesPage() {
  const posts = await prisma.post.findMany({
    where: { tipo: 'Exposiciones' },
    include: { blocks: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  const post = posts[0];
  let sections: PublicSection[] = [];

  if (post) {
    sections = post.blocks.map(b => ({
      id: b.id,
      heading: b.tituloSeccion || undefined,
      text: b.descripcion,
      imageUrl: b.imageUrl || undefined,
    }));
  }

  return (
    <>
      <TopBar section="Exposiciones" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Exposiciones</h1>
        <div className="bg-white rounded-lg shadow-sm">
          {post ? (
            <PostSectionRenderer sections={sections} />
          ) : (
            <div className="p-6 text-neutral-600">
              Aún no hay exposiciones publicadas.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
