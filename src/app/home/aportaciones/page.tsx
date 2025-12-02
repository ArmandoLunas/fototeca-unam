import TopBar from '@/components/public/TopBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AportacionesPage() {
  const session = await getServerSession(authOptions);

  // Solo usuarios logueados pueden ver el formulario
  if (!session) {
    redirect('/login?callbackUrl=/aportaciones');
  }

  const user = session.user;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Aportaciones fotográficas</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Comparte con la Fototeca imágenes históricas o material de interés. El equipo revisará tu aportación
        y se pondrá en contacto contigo si es viable integrarla al acervo.
      </p>

      {/* FormSubmit: cambia el correo por uno tuyo para probar */}
      <form
        action="https://formsubmit.co/tu-correo@ejemplo.com"
        method="POST"
        className="bg-white rounded-lg shadow-sm border p-6 space-y-4"
      >
        {/* Config extra de FormSubmit */}
        <input type="hidden" name="_subject" value="Nueva aportación - Fototeca UNAM" />
        <input type="hidden" name="_captcha" value="false" />
        {/* Para que te redirija a una página de gracias si quieres */}
        {/* <input type="hidden" name="_next" value="https://tusitio.com/gracias" /> */}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre
          </label>
          <input
            name="nombre"
            defaultValue={user?.name || ''}
            className="w-full border rounded-md px-3 py-2 text-sm text-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Correo de contacto
          </label>
          <input
            type="email"
            name="correo"
            defaultValue={user?.email || ''}
            className="w-full border rounded-md px-3 py-2 text-sm text-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Descripción de la aportación
          </label>
          <textarea
            name="descripcion"
            className="w-full border rounded-md px-3 py-2 text-sm text-neutral-800 min-h-24"
            placeholder="Describe brevemente el contexto de la fotografía, fecha aproximada, lugar, personas, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Enlace a la(s) fotografía(s) (opcional)
          </label>
          <input
            name="enlace"
            className="w-full border rounded-md px-3 py-2 text-sm text-neutral-800"
            placeholder="Por ejemplo un enlace de Drive, OneDrive, Dropbox, etc."
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-[#0f2743] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c1f36]"
        >
          Enviar aportación
        </button>
      </form>
    </div>

  );
}
