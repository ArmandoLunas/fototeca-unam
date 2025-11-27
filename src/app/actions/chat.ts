'use server'

import { PrismaClient } from '@prisma/client';

/**
 * TODO: 
 * - Define correctly the rules for matching categories
 * - Provide the link to the resource in the response
 */

// Use a global instance in dev to prevent connection exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function processChatQuery(userMessage: string) {
    const lowerMsg = userMessage.toLowerCase();

    // 1. PARSE ACTION (Basic keyword detection)
    const actionKeywords = ['dame', 'busca', 'ver', 'muestrame', 'encuentra', 'lista'];
    const actionFound = actionKeywords.find(w => lowerMsg.includes(w));

    // If no explicit search action is found, we might assume it's a conversational "hello"
    if (!actionFound && !lowerMsg.includes('?')) {
        // Simple conversational fallback
        return {
            reply: "No entendí tu solicitud. ¿Podrías reformularla?",
            data: []
        };
    }

    // 2. PARSE TAGS
    // We fetch all known categories from DB to match against user input
    const allCategories = await prisma.category.findMany();

    // Filter categories that appear in the user string
    const detectedCategories = allCategories.filter(cat => matchCategory(cat.name, lowerMsg));

    if (detectedCategories.length === 0) {
        return {
            reply: "No identifiqué ninguna categoría que coincida con tu solicitud. ¿Podrías ser más específico?",
            data: []
        };
    }

    // 3. DATABASE QUERY (Intersection Logic)
    // We want resources that have ALL the detected categories
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

    // Deduplicate resources by ID (in case of any database quirks)
    const uniqueResources = Array.from(
        new Map(resources.map(r => [r.id, r])).values()
    );

    // 4. FORMAT RESPONSE
    const tagNames = detectedCategories.map(c => c.name).join(' + ');

    if (uniqueResources.length === 0) {
        return {
            reply: `No encontré recursos para [${tagNames}].`,
            data: []
        };
    }

    return {
        reply: `Encontré ${uniqueResources.length} resultado(s) para [${tagNames}]:`,
        data: uniqueResources
    };
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