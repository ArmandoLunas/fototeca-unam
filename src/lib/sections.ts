// sections.ts
export type SectionSlug =
  | 'sabias-que'
  | 'efemeride'
  | 'biografia'
  | 'exposiciones'
  | 'eventos'
  | 'sugerencias'
  | 'politicas'
  | 'cuenta'
  | 'aportaciones'
  | 'favoritos';

type SectionConfig = {
  slug: SectionSlug;
  label: string;
  /** Solo true si quieres verla en el sidebar del admin */
  showInAdminSidebar?: boolean;
};

export const SECTIONS: SectionConfig[] = [
  { slug: 'sabias-que',   label: '¿Sabías qué?', showInAdminSidebar: true },
  { slug: 'efemeride',    label: 'Efeméride',    showInAdminSidebar: true },
  { slug: 'biografia',    label: 'Biografía',    showInAdminSidebar: true },
  { slug: 'exposiciones', label: 'Exposiciones', showInAdminSidebar: true },
  { slug: 'eventos',      label: 'Eventos',      showInAdminSidebar: true },
  { slug: 'sugerencias',  label: 'Sugerencias',  showInAdminSidebar: true },
  { slug: 'politicas',    label: 'Políticas',    showInAdminSidebar: true },

  // Estas no aparecen en el admin:
  { slug: 'cuenta',    label: 'Mi cuenta' },
  { slug: 'aportaciones',    label: 'Aportaciones' },
  { slug: 'favoritos',    label: 'Mis favoritos' },
];

export const DEFAULT_SECTION: SectionSlug = 'sabias-que';

export function labelFromSlug(slug: SectionSlug) {
  return SECTIONS.find(s => s.slug === slug)?.label ?? slug;
}

export const ADMIN_SIDEBAR_SECTIONS = SECTIONS.filter(
  s => s.showInAdminSidebar
);
