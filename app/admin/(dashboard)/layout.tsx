import { redirect } from 'next/navigation';
import { verifyAdminCookie } from '@/lib/admin-auth';
import AdminSidebar from '../AdminSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await verifyAdminCookie();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
