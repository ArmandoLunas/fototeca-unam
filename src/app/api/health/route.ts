import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // ping muy breve: cuenta usuarios (0 si vacío)
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ ok: true, users: count });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
