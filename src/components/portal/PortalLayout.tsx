'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PiggyBank,
  Package,
  Banknote,
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';
import SopChatbotWidget from '@/components/widgets/SopChatbotWidget';

// ─── Menu definitions ─────────────────────────────────────────
const ANGGOTA_MENU = [
  { label: 'Ringkasan', href: '/anggota', icon: LayoutDashboard },
  { label: 'Simpanan Saya', href: '/anggota/simpanan', icon: PiggyBank },
  { label: 'Titip Jual (Konsinyasi)', href: '/anggota/konsinyasi', icon: Package },
  { label: 'Pencairan Dana', href: '/anggota/pencairan', icon: Banknote },
];

const PENGURUS_MENU = [
  { label: 'Dashboard Koperasi', href: '/pengurus', icon: LayoutDashboard },
  { label: 'Kelola Simpanan', href: '/pengurus/simpanan', icon: PiggyBank },
  { label: 'Nota Konsinyasi', href: '/pengurus/konsinyasi', icon: FileText },
  { label: 'Verifikasi Pencairan', href: '/pengurus/pencairan', icon: CheckSquare },
  { label: 'Data Anggota', href: '/pengurus/anggota', icon: Users },
];

// ─── Props ────────────────────────────────────────────────────
interface PortalLayoutProps {
  profile: Profile;
  children: React.ReactNode;
}

export default function PortalLayout({ profile, children }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isPengurus = profile.role === 'pengurus';
  const menuItems = isPengurus ? PENGURUS_MENU : ANGGOTA_MENU;
  const portalLabel = isPengurus ? 'Admin Pengurus' : 'Portal Anggota';

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/anggota' || href === '/pengurus') return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + Title */}
      <div className="px-4 pt-5 pb-4 border-b border-green-800/40">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-lg flex-shrink-0 bg-white">
            <Image src="/images/logo-kopma.jpg" alt="Logo Kopma Unpas" fill className="object-cover" />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm leading-tight">KOPMA UNPAS</div>
            <div className="text-emerald-300 text-[11px] font-medium">{portalLabel}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest px-2 mb-2">
          Menu Utama
        </div>
        {menuItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                active
                  ? 'bg-white text-[#166534] font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#166534]' : 'text-emerald-300 group-hover:text-white'}`} />
              <span className="flex-1 text-sm">{label}</span>
              {active && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
              {!active && <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4 pt-2 border-t border-green-800/40 space-y-2">
        {/* Quick action for pengurus */}
        {isPengurus && (
          <Link
            href="/pengurus/simpanan?action=add"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            + Input Transaksi
          </Link>
        )}

        {/* AI CS Button */}
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold transition-all border border-white/10"
        >
          <MessageSquare className="w-4 h-4" />
          Tanya AI CS
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-emerald-200 hover:text-red-300 text-xs font-semibold transition-all border border-white/5"
        >
          <LogOut className="w-4 h-4" />
          {loggingOut ? 'Keluar...' : 'Keluar (Logout)'}
        </button>

        <p className="text-center text-[10px] text-emerald-500 pt-1">© 2026 Kopma Unpas</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-gradient-to-b from-[#166534] to-[#1B5E20] h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-gradient-to-b from-[#166534] to-[#1B5E20] flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-800 text-sm">Kopma Unpas — {portalLabel}</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* AI Chatbot Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full sm:w-[380px] h-[520px] sm:h-[500px] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <SopChatbotWidget inlineMode onClose={() => setChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
