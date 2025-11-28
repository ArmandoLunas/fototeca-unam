import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { labelFromSlug } from '@/lib/sections';
import AdminTable from '@/components/admin/AdminTable';
import { prisma } from '@/lib/db';

type Props = { params: { section: string } };

export default async function SectionPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const sectionSlug = params.section as any;

  const tipo = labelFromSlug(sectionSlug); // ej: 'Biografías', 'Efemérides', ...

  const posts = await prisma.post.findMany({
    where: { tipo },
    orderBy: { createdAt: 'desc' },
  });

  const rows = posts.map(p => ({
    id: p.id,
    titulo: p.titulo,
    descripcion: '', // si quieres, podrías usar el primer bloque luego
    fechaCreacion: p.createdAt.toLocaleDateString('es-MX'),
    fechaInicio: p.fechaInicio ? p.fechaInicio.toLocaleDateString('es-MX') : undefined,
    fechaFin: p.fechaFin ? p.fechaFin.toLocaleDateString('es-MX') : undefined,
  }));

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl text-blue-950 font-semibold">{labelFromSlug(sectionSlug)}</h1>
        <p className="text-sm text-neutral-600">
          Bienvenido, {session?.user?.name || session?.user?.email} ({(session as any)?.user?.role ?? 'usuario'})
        </p>
      </div>

      <AdminTable sectionSlug={sectionSlug} rows={rows} />
    </div>
  );
}
