'use client';
import { useState, useEffect } from 'react';

type SectionBlock = {
  id: string;
  tituloSeccion: string;
  descripcion: string;
  imagen?: File | null;
};

type InitialBlock = {
  title: string;
  content: string;
  imageUrl?: string | null;
};

type Props = {
  defaultType: string;   // ej. "¿Sabías qué?"
  postId?: string;       // si existe -> editar
  initialTitle?: string;
  initialBlocks?: InitialBlock[];
  initialFechaEfemeride?: string | null; // fecha manual para Efemérides
};

export default function NewPostForm({
  defaultType,
  postId,
  initialTitle,
  initialBlocks,
  initialFechaEfemeride,
}: Props) {
  // Tipo fijo según la pantalla / menú desde donde entras
  const [tipo] = useState(defaultType);

  const [titulo, setTitulo] = useState(initialTitle ?? '');
  const [fechaEfemeride, setFechaEfemeride] = useState(initialFechaEfemeride ?? '');
  const [bloques, setBloques] = useState<SectionBlock[]>([
    { id: crypto.randomUUID(), tituloSeccion: '', descripcion: '', imagen: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      setBloques(
        initialBlocks.map(b => ({
          id: crypto.randomUUID(),
          tituloSeccion: b.title,
          descripcion: b.content,
          imagen: null,
        }))
      );
    }
  }, [initialBlocks]);

  function addBloque() {
    setBloques(prev => [
      ...prev,
      { id: crypto.randomUUID(), tituloSeccion: '', descripcion: '', imagen: null },
    ]);
  }

  function setImagen(idx: number, file: File | null) {
    setBloques(prev => prev.map((b, i) => (i === idx ? { ...b, imagen: file } : b)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      if (postId) form.append('id', postId);
      form.append('tipo', tipo);      // 👈 se manda el tipo fijado
      form.append('titulo', titulo);

      // Solo agregar fechaEfemeride si el tipo es "Efeméride" y hay una fecha
      if (tipo === 'Efeméride' && fechaEfemeride) {
        form.append('fechaEfemeride', fechaEfemeride);
      }

      const blocksPayload = bloques.map(b => ({
        title: b.tituloSeccion,
        content: b.descripcion,
      }));
      form.append('blocks', JSON.stringify(blocksPayload));

      bloques.forEach((b, idx) => {
        if (b.imagen) form.append(`image_${idx}`, b.imagen);
      });

      const method = postId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/posts', { method, body: form });
      const json = await res.json();

      if (json.ok) {
        alert(postId ? 'Publicación actualizada' : 'Publicación creada');
        // aquí ya haces router.push o lo que tengas
      } else {
        alert('Error: ' + (json.error || 'unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl text-blue-950 font-semibold">
          {postId ? 'Editar publicación' : 'Nueva publicación'}
        </h2>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#0f2743] px-5 py-2 text-white font-semibold shadow hover:bg-[#0c1f36] disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : postId ? 'Guardar cambios' : 'Agregar'}
        </button>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-5 space-y-4">
        {/* Tipo (solo lectura) */}
        <div className="grid gap-2">
          <label className="text-sm text-neutral-400 font-medium">Tipo</label>
          <div className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2 bg-neutral-50">
            {tipo}
          </div>
        </div>

        {/* Título */}
        <div className="grid gap-2">
          <label className="text-sm text-neutral-400 font-medium">Título</label>
          <input
            className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
            placeholder="Nombre, título de la exposición…"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Fecha de Efeméride (solo para tipo Efeméride) */}
        {tipo === 'Efeméride' && (
          <div className="grid gap-2">
            <label className="text-sm text-neutral-400 font-medium">
              Fecha de la Efeméride
            </label>
            <input
              type="date"
              className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
              value={fechaEfemeride}
              onChange={(e) => setFechaEfemeride(e.target.value)}
            />
            <p className="text-xs text-neutral-500">
              Fecha histórica del evento (ej: 15 de septiembre de 1810)
            </p>
          </div>
        )}

        {/* Bloques dinámicos */}
        {bloques.map((b, idx) => (
          <div key={b.id} className="rounded-md border border-neutral-200 p-4 space-y-3">
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Sección</label>
              <input
                className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
                placeholder="Sección"
                value={b.tituloSeccion}
                onChange={(e) =>
                  setBloques(prev =>
                    prev.map((x, i) => (i === idx ? { ...x, tituloSeccion: e.target.value } : x))
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Descripción</label>
              <textarea
                className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2 min-h-24"
                placeholder="Un 25 de diciembre de 1884..."
                value={b.descripcion}
                onChange={(e) =>
                  setBloques(prev =>
                    prev.map((x, i) => (i === idx ? { ...x, descripcion: e.target.value } : x))
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">
                Agregar imagen/rostro (Opcional)
              </label>
              <label
                className="flex h-40 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 text-neutral-400 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">↑</div>
                  <div className="text-xs">Haz clic para seleccionar</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImagen(idx, e.target.files?.[0] ?? null)}
                />
              </label>
              {b.imagen && (
                <div className="text-xs text-neutral-600">
                  Archivo: {b.imagen.name}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex">
          <button
            type="button"
            onClick={addBloque}
            className="mx-auto mt-1 rounded-full bg-neutral-200 px-5 py-2 text-neutral-700 hover:bg-neutral-300"
          >
            Agregar Sección
          </button>
        </div>
      </div>
    </form>
  );
}
