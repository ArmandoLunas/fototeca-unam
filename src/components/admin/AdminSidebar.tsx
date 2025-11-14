'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/lib/sections';

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav className="py-8">
      <ul className="flex flex-col gap-2">
        {SECTIONS.map(({ slug, label }, idx) => {
          const href = `/admin/${slug}`;
          const active = pathname?.startsWith(href);
          return (
            <li key={slug}>
              <Link
                href={href}
                className={[
                  'block px-5 py-4 text-lg font-semibold text-center rounded-r',
                  active
                    ? 'bg-[#0f2743] text-white shadow-inner'
                    : 'bg-[#1f2e40] text-white/90 hover:bg-[#24364b]',
                ].join(' ')}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
