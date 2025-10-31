import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Panel de Administración</h1>
      <p className="text-sm text-gray-600">
        Bienvenido, {session?.user?.name || session?.user?.email} ({session?.user.role})
      </p>
      <div className="mt-6">
        {/* Aquí luego pondremos el dashboard, cards, etc. */}
        <ul className="list-disc ml-6">
          <li>Gestionar imágenes</li>
          <li>Novedades (sabías qué, efemérides, biografías, exposiciones)</li>
          <li>Eventos</li>
          <li>Sugerencias</li>
          <li>Políticas y privacidad</li>
        </ul>
      </div>
    </div>
  );
}
