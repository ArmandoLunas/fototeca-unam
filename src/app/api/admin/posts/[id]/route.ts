import { prisma } from "@/lib/db";
import fs from 'fs';
import path from 'path';

// DELETE - Eliminar publicación
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Eliminar post
    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ ok: true, post: deletedPost }));
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: "No se pudo eliminar la publicación" }),
      { status: 500 }
    );
  }
}

// PUT - Editar publicación (soporta multipart/form-data y preserva imágenes existentes)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // parsear form-data
    const form = await req.formData();
    const tipo = String(form.get('tipo') ?? '');
    const titulo = String(form.get('titulo') ?? '');
    const blocksRaw = String(form.get('blocks') ?? '[]');
    const incomingBlocks = JSON.parse(blocksRaw) as Array<{
      id?: string;
      tituloSeccion: string;
      descripcion: string;
      imagenExisting?: string | null;
    }>;

    // obtener bloques existentes desde la BD para preservar imagen si no llega nueva
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { blocks: true },
    });
    const existingMap = new Map<string, { id: string; imagen?: string | null }>();
    if (existingPost?.blocks) {
      for (const eb of existingPost.blocks) {
        existingMap.set(eb.id, { id: eb.id, imagen: eb.imagen ?? null });
      }
    }

    // Procesar cada bloque: si viene archivo nuevo, guardarlo; si no, usar imagen existente en BD o la enviada en imagenExisting
    for (const b of incomingBlocks) {
      const fileKey = `image_${b.id ?? ''}`;
      const file = form.get(fileKey) as unknown as Blob | File | null;

      if (file && typeof (file as any).arrayBuffer === 'function' && ((file as any).size ?? 0) > 0) {
        // guardar en public/uploads
        const arrayBuffer = await (file as any).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const safeName = `${Date.now()}-${((file as any).name ?? 'upload')}`.replace(/\s+/g, '-');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        const uploadPath = path.join(uploadDir, safeName);
        fs.writeFileSync(uploadPath, buffer);
        (b as any).imagenUrl = `/uploads/${safeName}`;
      } else if (b.id && existingMap.has(b.id) && existingMap.get(b.id)?.imagen) {
        // no hay archivo nuevo -> usar la imagen que ya está en BD
        (b as any).imagenUrl = existingMap.get(b.id)!.imagen;
      } else if (b.imagenExisting) {
        // fallback si cliente envió imagenExisting
        (b as any).imagenUrl = b.imagenExisting;
      } else {
        (b as any).imagenUrl = null;
      }
    }

    // Determinar qué borrar (si el usuario eliminó secciones)
    const incomingIds = new Set(incomingBlocks.filter(b => b.id).map(b => b.id as string));
    const existingIds = existingPost?.blocks?.map(b => b.id) ?? [];
    const idsToDelete = existingIds.filter(eid => !incomingIds.has(eid));

    // Preparar operaciones upsert/create
    const upserts = incomingBlocks
      .filter(b => b.id)
      .map(b => ({
        where: { id: b.id as string },
        update: {
          tituloSeccion: b.tituloSeccion,
          descripcion: b.descripcion,
          imagen: (b as any).imagenUrl ?? null,
        },
        create: {
          id: b.id as string,
          tituloSeccion: b.tituloSeccion,
          descripcion: b.descripcion,
          imagen: (b as any).imagenUrl ?? null,
        },
      }));

    const creates = incomingBlocks
      .filter(b => !b.id)
      .map(b => ({
        tituloSeccion: b.tituloSeccion,
        descripcion: b.descripcion,
        imagen: (b as any).imagenUrl ?? null,
      }));

    // Actualizar post con operaciones puntuales (deleteMany para los eliminados, upsert para existentes y create para nuevos)
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        titulo,
        tipo,
        blocks: {
          // borrar solo los que ya no vinieron
          ...(idsToDelete.length ? { deleteMany: { id: { in: idsToDelete } } } : {}),
          ...(upserts.length ? { upsert: upserts as any } : {}),
          ...(creates.length ? { create: creates as any } : {}),
        },
      },
      include: { blocks: true },
    });

    return new Response(JSON.stringify({ ok: true, post: updatedPost }));
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ ok: false, error: "No se pudo actualizar la publicación" }),
      { status: 500 }
    );
  }
}