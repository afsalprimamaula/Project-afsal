'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { galleryItems, galleryCategories } from '@/data/kopmaData';
import type { GalleryItem } from '@/data/kopmaData';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeCategory === 'Semua'
      ? galleryItems
      : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <section id="gallery" className="py-16 sm:py-20 lg:py-24 bg-slate-50/80 scroll-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200/60 text-green-800 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galeri Dokumentasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Momen & Kegiatan <span className="text-green-800">Kopma Unpas</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Sekilas pandang aktivitas, unit usaha, dan kehidupan komunitas Kopma Unpas yang dinamis.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10 px-1">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-green-800 text-white shadow-md shadow-green-900/15'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300 hover:text-green-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer card-hover border border-slate-200/60 bg-slate-900 ${
                item.size === 'large' && idx === 0 ? 'bento-large' : ''
              }`}
              onClick={() => setLightboxItem(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay - Always subtly visible for mobile readability, intensifies on desktop hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent sm:from-black/75 sm:via-black/20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium border border-white/20">
                  {item.category}
                </span>
              </div>

              {/* Zoom Icon (Desktop hover) */}
              <div className="absolute top-3 right-3 z-10 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-lg bg-white/25 backdrop-blur-md flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 z-10 translate-y-0 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-white/80 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors active:scale-95"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="relative h-60 sm:h-80 md:h-96 w-full flex-shrink-0 bg-slate-900">
              <Image
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              <span className="inline-block px-3 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-semibold mb-2 sm:mb-3">
                {lightboxItem.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {lightboxItem.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {lightboxItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
