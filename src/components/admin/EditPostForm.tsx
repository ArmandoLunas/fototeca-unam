'use client';
import { useState, useEffect } from 'react';

type SectionBlock = {
  id: string;
  tituloSeccion: string;
  descripcion: string;
  imagen?: string | File | null; 
};

export default function EditPostForm({
  postId,
  initialTitle,
  initialBlocks,
  defaultType,
}: {
  postId: string;
  initialTitle: string;
  initialBlocks: SectionBlock[];
  defaultType: string;
}) {
  const [tipo, setTipo] = useState(defaultType);
  const [titulo, setTitulo] = useState(initialTitle);
  const [bloques, setBloques] = useState<SectionBlock[]>(initialBlocks);

  // Función para agregar un bloque
  function addBloque() {
    setBloques((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tituloSeccion: '', descripcion: '', imagen: null },
    ]);
  }

  // Función para cambiar imagen en un bloque específico
  function setImagen(idx: number, file: File | null) {
    setBloques((prev) =>
      prev.map((b, i) =>
        i === idx ? { ...b, imagen: file ? file : null } : b
      )
    );
  }

  // Función para manejar el submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('tipo', tipo);
    form.append('titulo', titulo);

    // Enviamos id, tituloSeccion, descripcion y la url existente (si la hay)
    const blocksPayload = bloques.map((b) => ({
      id: b.id,
      tituloSeccion: b.tituloSeccion,
      descripcion: b.descripcion,
      imagenExisting: typeof b.imagen === 'string' ? b.imagen : null,
    }));
    form.append('blocks', JSON.stringify(blocksPayload));

    // Adjuntar imágenes nuevas (solo si el usuario seleccionó un File)
    bloques.forEach((b) => {
      if (b.imagen instanceof File) {
        form.append(`image_${b.id}`, b.imagen);
      }
    });

    const res = await fetch(`/api/admin/posts/${postId}`, { method: 'PUT', body: form });
    const json = await res.json();
    if (json.ok) {
      alert('Publicación actualizada');
    } else {
      alert('Error: ' + (json.error || 'unknown'));
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl text-blue-950 font-semibold">Editar publicación</h2>
        <button
          type="submit"
          className="rounded-full bg-[#0f2743] px-5 py-2 text-white font-semibold shadow hover:bg-[#0c1f36]"
        >
          Guardar cambios
        </button>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-5 space-y-4">
        {/* Tipo */}
        <div className="grid gap-2">
          <label className="text-sm text-neutral-400 font-medium">Tipo</label>
          <select
            className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2 bg-white"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="Efemérides">Efemérides</option>
            <option value="Sabías Qué">Sabías Qué</option>
            {/* Agregar más tipos según necesidad */}
          </select>
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
                  setBloques((prev) =>
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
                  setBloques((prev) =>
                    prev.map((x, i) => (i === idx ? { ...x, descripcion: e.target.value } : x))
                  )
                }
              />
            </div>

            {/* Uploader estilo cuadro con flecha */}
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Agregar imagen (Opcional)</label>
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
              {/* Mostrar nombre de archivo si es File o la URL/archivo existente */}
              {b.imagen && (
                <div className="text-xs text-neutral-600">
                  Archivo:{' '}
                  {b.imagen instanceof File ? b.imagen.name : String(b.imagen).split('/').pop()}
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
