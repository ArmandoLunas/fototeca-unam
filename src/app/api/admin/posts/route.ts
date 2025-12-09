import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs'; // para asegurar fs disponible

async function saveImageToDisk(file: File, index: number) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const extFromType = file.type?.split('/')[1] || 'jpg';
  const filename = `${Date.now()}_${index}_${randomUUID()}.${extFromType}`;
  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, buffer);

  // URL pública
  return `/uploads/${filename}`;
}

// GET /api/admin/posts?tipo=Biografías
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get('tipo') || undefined;

  const posts = await prisma.post.findMany({
    where: tipo ? { tipo } : {},
    include: { blocks: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ ok: true, posts });
}

// POST -> crear nuevo post
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const tipo = formData.get('tipo') as string | null;
    const titulo = formData.get('titulo') as string | null;
    const blocksJson = formData.get('blocks') as string | null;
    const fechaEfemeridesStr = formData.get('fechaEfemeride') as string | null;

    // Extract name fields for biografías
    const nombres = formData.get('nombres') as string | null;
    const apellidoPaterno = formData.get('apellidoPaterno') as string | null;
    const apellidoMaterno = formData.get('apellidoMaterno') as string | null;

    console.log('POST /api/admin/posts - Received:', { tipo, titulo, fechaEfemeridesStr, blocksJson });

    if (!tipo || !titulo || !blocksJson) {
      console.error('Missing required fields:', { tipo, titulo, blocksJson });
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios (tipo, titulo, blocks)' },
        { status: 400 }
      );
    }

    const blocksPayload = JSON.parse(blocksJson) as {
      title: string;
      content: string;
    }[];

    const blocksData = [];

    for (let i = 0; i < blocksPayload.length; i++) {
      const b = blocksPayload[i];
      const imageUrls: string[] = [];

      // Check for multiple images: image_0_0, image_0_1, etc.
      let imgIdx = 0;
      while (true) {
        const file = formData.get(`image_${i}_${imgIdx}`);
        if (!file || !(file instanceof File) || file.size === 0) break;

        console.log(`Saving image_${i}_${imgIdx}:`, file.name);
        const imageUrl = await saveImageToDisk(file, i * 100 + imgIdx);
        imageUrls.push(imageUrl);
        imgIdx++;
      }

      console.log(`Block ${i}: ${imageUrls.length} images`);

      blocksData.push({
        order: i,
        tituloSeccion: b.title || null,
        descripcion: b.content,
        imageUrls,
      });
    }

    console.log('Creating post with data:', { tipo, titulo, fechaEfemeride: fechaEfemeridesStr, blocksCount: blocksData.length });

    const post = await prisma.post.create({
      data: {
        tipo,
        titulo,
        nombres: nombres || null,
        apellidoPaterno: apellidoPaterno || null,
        apellidoMaterno: apellidoMaterno || null,
        fechaEfemeride: fechaEfemeridesStr ? new Date(fechaEfemeridesStr) : null,
        blocks: {
          create: blocksData,
        },
      },
      include: { blocks: true },
    });

    console.log('Post created successfully:', post.id);

    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (err) {
    console.error('Error creating post:', err);
    return NextResponse.json(
      { ok: false, error: 'Error interno al crear la publicación', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// PUT -> actualizar post existente
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get('id') as string | null;
    const tipo = formData.get('tipo') as string | null;
    const titulo = formData.get('titulo') as string | null;
    const blocksJson = formData.get('blocks') as string | null;
    const fechaEfemeridesStr = formData.get('fechaEfemeride') as string | null;

    // Extract name fields for biografías
    const nombres = formData.get('nombres') as string | null;
    const apellidoPaterno = formData.get('apellidoPaterno') as string | null;
    const apellidoMaterno = formData.get('apellidoMaterno') as string | null;

    if (!id || !tipo || !titulo || !blocksJson) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios (id, tipo, titulo, blocks)' },
        { status: 400 }
      );
    }

    const blocksPayload = JSON.parse(blocksJson) as {
      title: string;
      content: string;
      existingImageUrls?: string[];  // Add this field
    }[];

    const blocksData = [];

    for (let i = 0; i < blocksPayload.length; i++) {
      const b = blocksPayload[i];
      const imageUrls: string[] = [...(b.existingImageUrls || [])];  // Start with existing URLs

      // Check for new images to upload: image_0_0, image_0_1, etc.
      let imgIdx = 0;
      while (true) {
        const file = formData.get(`image_${i}_${imgIdx}`);
        if (!file || !(file instanceof File) || file.size === 0) break;

        const imageUrl = await saveImageToDisk(file, i * 100 + imgIdx);
        imageUrls.push(imageUrl);  // Add new images to the array
        imgIdx++;
      }

      blocksData.push({
        order: i,
        tituloSeccion: b.title || null,
        descripcion: b.content,
        imageUrls,  // Contains both existing and new images
      });
    }

    // Borramos bloques viejos y recreamos
    const post = await prisma.post.update({
      where: { id },
      data: {
        tipo,
        titulo,
        nombres: nombres || null,
        apellidoPaterno: apellidoPaterno || null,
        apellidoMaterno: apellidoMaterno || null,
        fechaEfemeride: fechaEfemeridesStr ? new Date(fechaEfemeridesStr) : null,
        blocks: {
          deleteMany: {},      // borra todos los bloques anteriores
          create: blocksData,
        },
      },
      include: { blocks: true },
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: 'Error interno al actualizar la publicación' },
      { status: 500 }
    );
  }
}
