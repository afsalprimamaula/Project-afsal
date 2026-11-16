'use client';

import { useState } from 'react';
import { MapPin, ExternalLink, Building2, Navigation } from 'lucide-react';
import { campusLocations } from '@/data/kopmaData';

export default function LocationSection() {
  const [activeLocation, setActiveLocation] = useState(campusLocations[0]);

  return (
    <section id="location" className="py-16 sm:py-20 lg:py-24 bg-slate-50/80 scroll-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200/60 text-green-800 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <Navigation className="w-3.5 h-3.5" />
            <span>Lokasi Kampus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Temukan Kami di <span className="text-green-800">4 Kampus Unpas</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Kopma Unpas hadir di berbagai kampus Universitas Pasundan di kota Bandung untuk melayani
            seluruh civitas akademika.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Campus Cards (Left column on desktop, top on mobile) */}
          <div className="lg:col-span-5 space-y-3">
            {campusLocations.map((loc) => {
              const isActive = activeLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                    isActive
                      ? 'border-green-800 bg-green-800 text-white shadow-lg shadow-green-950/15'
                      : 'border-slate-200/90 bg-white hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                        isActive ? 'bg-white/20' : 'bg-green-100/80 text-green-800'
                      }`}
                    >
                      <Building2
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-green-800'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span
                          className={`font-bold text-sm sm:text-base leading-snug ${
                            isActive ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {loc.name}
                        </span>
                        {loc.isPrimary && (
                          <span
                            className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Utama
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs mb-2.5 leading-relaxed ${
                          isActive ? 'text-green-100' : 'text-slate-500'
                        }`}
                      >
                        {loc.address}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {loc.units.map((u) => (
                          <span
                            key={u}
                            className={`text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-white/15 text-green-100 border border-white/20'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Direct Google Maps link */}
            <a
              href={activeLocation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-3.5 sm:p-4 rounded-2xl border-2 border-dashed border-green-300/80 bg-green-50/50 hover:bg-green-100/50 text-green-800 transition-colors text-xs sm:text-sm font-semibold active:scale-[0.99]"
            >
              <MapPin className="w-4 h-4 text-green-700" />
              <span>Buka Petunjuk Arah di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Map Embed (Right column on desktop, below on mobile) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white flex flex-col">
              {/* Map Header */}
              <div className="bg-white border-b border-slate-100 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {activeLocation.name}
                  </span>
                </div>
                <a
                  href={activeLocation.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-800 hover:text-green-950 font-semibold flex-shrink-0"
                >
                  <span className="hidden sm:inline">Lihat Peta Besar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Frame */}
              <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px] bg-slate-100">
                <iframe
                  key={activeLocation.id}
                  src={activeLocation.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`Peta lokasi ${activeLocation.name}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
