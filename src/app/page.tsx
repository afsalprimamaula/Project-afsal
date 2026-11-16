'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ScrollProgressDots from '@/components/layout/ScrollProgressDots';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import GallerySection from '@/components/sections/GallerySection';
import ContactSection from '@/components/sections/ContactSection';
import LocationSection from '@/components/sections/LocationSection';
import MemberPortalModal from '@/components/modals/MemberPortalModal';
import JoinMemberModal from '@/components/modals/JoinMemberModal';

export default function HomePage() {
  const [isMemberPortalOpen, setMemberPortalOpen] = useState(false);
  const [isJoinMemberOpen, setJoinMemberOpen] = useState(false);

  return (
    <>
      <Navbar
        onPortalClick={() => setMemberPortalOpen(true)}
        onJoinClick={() => setJoinMemberOpen(true)}
      />

      <ScrollProgressDots
        sections={[
          { id: 'home', label: 'Beranda' },
          { id: 'about', label: 'Tentang Kami' },
          { id: 'gallery', label: 'Galeri' },
          { id: 'contact', label: 'Kontak' },
          { id: 'location', label: 'Lokasi' },
        ]}
      />

      <main>
        <HeroSection onJoinClick={() => setJoinMemberOpen(true)} />
        <AboutSection />
        <GallerySection />
        <ContactSection />
        <LocationSection />
      </main>

      <Footer onPortalClick={() => setMemberPortalOpen(true)} />

      <MemberPortalModal
        isOpen={isMemberPortalOpen}
        onClose={() => setMemberPortalOpen(false)}
      />
      <JoinMemberModal
        isOpen={isJoinMemberOpen}
        onClose={() => setJoinMemberOpen(false)}
      />
    </>
  );
}
