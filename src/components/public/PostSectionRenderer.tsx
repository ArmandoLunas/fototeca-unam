'use client';

import Image from 'next/image';

export type PublicSection = {
  id: string;
  heading?: string;
  text: string;
  imageUrl?: string | null;
};

interface Props {
  sections: PublicSection[];
}

export default function PostSectionRenderer({ sections }: Props) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="w-full px-4 md:px-8 lg:px-16">
      {sections.map((section, index) => {
        const hasImage = section.imageUrl && section.imageUrl.trim() !== '';
        const isEven = index % 2 === 0;

        if (!hasImage) {
          // Solo texto, centrado y justificado
          return (
            <section
              key={section.id ?? index}
              className="py-10 flex justify-center"
            >
              <div className="max-w-3xl mx-auto text-justify">
                {section.heading && (
                  <h2 className="mb-4 text-center text-2xl font-semibold">
                    {section.heading}
                  </h2>
                )}
                <p className="leading-relaxed whitespace-pre-line">
                  {section.text}
                </p>
              </div>
            </section>
          );
        }

        return (
          <section
            key={section.id ?? index}
            className="py-10 border-b border-neutral-200 last:border-0"
          >
            <div
              className={`flex flex-col items-center gap-8 md:gap-12 md:items-stretch md:flex-row ${
                !isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/2 w-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={section.imageUrl!}
                    alt={section.heading ?? 'Imagen de sección'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:w-1/2 w-full">
                <div className="max-w-xl mx-auto text-justify">
                  {section.heading && (
                    <h2 className="mb-4 text-2xl font-semibold">
                      {section.heading}
                    </h2>
                  )}
                  <p className="leading-relaxed whitespace-pre-line">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
