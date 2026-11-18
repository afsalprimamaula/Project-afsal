import type { Metadata } from 'next';
import './globals.css';
import SopChatbotWidget from '@/components/widgets/SopChatbotWidget';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#166534',
};

export const metadata: Metadata = {
  title: 'Kopma Unpas — Koperasi Mahasiswa Universitas Pasundan',
  description:
    'Website resmi Koperasi Mahasiswa Universitas Pasundan (Kopma Unpas). UKM kewirausahaan yang mengembangkan kompetensi dan kesejahteraan mahasiswa Unpas melalui 5 unit usaha aktif di Bandung.',
  keywords: [
    'Kopma Unpas',
    'Koperasi Mahasiswa',
    'Universitas Pasundan',
    'UKM Kewirausahaan',
    'Green Cafe Unpas',
    'Bandung',
  ],
  icons: {
    icon: '/images/logo-kopma.jpg',
    apple: '/images/logo-kopma.jpg',
  },
  openGraph: {
    title: 'Kopma Unpas — Koperasi Mahasiswa Universitas Pasundan',
    description: 'UKM kewirausahaan berbasis kekeluargaan dan gotong royong untuk mahasiswa Unpas.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans bg-white text-slate-900 antialiased">
        {children}
        <SopChatbotWidget />
      </body>
    </html>
  );
}
