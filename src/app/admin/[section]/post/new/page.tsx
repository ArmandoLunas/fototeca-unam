import NewPostForm from "@/components/admin/NewPostForm";
import { labelFromSlug } from "@/lib/sections";

export default function NewPostPage({ params }: { params: { section: string } }) {
  const { section } = params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-blue-950 font-semibold">
        Nueva publicación de {labelFromSlug(section as any)}
      </h1>

      <NewPostForm defaultType={labelFromSlug(section as any)} section={section} />
    </div>
  );
}
