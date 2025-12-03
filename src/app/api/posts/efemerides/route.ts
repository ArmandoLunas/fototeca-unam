import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { tipo: "Efeméride" },
            orderBy: { createdAt: "desc" },
            include: {
                blocks: {
                    select: {
                        id: true,
                        imageUrl: true,
                    },
                },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching efemerides:", error);
        return NextResponse.json(
            { error: "Failed to fetch efemerides" },
            { status: 500 }
        );
    }
}
