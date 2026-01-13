'use client';
import { useState, useEffect } from 'react';

type SectionBlock = {
  id: string;
  tituloSeccion: string;
  descripcion: string;
  existingImageUrls: string[];  // URLs from database
  imagenes: File[];             // New files to upload
};

type InitialBlock = {
  title: string;
  content: string;
  imageUrls?: string[];  // Changed from imageUrl to imageUrls array
};

type Props = {
  defaultType: string;   // ej. "¿Sabías qué?"
  postId?: string;       // si existe -> editar
  initialTitle?: string;
  initialNombres?: string;        // For Biografías
  initialApellidoPaterno?: string; // For Biografías
  initialApellidoMaterno?: string; // For Biografías
  initialBlocks?: InitialBlock[];
  initialFechaEfemeride?: string | null; // fecha manual para Efemérides
  section?: string;      // section slug for redirect
};

export default function NewPostForm({
  defaultType,
  postId,
  initialTitle,
  initialNombres,
  initialApellidoPaterno,
  initialApellidoMaterno,
  initialBlocks,
  initialFechaEfemeride,
  section,
}: Props) {
  // Tipo fijo según la pantalla / menú desde donde entras
  const [tipo] = useState(defaultType);

  const [titulo, setTitulo] = useState(initialTitle ?? '');
  const [nombres, setNombres] = useState(initialNombres ?? '');
  const [apellidoPaterno, setApellidoPaterno] = useState(initialApellidoPaterno ?? '');
  const [apellidoMaterno, setApellidoMaterno] = useState(initialApellidoMaterno ?? '');
  const [fechaEfemeride, setFechaEfemeride] = useState(initialFechaEfemeride ?? '');
  const [bloques, setBloques] = useState<SectionBlock[]>([
    { id: crypto.randomUUID(), tituloSeccion: '', descripcion: '', existingImageUrls: [], imagenes: [] },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTitle) {
      setTitulo(initialTitle);
    }
  }, [initialTitle]);

  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      setBloques(
        initialBlocks.map(b => ({
          id: crypto.randomUUID(),
          tituloSeccion: b.title,
          descripcion: b.content,
          existingImageUrls: b.imageUrls || [],  // Preserve existing images
          imagenes: [],
        }))
      );
    }
  }, [initialBlocks]);

  useEffect(() => {
    if (initialFechaEfemeride) {
      // Convert from ISO (yyyy-mm-dd) to display format (dd/mm/yyyy)
      const [year, month, day] = initialFechaEfemeride.split('-');
      setFechaEfemeride(`${day}/${month}/${year}`);
    }
  }, [initialFechaEfemeride]);

  useEffect(() => {
    if (initialNombres) setNombres(initialNombres);
    if (initialApellidoPaterno) setApellidoPaterno(initialApellidoPaterno);
    if (initialApellidoMaterno) setApellidoMaterno(initialApellidoMaterno);
  }, [initialNombres, initialApellidoPaterno, initialApellidoMaterno]);

  function addBloque() {
    setBloques(prev => [
      ...prev,
      { id: crypto.randomUUID(), tituloSeccion: '', descripcion: '', existingImageUrls: [], imagenes: [] },
    ]);
  }

  function setImagenes(idx: number, files: FileList | null) {
    if (!files) return;
    const fileArray = Array.from(files);
    setBloques(prev => prev.map((b, i) => (i === idx ? { ...b, imagenes: fileArray } : b)));
  }

  function removeImagen(bloqueIdx: number, imagenIdx: number) {
    setBloques(prev => prev.map((b, i) => {
      if (i === bloqueIdx) {
        return { ...b, imagenes: b.imagenes.filter((_, idx) => idx !== imagenIdx) };
      }
      return b;
    }));
  }

  function removeExistingImage(bloqueIdx: number, imageUrl: string) {
    setBloques(prev => prev.map((b, i) => {
      if (i === bloqueIdx) {
        return { ...b, existingImageUrls: b.existingImageUrls.filter(url => url !== imageUrl) };
      }
      return b;
    }));
  }

  // Convert dd/mm/yyyy to ISO format (yyyy-mm-dd) for database storage
  function convertDateToISO(dateStr: string): string {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    // Return ISO date string (yyyy-mm-dd) which will be stored as UTC midnight
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Convert ISO date (yyyy-mm-dd) to dd/mm/yyyy for display
  function convertISOToDisplay(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Handle date input change
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value; // This will be in yyyy-mm-dd format from the date input
    if (value) {
      // Convert to dd/mm/yyyy for display
      setFechaEfemeride(convertISOToDisplay(value));
    } else {
      setFechaEfemeride('');
    }
  }

  // Get the value for the date input (yyyy-mm-dd format)
  function getDateInputValue(): string {
    if (!fechaEfemeride) return '';
    return convertDateToISO(fechaEfemeride);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      if (postId) form.append('id', postId);
      form.append('tipo', tipo);      // 👈 se manda el tipo fijado

      // Handle Biografía name fields separately
      if (tipo === 'Biografía') {
        form.append('nombres', nombres);
        form.append('apellidoPaterno', apellidoPaterno);
        form.append('apellidoMaterno', apellidoMaterno);
        // Construct titulo from name parts for backwards compatibility
        form.append('titulo', `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim());
      } else {
        form.append('titulo', titulo);
      }

      // Solo agregar fechaEfemeride si el tipo es "Efeméride" y hay una fecha
      if (tipo === 'Efeméride' && fechaEfemeride) {
        const isoDate = convertDateToISO(fechaEfemeride);
        if (isoDate) {
          form.append('fechaEfemeride', isoDate);
        }
      }

      const blocksPayload = bloques.map(b => ({
        title: b.tituloSeccion,
        content: b.descripcion,
        existingImageUrls: b.existingImageUrls,  // Include existing images
      }));
      form.append('blocks', JSON.stringify(blocksPayload));

      bloques.forEach((b, bloqueIdx) => {
        b.imagenes.forEach((img, imgIdx) => {
          form.append(`image_${bloqueIdx}_${imgIdx}`, img);
        });
      });

      const method = postId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/posts', { method, body: form });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      const json = await res.json();
      console.log('Response JSON:', json);

      if (res.ok && json.ok) {
        alert(postId ? 'Publicación actualizada' : 'Publicación creada');
        // Redirect to the correct section page
        if (section) {
          window.location.href = `/admin/${section}`;
        } else {
          window.location.href = '/admin';
        }
      } else {
        console.error('Error from API:', json);
        alert('Error: ' + (json.error || json.details || 'unknown error'));
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Ocurrió un error al guardar: ' + (err instanceof Error ? err.message : 'unknown'));
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

        {/* Título or Name Fields (conditional based on tipo) */}
        {tipo === 'Biografía' ? (
          <>
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Nombres</label>
              <input
                className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
                placeholder="Nombre(s) de pila"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Apellido Paterno</label>
              <input
                className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
                placeholder="Apellido paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-neutral-400 font-medium">Apellido Materno</label>
              <input
                className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
                placeholder="Apellido materno (opcional)"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="grid gap-2">
            <label className="text-sm text-neutral-400 font-medium">Título</label>
            <input
              className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
              placeholder="Nombre, título de la exposición…"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
        )}

        {/* Fecha de Efeméride (solo para tipo Efeméride) */}
        {tipo === 'Efeméride' && (
          <div className="grid gap-2">
            <label className="text-sm text-neutral-400 font-medium">
              Fecha de la Efeméride
            </label>
            <input
              type="date"
              className="rounded-md border text-neutral-800 border-neutral-300 px-3 py-2"
              value={getDateInputValue()}
              onChange={handleDateChange}
            />
            <p className="text-xs text-neutral-500">
              Fecha histórica del evento. Se mostrará como: {fechaEfemeride || 'dd/mm/yyyy'}
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
                Agregar imágenes (Opcional)
              </label>

              {/* Display existing images from database */}
              {b.existingImageUrls.length > 0 && (
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-neutral-600 font-medium">
                    Imágenes actuales ({b.existingImageUrls.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {b.existingImageUrls.map((url, urlIdx) => (
                      <div key={urlIdx} className="relative group">
                        <div className="text-xs bg-blue-50 px-2 py-1 rounded border border-blue-300 flex items-center gap-1">
                          <span>🖼️</span>
                          <span>{url.split('/').pop()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx, url)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label
                className="flex h-40 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 text-neutral-400 cursor-pointer hover:border-blue-400 transition"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">↑</div>
                  <div className="text-xs">Haz clic para seleccionar múltiples imágenes</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setImagenes(idx, e.target.files)}
                />
              </label>
              {b.imagenes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-neutral-600 font-medium">
                    {b.imagenes.length} imagen{b.imagenes.length > 1 ? 'es' : ''} seleccionada{b.imagenes.length > 1 ? 's' : ''}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {b.imagenes.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative group">
                        <div className="text-xs bg-neutral-100 px-2 py-1 rounded border border-neutral-300">
                          {img.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImagen(idx, imgIdx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
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
