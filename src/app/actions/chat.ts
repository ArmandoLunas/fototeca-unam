'use server'

import { PrismaClient } from '@prisma/client';

// Use a global instance in dev to prevent connection exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function processChatQuery(userMessage: string) {
    const lowerMsg = userMessage.toLowerCase();

    // 1. PARSE CATEGORIES FIRST
    // We fetch all known categories from DB to match against user input
    const allCategories = await prisma.category.findMany();

    // Filter categories that appear in the user string
    const detectedCategories = allCategories.filter(cat => matchCategory(cat.name, lowerMsg));

    // 2. CHECK ACTION KEYWORDS
    const actionKeywords = ['dame', 'busca', 'ver', 'muestrame', 'encuentra', 'lista'];
    const actionFound = actionKeywords.find(w => lowerMsg.includes(w));

    // 3. SEARCH POSTS (always search, regardless of categories)
    const matchingPosts = await searchPosts(lowerMsg);

    // 4. VALIDATE INPUT
    // If no categories AND no posts found, check if there's at least an action keyword
    if (detectedCategories.length === 0 && matchingPosts.length === 0) {
        // If no action keyword either, provide helpful feedback
        if (!actionFound && !lowerMsg.includes('?')) {
            return {
                reply: "Para buscar recursos o publicaciones, incluye una acción como: 'dame', 'busca', 'muéstrame', 'encuentra', o 'lista'.",
                data: [],
                posts: []
            };
        }

        // Has action keyword but no matching categories or posts
        return {
            reply: "No encontré recursos ni publicaciones que coincidan con tu búsqueda. ¿Podrías intentar con otras palabras clave?",
            data: [],
            posts: []
        };
    }

    // 5. SEARCH RESOURCES (only if categories were found)
    let uniqueResources: any[] = [];
    if (detectedCategories.length > 0) {
        const resources = await prisma.resource.findMany({
            where: {
                AND: detectedCategories.map(cat => ({
                    categories: {
                        some: {
                            id: cat.id
                        }
                    }
                }))
            },
            include: {
                categories: true
            }
        });

        // Deduplicate resources by ID
        uniqueResources = Array.from(
            new Map(resources.map(r => [r.id, r])).values()
        );
    }

    // 6. FORMAT RESPONSE
    const totalResults = uniqueResources.length + matchingPosts.length;

    let reply = '';
    if (uniqueResources.length > 0 && matchingPosts.length > 0) {
        reply = `Encontré ${uniqueResources.length} recurso(s) y ${matchingPosts.length} publicación(es):`;
    } else if (uniqueResources.length > 0) {
        const tagNames = detectedCategories.map(c => c.name).join(' + ');
        reply = `Encontré ${uniqueResources.length} recurso(s) para [${tagNames}]:`;
    } else {
        reply = `Encontré ${matchingPosts.length} publicación(es):`;
    }

    return {
        reply,
        data: uniqueResources,
        posts: matchingPosts.map(post => ({
            id: post.id,
            titulo: post.titulo,
            tipo: post.tipo,
            url: getPostUrl(post)
        }))
    };
}

async function searchPosts(userMessage: string) {
    const normalizedMsg = normalizeText(userMessage);
    // Extract meaningful words (longer than 2 characters to catch words like "paz")
    const words = normalizedMsg.split(/\s+/).filter(w => w.length > 2);

    // Fetch all posts with their blocks
    const allPosts = await prisma.post.findMany({
        include: { blocks: true }
    });

    // Score each post based on matches
    const scoredPosts = allPosts.map(post => {
        let score = 0;

        // Check tipo match (high priority)
        const normalizedTipo = normalizeText(post.tipo);

        // Check for exact tipo match or singular/plural variations
        if (normalizedMsg.includes(normalizedTipo)) {
            score += 10;
        } else {
            // Check variations (e.g., "efemeride" matches "efemérides")
            const tipoVariations = [normalizedTipo];
            if (normalizedTipo.endsWith('es')) {
                tipoVariations.push(normalizedTipo.slice(0, -2)); // efemerides -> efemeride
            }
            if (normalizedTipo.endsWith('s')) {
                tipoVariations.push(normalizedTipo.slice(0, -1)); // biografias -> biografia
            }

            if (tipoVariations.some(v => normalizedMsg.includes(v))) {
                score += 10;
            }
        }

        // Check titulo matches (medium-high priority)
        const normalizedTitulo = normalizeText(post.titulo);

        // Bonus for whole phrase match in titulo
        if (normalizedTitulo.includes(normalizedMsg)) {
            score += 8;
        }

        // Individual word matches in titulo
        words.forEach(word => {
            if (normalizedTitulo.includes(word)) {
                score += 3;
            }
        });

        // Check description matches (lower priority, accumulative)
        post.blocks.forEach(block => {
            const normalizedDesc = normalizeText(block.descripcion);
            words.forEach(word => {
                if (normalizedDesc.includes(word)) {
                    score += 1;
                }
            });
        });

        return { post, score };
    });

    // Filter by minimum threshold (3 points) and sort by score
    return scoredPosts
        .filter(({ score }) => score >= 3)
        .sort((a, b) => b.score - a.score)
        .map(({ post }) => post);
}

function getPostUrl(post: { tipo: string; id: string }): string {
    const tipo = normalizeText(post.tipo);

    if (tipo.includes('efemeride')) {
        return `/home/novedades/efemerides/${post.id}`;
    }
    if (tipo.includes('biografia')) {
        return `/home/novedades/biografias/${post.id}`;
    }
    if (tipo.includes('exposicion')) {
        return `/home/exposiciones`;
    }
    if (tipo.includes('sabias')) {
        return `/home/novedades/sabias-que/${post.id}`;
    }

    // Fallback to general novedades
    return `/home/novedades/${post.id}`;
}

function matchCategory(categoryName: string, userMessage: string): boolean {
    const normalizedUserMsg = normalizeText(userMessage);
    const normalizedCatName = normalizeText(categoryName);

    // Basic singularization heuristics for Spanish
    const variations = [normalizedCatName];
    if (normalizedCatName.endsWith('es')) {
        variations.push(normalizedCatName.slice(0, -2)); // e.g. canciones -> cancion
    }
    if (normalizedCatName.endsWith('s')) {
        variations.push(normalizedCatName.slice(0, -1)); // e.g. deportes -> deporte
    }

    return variations.some(v => normalizedUserMsg.includes(v));
}

function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}