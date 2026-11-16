'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronRight } from 'lucide-react';
import { navLinks } from '@/data/kopmaData';

interface NavbarProps {
  onPortalClick: () => void;
  onJoinClick: () => void;
}

export default function Navbar({ onPortalClick, onJoinClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sectionIds = navLinks.map((l) => l.href.replace('#', ''));
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-sm py-2.5'
            : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent md:bg-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-md border border-white/30 flex-shrink-0 bg-white">
                <Image
                  src="/images/logo-kopma.jpg"
                  alt="Logo Kopma Unpas"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-sm sm:text-base font-extrabold leading-tight transition-colors truncate ${
                    isScrolled ? 'text-green-950' : 'text-white'
                  }`}
                >
                  Kopma Unpas
                </div>
                <div
                  className={`text-[10px] sm:text-xs leading-tight transition-colors truncate ${
                    isScrolled ? 'text-slate-500' : 'text-green-200'
                  }`}
                >
                  Koperasi Mahasiswa
                </div>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isScrolled
                          ? 'bg-green-800/10 text-green-800 font-semibold'
                          : 'bg-white/20 text-white font-semibold backdrop-blur-sm'
                        : isScrolled
                        ? 'text-slate-600 hover:text-green-800 hover:bg-slate-100'
                        : 'text-green-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={onPortalClick}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold border transition-all duration-200 ${
                  isScrolled
                    ? 'border-green-800 text-green-800 hover:bg-green-800 hover:text-white'
                    : 'border-white/60 text-white hover:bg-white/15 backdrop-blur-sm'
                }`}
              >
                Portal Anggota
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onJoinClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm active:scale-95"
              >
                Gabung Anggota
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!isMobileOpen)}
              className={`md:hidden p-2 rounded-xl transition-all duration-200 active:scale-95 ${
                isScrolled
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-white/20'
              }`}
              aria-label="Menu Navigasi"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[82vw] sm:w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow border border-slate-200 flex-shrink-0 bg-white">
              <Image
                src="/images/logo-kopma.jpg"
                alt="Logo Kopma Unpas"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm text-green-950 block">Kopma Unpas</span>
              <span className="text-[10px] text-slate-500 block">Digital Hub</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/60 active:scale-95 transition-all"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-green-800 text-white font-semibold shadow-sm shadow-green-900/10'
                    : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200/70'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
          <button
            onClick={() => {
              setMobileOpen(false);
              onPortalClick();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-green-800 text-green-800 hover:bg-green-50 active:scale-95 transition-all"
          >
            <span>Portal Anggota</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              onJoinClick();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Gabung Anggota</span>
          </button>
        </div>
      </div>
    </>
  );
}
