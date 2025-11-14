import TopBar from '@/components/public/TopBar';
import SectionFrame from '@/components/public/SectionFrame';

export default function FavoritosPage() {
  return (
    <>
      <TopBar section="Favoritos" />
      <SectionFrame tipo="Favoritos" titulo="Título ejemplo de favorito" />
    </>
  );
}