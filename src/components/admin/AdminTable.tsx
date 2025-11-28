'use client';
import Link from 'next/link';

type Row = {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaInicio?: string;
  fechaFin?: string;
};

export default function AdminTable({
  sectionSlug,
  rows = [],
}: {
  sectionSlug: string;
  rows: Row[];
}) {

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    });

    const json = await res.json();
    if (json.ok) {
      alert('Publicación eliminada');
      window.location.reload(); // Recargar para mostrar la tabla actualizada
    } else {
      alert('Error al eliminar la publicación');
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Título</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha de creación</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha de inicio</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha de fin</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-600">{r.titulo}</div>
                  {r.descripcion && (
                    <p className="text-xs text-neutral-500 line-clamp-1">{r.descripcion}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-500">{r.fechaCreacion}</td>
                <td className="px-4 py-3 text-neutral-500">{r.fechaInicio || '—'}</td>
                <td className="px-4 py-3 text-neutral-500">{r.fechaFin || '—'}</td>
                <td className="px-4 py-3 text-right flex gap-2">
                  {/* Botón Editar */}
                  <Link
                    href={`/admin/${sectionSlug}/post/${r.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0f2743] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0c1f36]"
                  >
                    ◼ Editar
                  </Link>
                  {/* Botón Eliminar */}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-sm text-neutral-500" colSpan={5}>
                  No hay publicaciones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <Link
          href={`/admin/${sectionSlug}/post/new`}
          className="inline-flex items-center gap-2 rounded-full bg-[#0f2743] px-5 py-2 text-white font-semibold shadow hover:bg-[#0c1f36]"
        >
          Nueva ⊕
        </Link>
      </div>
    </div>
  );
}
