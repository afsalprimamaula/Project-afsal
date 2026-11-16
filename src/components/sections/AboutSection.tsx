'use client';

import Image from 'next/image';
import {
  Heart,
  Users,
  TrendingUp,
  ShoppingBag,
  Store,
  Coffee,
  Printer,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { identity, coreValues, businessUnits } from '@/data/kopmaData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Users,
  TrendingUp,
  ShoppingBag,
  Store,
  Coffee,
  Printer,
  Globe,
};

const colorConfig: Record<
  string,
  { bg: string; icon: string; border: string; badge: string; text: string }
> = {
  emerald: {
    bg: 'bg-emerald-50/70',
    icon: 'bg-emerald-700',
    border: 'border-emerald-200/80',
    badge: 'bg-emerald-100 text-emerald-800',
    text: 'text-emerald-800',
  },
  teal: {
    bg: 'bg-teal-50/70',
    icon: 'bg-teal-700',
    border: 'border-teal-200/80',
    badge: 'bg-teal-100 text-teal-800',
    text: 'text-teal-800',
  },
  amber: {
    bg: 'bg-amber-50/70',
    icon: 'bg-amber-600',
    border: 'border-amber-200/80',
    badge: 'bg-amber-100 text-amber-800',
    text: 'text-amber-800',
  },
  blue: {
    bg: 'bg-blue-50/70',
    icon: 'bg-blue-700',
    border: 'border-blue-200/80',
    badge: 'bg-blue-100 text-blue-800',
    text: 'text-blue-800',
  },
  purple: {
    bg: 'bg-purple-50/70',
    icon: 'bg-purple-700',
    border: 'border-purple-200/80',
    badge: 'bg-purple-100 text-purple-800',
    text: 'text-purple-800',
  },
};

export default function AboutSection() {
  const scrollToLocation = () => {
    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white scroll-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200/60 text-green-900 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <div className="relative w-4 h-4 rounded-full overflow-hidden flex-shrink-0 shadow-xs border border-green-200">
              <Image
                src="/images/logo-kopma.jpg"
                alt="Logo Kopma"
                fill
                className="object-cover"
              />
            </div>
            <span>Tentang Kopma Unpas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Mengenal <span className="text-green-800">Kopma Unpas</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            {identity.description}
          </p>
        </div>

        {/* Identity Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-14 sm:mb-20">
          {[
            { value: identity.members, label: 'Anggota Aktif' },
            { value: identity.units, label: 'Unit Usaha Resmi' },
            { value: `Est. ${identity.year}`, label: 'Tahun Berdiri' },
            { value: identity.campuses, label: 'Kampus Aktif' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="text-center p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:border-green-300 hover:bg-green-50/50 transition-all card-hover"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-800 mb-1">
                {value}
              </div>
              <div className="text-slate-600 text-xs sm:text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-14 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Nilai-Nilai Inti Kopma Unpas
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Pilar utama pedoman berorganisasi dan berkarya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {coreValues.map((value) => {
              const Icon = iconMap[value.icon];
              return (
                <div
                  key={value.id}
                  className="p-5 sm:p-7 rounded-2xl border border-slate-200/80 bg-white hover:border-green-300 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300 card-hover group"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-800 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-green-700 transition-colors shadow">
                    {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
                    {value.title}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Units Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                5 Unit Usaha Resmi
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Tersebar di 4 Kampus Universitas Pasundan di Bandung
              </p>
            </div>
            <button
              onClick={scrollToLocation}
              className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 text-xs sm:text-sm font-semibold transition-colors group"
            >
              <span>Lihat di Peta Kampus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {businessUnits.map((unit) => {
              const Icon = iconMap[unit.icon];
              const colors = colorConfig[unit.color] || colorConfig.emerald;
              return (
                <div
                  key={unit.id}
                  className={`p-5 sm:p-6 rounded-2xl border ${colors.border} ${colors.bg} card-hover transition-all duration-300 flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3.5">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 ${colors.icon} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}
                      >
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-lg ${colors.badge}`}
                      >
                        {unit.category}
                      </span>
                    </div>

                    {/* Content */}
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                      {unit.name}
                    </h4>
                    <p className={`text-xs font-semibold mb-2.5 ${colors.text}`}>{unit.campus}</p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {unit.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/5">
                    {unit.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-md bg-white/80 border border-black/5 text-slate-700 text-[11px] sm:text-xs font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
