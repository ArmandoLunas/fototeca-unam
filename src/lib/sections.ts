export type SectionSlug =
  | 'sabias-que'
  | 'efemeride'
  | 'biografia'
  | 'exposiciones'
  | 'eventos'
  | 'sugerencias'
  | 'politicas';

export const SECTIONS: { slug: SectionSlug; label: string }[] = [
  { slug: 'sabias-que', label: '¿Sabías qué?' },
  { slug: 'efemeride', label: 'Efeméride' },
  { slug: 'biografia', label: 'Biografía' },
  { slug: 'exposiciones', label: 'Exposiciones' },
  { slug: 'eventos', label: 'Eventos' },
  { slug: 'sugerencias', label: 'Sugerencias' },
  { slug: 'politicas', label: 'Políticas' },
];

export const DEFAULT_SECTION: SectionSlug = 'sabias-que';

export function labelFromSlug(slug: SectionSlug) {
  return SECTIONS.find(s => s.slug === slug)?.label ?? slug;
}
