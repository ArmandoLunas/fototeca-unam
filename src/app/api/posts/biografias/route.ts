import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { tipo: 'Biografía' },
            include: {
                blocks: {
                    select: {
                        id: true,
                        imageUrls: true,
                    },
                },
            },
            // Sorting will be done client-side to handle null values properly
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching biografías:', error);
        return NextResponse.json({ error: 'Failed to fetch biografías' }, { status: 500 });
    }
}
