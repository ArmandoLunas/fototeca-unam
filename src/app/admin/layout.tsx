import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  // Aquí puedes proteger:
  // if (!session) redirect('/api/auth/signin?callbackUrl=/admin');
  return <AdminShell>{children}</AdminShell>;
}