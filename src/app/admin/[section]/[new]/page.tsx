import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { labelFromSlug } from '@/lib/sections';
import NewPostForm from '@/components/admin/NewPostForm';
import Link from 'next/link';

type Props = { params: { section: string } };

export default async function NewPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const sectionLabel = labelFromSlug(params.section as any);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/admin/${params.section}`} className="text-[#0f2743] hover:underline">← Volver</Link>
        <div className="text-sm text-neutral-600">
          {session?.user?.name || session?.user?.email}
        </div>
      </div>

      <NewPostForm defaultType={sectionLabel} />
    </div>
  );
}