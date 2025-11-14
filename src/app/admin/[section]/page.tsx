import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { labelFromSlug } from '@/lib/sections';
import AdminTable from '@/components/admin/AdminTable';

type Props = { params: { section: string } };

export default async function SectionPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const sectionSlug = params.section as any;

  // Ejemplo de datos mock. Cambia esto por fetch a tu DB.
  const rows = [
    {
      id: '1',
      titulo: 'Nombre',
      descripcion: 'Descripción. Se mostrará con un límite de palabras…',
      fechaCreacion: '01-10-2025',
      fechaInicio: '01-10-2025',
      fechaFin: '22-10-2025',
    },
    {
      id: '2',
      titulo: 'Nombre',
      descripcion: 'Descripción. Se mostrará con un límite de palabras…',
      fechaCreacion: '01-10-2025',
      fechaInicio: '01-10-2025',
      fechaFin: '22-10-2025',
    },
  ];

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