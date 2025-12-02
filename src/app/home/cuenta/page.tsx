import TopBar from '@/components/public/TopBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/cuenta');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user!.id },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      isActive: true,
    },
  });

  if (!dbUser) {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Datos de la cuenta</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Nombre</p>
          <p className="text-sm text-neutral-800">{dbUser.name || 'Sin nombre'}</p>
        </div>

        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Correo electrónico</p>
          <p className="text-sm text-neutral-800">{dbUser.email}</p>
        </div>

        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold">Contraseña</p>
          <p className="text-sm text-neutral-800">••••••••••</p>
          <p className="text-xs text-neutral-500 mt-1">
            Por seguridad no mostramos tu contraseña. Si necesitas cambiarla, pídenoslo por soporte.
          </p>
        </div>
      </div>
    </div>

  );
}
