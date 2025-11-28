import TopBar from '@/components/public/TopBar';
import SectionFrame from '@/components/public/SectionFrame';

const LABELS: Record<string, string> = {
  'sabias-que': '¿Sabías qué?',
  sabiasque: '¿Sabías qué?',        // por si acaso
  'efemerides': 'Efemérides',
  'biografias': 'Biografías',
};

export default function NovedadTipoPage({ params }: { params: { tipo: string } }) {
  const label = LABELS[params.tipo] ?? params.tipo;
  return (
    <>
      <TopBar section="Novedades" />
      <SectionFrame tipo={`Novedades — ${label}`} titulo="Título de la publicación" />
    </>
  );
}