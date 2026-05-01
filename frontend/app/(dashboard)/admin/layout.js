'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/cms', label: 'Homepage CMS' },
  { href: '/admin/pages', label: 'Storefront Pages' },
  { href: '/admin/messages', label: 'Messages' }
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuthStore();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, isHydrated, router]);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isHydrated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center font-display bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Authenticating Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fcfcfc] relative font-sans overflow-x-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md p-5 shadow-sm w-full fixed top-0 z-40 border-b border-gray-100 font-display">
        <h1 className="font-bold uppercase tracking-[0.2em] text-xs">Atelier Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-gray-100">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[2px] transition-all duration-500" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 w-72 z-50 transform transition-transform duration-500 ease-in-out md:translate-x-0 md:static flex flex-col h-screen md:h-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 font-display shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">J</div>
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-gray-900 group-hover:tracking-[0.4em] transition-all duration-500">Jannah</span>
          </Link>
          <button className="md:hidden p-2 text-gray-400 hover:text-black border border-gray-100 rounded-full" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>
        
        <nav className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          <div>
            <p className="px-4 text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-6">Management Suite</p>
            <ul className="space-y-1.5">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
                      pathname === item.href
                        ? 'bg-black text-white shadow-2xl shadow-black/20 translate-x-1'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${pathname === item.href ? 'bg-rose-500 scale-125' : 'bg-transparent group-hover:bg-gray-200'}`} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <p className="px-4 text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-6">Storefront</p>
             <Link href="/" className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:bg-gray-50 hover:text-black transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-gray-200" />
                Return to Shop
             </Link>
          </div>
        </nav>
        
        <div className="p-6 m-4 mt-auto bg-gray-50 rounded-[2rem] border border-gray-100 shrink-0">
          <div className="mb-6 px-2 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold font-display border border-gray-100">
               {user.name?.charAt(0)}
            </div>
            <div>
                <p className="text-[11px] font-bold text-gray-900 truncate max-w-[120px] uppercase tracking-tight">{user.name}</p>
                <p className="text-[9px] text-gray-400 truncate max-w-[120px] font-medium">{user.role?.toUpperCase()} ACCESS</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full px-4 py-3 bg-white border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 pt-24 md:pt-12 w-full max-w-full overflow-x-hidden h-auto overflow-y-visible">
        {children}
      </main>
    </div>
  );
}
