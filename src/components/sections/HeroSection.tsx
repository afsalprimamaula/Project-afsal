'use client';

import Image from 'next/image';
import { ArrowDown, Users, Building2, Star, Shield, ChevronRight } from 'lucide-react';
import { identity } from '@/data/kopmaData';

interface HeroSectionProps {
  onJoinClick: () => void;
}

const trustBadges = [
  { icon: Users, label: `${identity.members} Anggota Aktif` },
  { icon: Building2, label: `${identity.units} Unit Usaha` },
  { icon: Star, label: `Est. ${identity.year}` },
  { icon: Shield, label: `${identity.campuses} Kampus Unpas` },
];

export default function HeroSection({ onJoinClick }: HeroSectionProps) {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden scroll-section py-20 sm:py-24 lg:py-0"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=85)',
        }}
      />

      {/* Green Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative Shapes */}
      <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-green-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-7 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-semibold mb-4 sm:mb-6 max-w-full shadow-xs">
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden flex-shrink-0 border border-white/40">
                <Image
                  src="/images/logo-kopma.jpg"
                  alt="Logo Kopma"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="truncate">UKM Kewirausahaan Resmi Universitas Pasundan</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.18] sm:leading-[1.15] mb-4 sm:mb-6 tracking-tight">
              Bersama <br />
              <span className="text-amber-400">Berkembang</span>, <br />
              Bersama Sejahtera
            </h1>

            <p className="text-green-100 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl">
              {identity.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onJoinClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-semibold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200"
              >
                <span>Gabung Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToAbout}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur transition-all duration-200"
              >
                <span>Pelajari Lebih</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Editorial Cards (visible on lg screens, tablet friendly) */}
          <div className="lg:col-span-5 hidden sm:grid grid-cols-2 gap-3 sm:gap-4">
            {/* Main feature card */}
            <div className="col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base">5 Unit Usaha Aktif</div>
                  <div className="text-green-300 text-xs">Tersebar di 4 Kampus Unpas</div>
                </div>
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {['Toko Retail', 'Green Cafe', 'Fotokopi', 'Online Shop'].map((u) => (
                  <span
                    key={u}
                    className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs border border-white/15"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats cards */}
            {[
              { value: identity.members, label: 'Anggota Aktif', color: 'text-amber-400' },
              { value: `Est. ${identity.year}`, label: 'Berdiri Sejak', color: 'text-green-300' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/15 transition-all"
              >
                <div className={`text-2xl sm:text-3xl font-extrabold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-green-200 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 transition-colors hover:bg-white/15"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Cue (Desktop only) */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors"
        aria-label="Gulir ke bawah"
      >
        <span className="text-xs font-medium tracking-wide">Gulir ke bawah</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
