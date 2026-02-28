'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Palette, Newspaper, LayoutGrid, LogOut, FileText, Package, Home, Mail } from 'lucide-react';

const navItems = [
  { href: '/admin/home', label: 'Home Layout', icon: Home },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/sections', label: 'Sections', icon: LayoutGrid },
  { href: '/admin/email', label: 'Email Settings', icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <div className="font-bold text-white text-lg leading-tight">HGS Admin</div>
        <div className="text-gray-500 text-xs mt-0.5">Dashboard</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
