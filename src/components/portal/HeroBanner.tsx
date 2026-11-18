'use client';

import type { Profile } from '@/lib/supabase/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeroBannerProps {
  profile?: Profile;
  title?: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel: string;
  secondaryHref?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export default function HeroBanner({
  profile,
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onPrimary,
  onSecondary,
}: HeroBannerProps) {
  const router = useRouter();
  const isPengurus = profile?.role === 'pengurus';
  const badge = profile
    ? isPengurus
      ? `ADMIN PENGURUS${profile.jabatan ? ` • ${profile.jabatan}` : ''}`
      : 'ANGGOTA AKTIF'
    : 'KOPMA UNPAS';

  const headline = title
    ? title
    : profile
    ? isPengurus
      ? `Selamat datang, ${profile.nama_lengkap.split(' ')[0]}!`
      : `Halo, ${profile.nama_lengkap.split(' ')[0]}! 👋`
    : 'Selamat Datang di Portal Kopma Unpas';

  const sub = subtitle
    ? subtitle
    : profile
    ? isPengurus
      ? 'Kelola keuangan, simpanan, dan konsinyasi anggota Kopma Unpas dari satu panel terpusat.'
      : 'Pantau simpanan, konsinyasi, dan ajukan pencairan dana Anda langsung dari portal ini.'
    : 'Portal layanan digital resmi Koperasi Mahasiswa Universitas Pasundan.';

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else if (primaryHref) router.push(primaryHref);
  };

  const handleSecondary = () => {
    if (onSecondary) onSecondary();
    else if (secondaryHref) router.push(secondaryHref);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#166534] via-[#15803d] to-[#1B5E20] rounded-2xl overflow-hidden p-6 sm:p-8 mb-6 shadow-md">
      {/* Watermark emblem */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="6" />
          <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="4" />
          <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="3" />
          <path
            d="M100 20 L115 60 L160 60 L125 85 L140 125 L100 100 L60 125 L75 85 L40 60 L85 60 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative max-w-xl">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider mb-4 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {badge}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
          {headline}
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">{sub}</p>

        {/* Info pills */}
        {profile && (
          <div className="flex flex-wrap gap-2 mb-6">
            {profile.nim && (
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/20">
                NIM: {profile.nim}
              </span>
            )}
            {profile.no_kta && (
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/20">
                KTA: {profile.no_kta}
              </span>
            )}
            <span className="px-3 py-1.5 rounded-lg bg-emerald-400/20 text-emerald-200 text-xs font-medium border border-emerald-400/30">
              ● Aktif
            </span>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePrimary}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-all shadow-md active:scale-95"
          >
            {primaryLabel}
          </button>
          <button
            onClick={handleSecondary}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all active:scale-95"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
