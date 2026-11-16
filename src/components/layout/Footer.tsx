'use client';

import Image from 'next/image';
import { Mail, MessageCircle, MapPin, Clock, ExternalLink, Heart } from 'lucide-react';
import { contactInfo, navLinks } from '@/data/kopmaData';

interface FooterProps {
  onPortalClick: () => void;
}

export default function Footer({ onPortalClick }: FooterProps) {
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-green-950 text-white">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md border-2 border-amber-400/40 flex-shrink-0 bg-white">
                <Image
                  src="/images/logo-kopma.jpg"
                  alt="Logo Kopma Unpas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg leading-tight">Kopma Unpas</div>
                <div className="text-green-300 text-xs">Digital Hub • Universitas Pasundan</div>
              </div>
            </div>
            <p className="text-green-200/90 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Koperasi Mahasiswa Universitas Pasundan — UKM kewirausahaan berbasis kekeluargaan dan gotong
              royong untuk mengembangkan potensi mahasiswa Unpas.
            </p>
            <button
              onClick={onPortalClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <span>Portal Anggota</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-green-300 mb-3.5 sm:mb-4">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-green-200/80 hover:text-white text-xs sm:text-sm transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Unit Usaha */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-green-300 mb-3.5 sm:mb-4">
              5 Unit Usaha Resmi
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-green-200/80">
              <li className="flex items-center gap-2">
                <span>🏪</span>
                <span>Toko Retail Kampus II Tamansari</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🏬</span>
                <span>Toko Retail Kampus I Lengkong</span>
              </li>
              <li className="flex items-center gap-2">
                <span>☕</span>
                <span>Green Cafe Kampus II Tamansari</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🖨️</span>
                <span>Fotokopi Kampus IV Setiabudhi</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🌐</span>
                <span>Perdagangan Umum & Konveksi</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-green-300 mb-3.5 sm:mb-4">
              Sekretariat & Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-green-200/90 text-xs sm:text-sm leading-relaxed">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-green-200/90 hover:text-white text-xs sm:text-sm transition-colors break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-green-200/90 text-xs sm:text-sm">
                  Line: {contactInfo.line}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-green-200/90 text-xs sm:text-sm">
                  {contactInfo.operatingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-900/80 bg-green-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-green-400/80 text-[11px] sm:text-xs">
            © {new Date().getFullYear()} Koperasi Mahasiswa Universitas Pasundan. Hak cipta dilindungi.
          </p>
          <p className="flex items-center justify-center gap-1.5 text-green-400/80 text-[11px] sm:text-xs">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>untuk Kopma Unpas</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
