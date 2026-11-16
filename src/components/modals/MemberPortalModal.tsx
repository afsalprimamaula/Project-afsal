'use client';

import Image from 'next/image';
import { X, Lock, CreditCard, BarChart3, Package, Bell, Sparkles, ChevronRight } from 'lucide-react';
import { memberPortalFeatures } from '@/data/kopmaData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  BarChart3,
  Package,
  Bell,
};

interface MemberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberPortalModal({ isOpen, onClose }: MemberPortalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-5 sm:px-6 py-5 sm:py-6 overflow-hidden flex-shrink-0">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-700/30 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all z-10"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative pr-8">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-amber-400/50 flex-shrink-0 bg-white">
                <Image
                  src="/images/logo-kopma.jpg"
                  alt="Logo Kopma Unpas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold text-base sm:text-lg leading-tight">
                  Portal Anggota
                </div>
                <div className="text-green-300 text-xs">Kopma Unpas Digital Hub</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              Segera Hadir — Fase 2
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
              Sistem Portal Anggota Terintegrasi
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Portal Anggota Fase 2 akan memungkinkan seluruh anggota Kopma Unpas mengakses dan
              mengelola aktivitas koperasi secara digital menggunakan <strong>NPM (Nomor Pokok
              Mahasiswa)</strong> sebagai kredensial login.
            </p>
          </div>

          {/* Login Preview Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pratinjau Antarmuka Login
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Mockup Fase 2
              </span>
            </div>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  NPM Mahasiswa
                </label>
                <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-400">
                  Contoh: 203040001
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Kata Sandi
                </label>
                <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-400">
                  ••••••••••••
                </div>
              </div>
              <div className="bg-green-100/80 border border-green-200 rounded-xl px-3.5 py-2.5 text-xs text-green-900 text-center font-semibold">
                🔒 Masuk ke Portal Anggota (Dalam Tahap Pengembangan)
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Fitur yang Akan Tersedia
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {memberPortalFeatures.map((feature) => {
                const Icon = iconMap[feature.icon];
                return (
                  <div
                    key={feature.title}
                    className="p-3.5 sm:p-4 rounded-xl bg-green-50/60 border border-green-200/60"
                  >
                    <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center mb-2.5 text-white shadow-xs">
                      {Icon && <Icon className="w-4 h-4 text-white" />}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                      {feature.title}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-800 hover:bg-green-700 active:scale-98 text-white text-xs sm:text-sm font-semibold transition-all shadow"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mengerti & Kembali</span>
          </button>
        </div>
      </div>
    </div>
  );
}
