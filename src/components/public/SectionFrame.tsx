export default function SectionFrame({
  tipo,
  titulo,
  children,
}: {
  tipo: string;
  titulo?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-md border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold text-neutral-900">{tipo}</h1>
          {titulo && <p className="text-sm text-neutral-600 mt-1">{titulo}</p>}
        </div>
        <div className="p-6">
          {/* Aquí puedes pasar contenido opcional (grid, etc.) */}
          {children ?? (
            <div className="h-48 bg-neutral-100 rounded-md border border-dashed flex items-center justify-center text-neutral-500">
              Frame de contenido
            </div>
          )}
        </div>
      </div>
    </section>
  );
}