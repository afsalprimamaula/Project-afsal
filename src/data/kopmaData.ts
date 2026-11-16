// ============================================================
// src/data/kopmaData.ts
// Single Source of Truth — Kopma Unpas Digital Hub (Fase 1)
// ============================================================

// ─── Navigation ───────────────────────────────────────────
export const navLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'Kontak', href: '#contact' },
  { label: 'Lokasi', href: '#location' },
];

// ─── Identity ─────────────────────────────────────────────
export const identity = {
  fullName: 'Koperasi Mahasiswa Universitas Pasundan',
  shortName: 'Kopma Unpas',
  tagline: 'Bersama Berkembang, Bersama Sejahtera',
  description:
    'UKM kewirausahaan di lingkungan Universitas Pasundan yang berasaskan kekeluargaan dan gotong royong untuk mengembangkan kompetensi kewirausahaan serta meningkatkan kesejahteraan mahasiswa dan anggota.',
  year: '1979',
  members: '500+',
  units: '5',
  campuses: '4',
};

// ─── Core Values ──────────────────────────────────────────
export const coreValues = [
  {
    id: 'kekeluargaan',
    icon: 'Heart',
    title: 'Kekeluargaan',
    description:
      'Membangun ikatan erat antar anggota melalui semangat kekeluargaan yang hangat dan saling mendukung dalam setiap langkah perjalanan organisasi.',
  },
  {
    id: 'gotong-royong',
    icon: 'Users',
    title: 'Gotong Royong',
    description:
      'Mewujudkan tujuan bersama melalui kolaborasi aktif, saling berbagi peran, dan bekerja sama lintas divisi demi kemajuan Kopma Unpas.',
  },
  {
    id: 'kewirausahaan',
    icon: 'TrendingUp',
    title: 'Kewirausahaan',
    description:
      'Mendorong jiwa wirausaha anggota lewat pelatihan bisnis nyata, pengelolaan 5 unit usaha resmi, dan pengembangan skill profesional berkelanjutan.',
  },
];

// ─── Business Units ───────────────────────────────────────
export interface BusinessUnit {
  id: string;
  number: number;
  name: string;
  campus: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  highlights: string[];
}

export const businessUnits: BusinessUnit[] = [
  {
    id: 'retail-tamansari',
    number: 1,
    name: 'Toko Retail',
    campus: 'Kampus II Tamansari',
    category: 'Retail',
    icon: 'ShoppingBag',
    color: 'emerald',
    description:
      'Menyediakan kebutuhan harian mahasiswa, makanan ringan, minuman, dan perlengkapan kuliah di area Kampus II Unpas.',
    highlights: ['Makanan & Minuman', 'ATK & Perlengkapan', 'Buka Setiap Hari'],
  },
  {
    id: 'retail-lengkong',
    number: 2,
    name: 'Toko Retail',
    campus: 'Kampus I Lengkong Besar (Basement)',
    category: 'Retail',
    icon: 'Store',
    color: 'teal',
    description:
      'Pusat layanan retail praktis dan kebutuhan sehari-hari mahasiswa di lingkungan Kampus I Unpas.',
    highlights: ['Lokasi Strategis', 'Harga Terjangkau', 'Produk Lengkap'],
  },
  {
    id: 'green-cafe',
    number: 3,
    name: 'Green Cafe',
    campus: 'Kampus II Tamansari',
    category: 'F&B',
    icon: 'Coffee',
    color: 'amber',
    description:
      'Ruang santai, kopi, dan kuliner ramah kantong mahasiswa untuk diskusi, rapat organisasi, dan belajar.',
    highlights: ['Kopi & Minuman', 'Kuliner Lezat', 'Area Cozy'],
  },
  {
    id: 'fotokopi-setiabudhi',
    number: 4,
    name: 'Fotokopi & Percetakan',
    campus: 'Kampus IV Setiabudhi',
    category: 'Jasa',
    icon: 'Printer',
    color: 'blue',
    description:
      'Layanan fotokopi, cetak dokumen tugas/skripsi, penjilidan, dan alat tulis kantor (ATK) lengkap di Kampus IV.',
    highlights: ['Fotokopi Cepat', 'Jilid Skripsi', 'ATK Lengkap'],
  },
  {
    id: 'perdagangan-umum',
    number: 5,
    name: 'Perdagangan Umum',
    campus: 'Online & Luring',
    category: 'Online',
    icon: 'Globe',
    color: 'purple',
    description:
      'Melayani pemesanan jaket PDH/korsa, kaos kepanitiaan, merchandise kampus, serta jasa percetakan secara daring maupun luring.',
    highlights: ['Jaket PDH/Korsa', 'Kaos Kepanitiaan', 'Merchandise'],
  },
];

// ─── Gallery Items ────────────────────────────────────────
export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  size: 'large' | 'medium' | 'small';
}

export const galleryCategories = ['Semua', 'Kegiatan', 'Unit Usaha', 'Anggota', 'Event'];

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Rapat Pleno Anggota',
    category: 'Kegiatan',
    description: 'Rapat besar tahunan Kopma Unpas membahas laporan pertanggungjawaban dan program kerja.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    size: 'large',
  },
  {
    id: 'g2',
    title: 'Green Cafe Tamansari',
    category: 'Unit Usaha',
    description: 'Suasana Green Cafe yang cozy dan nyaman untuk mahasiswa berdiskusi dan bersantai.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
    size: 'medium',
  },
  {
    id: 'g3',
    title: 'Pelatihan Kewirausahaan',
    category: 'Kegiatan',
    description: 'Workshop dan pelatihan soft skill kewirausahaan bagi anggota baru Kopma Unpas.',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
    size: 'medium',
  },
  {
    id: 'g4',
    title: 'Tim Aktif Kopma Unpas',
    category: 'Anggota',
    description: 'Pengurus dan anggota aktif Kopma Unpas periode terkini siap melayani dengan sepenuh hati.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    size: 'small',
  },
  {
    id: 'g5',
    title: 'Bazaar Kampus Unpas',
    category: 'Event',
    description: 'Partisipasi aktif Kopma Unpas dalam Bazaar tahunan Universitas Pasundan.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    size: 'small',
  },
  {
    id: 'g6',
    title: 'Produk Konveksi & PDH',
    category: 'Unit Usaha',
    description: 'Koleksi jaket PDH, korsa, dan merchandise kampus produksi unit perdagangan umum.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    size: 'medium',
  },
];

// ─── Campus Locations ─────────────────────────────────────
export interface CampusLocation {
  id: string;
  name: string;
  address: string;
  units: string[];
  mapUrl: string;
  embedUrl: string;
  isPrimary: boolean;
}

export const campusLocations: CampusLocation[] = [
  {
    id: 'tamansari',
    name: 'Kampus II Tamansari (Sekretariat Utama)',
    address: 'Jl. Tamansari No. 6-8, Bandung, Jawa Barat 40116',
    units: ['Toko Retail', 'Green Cafe', 'Sekretariat Kopma'],
    mapUrl: 'https://maps.google.com/?q=Universitas+Pasundan+-+Kampus+Tamansari',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.443872384528!2d107.6063341336544!3d-6.904696937324792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e865b85ee0d7%3A0x5fa28af82d475f8a!2sUniversitas%20Pasundan%20-%20Kampus%20Tamansari!5e1!3m2!1sid!2sid!4v1794849551340!5m2!1sid!2sid',
    isPrimary: true,
  },
  {
    id: 'lengkong',
    name: 'Kampus I Lengkong Besar',
    address: 'Jl. Lengkong Besar No. 68, Bandung, Jawa Barat 40261',
    units: ['Toko Retail (Basement)'],
    mapUrl: 'https://maps.google.com/?q=Jl.+Lengkong+Besar+No.+68,+Bandung',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0!2d107.6186!3d-6.9220!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJl.+Lengkong+Besar+No.68!5e0!3m2!1sid!2sid!4v1700000000001!5m2!1sid!2sid',
    isPrimary: false,
  },
  {
    id: 'setiabudhi',
    name: 'Kampus IV Setiabudhi',
    address: 'Jl. Dr. Setiabudhi No. 193, Bandung, Jawa Barat 40153',
    units: ['Fotokopi & Percetakan'],
    mapUrl: 'https://maps.google.com/?q=Jl.+Dr.+Setiabudhi+No.+193,+Bandung',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3!2d107.5847!3d-6.8639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJl.+Dr.+Setiabudhi+193!5e0!3m2!1sid!2sid!4v1700000000002!5m2!1sid!2sid',
    isPrimary: false,
  },
];

// ─── Contact Info ─────────────────────────────────────────
export const contactInfo = {
  email: 'kopmaunpas.bdg@gmail.com',
  line: '@nku4688t',
  address: 'Sekretariat Kampus II Tamansari, Jl. Tamansari No. 6-8, Bandung',
  operatingHours: 'Senin – Jumat, 08.00 – 16.00 WIB',
  instagram: '@kopmaunpas',
};

// ─── SOP / FAQ Knowledge Base (for AI Chatbot) ───────────
export interface SopEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export const sopFaq: SopEntry[] = [
  {
    id: 'sop-1',
    question: 'Bagaimana cara mendaftar menjadi anggota Kopma Unpas?',
    answer:
      'Pendaftaran anggota baru Kopma Unpas dilakukan melalui tahapan:\n1. Isi formulir pendaftaran di sekretariat atau secara daring\n2. Bayar Simpanan Pokok sebesar Rp 10.000 (sekali seumur hidup)\n3. Bayar Simpanan Wajib bulanan sesuai ketentuan\n4. Ikuti orientasi dan pembekalan anggota baru\n5. Kartu anggota aktif diterbitkan setelah proses selesai\n\nSyarat: Mahasiswa aktif Universitas Pasundan dengan menunjukkan KTM.',
    category: 'Keanggotaan',
    keywords: ['daftar', 'anggota', 'gabung', 'mendaftar', 'cara daftar'],
  },
  {
    id: 'sop-2',
    question: 'Apa itu Simpanan Pokok, Wajib, dan Sukarela?',
    answer:
      'Kopma Unpas mengelola tiga jenis simpanan:\n\n**Simpanan Pokok** – Dibayar SEKALI saat mendaftar (Rp 10.000). Dikembalikan saat mengundurkan diri.\n\n**Simpanan Wajib** – Dibayar RUTIN setiap bulan oleh anggota aktif. Besarannya ditetapkan dalam RAT (Rapat Anggota Tahunan).\n\n**Simpanan Sukarela** – Simpanan BEBAS yang bisa disetorkan dan ditarik kapan saja sesuai kebutuhan anggota. Mendapatkan imbal hasil sesuai kebijakan koperasi.',
    category: 'Keuangan',
    keywords: ['simpanan', 'pokok', 'wajib', 'sukarela', 'tabungan', 'iuran'],
  },
  {
    id: 'sop-3',
    question: 'Apa itu sistem Konsinyasi di Kopma Unpas?',
    answer:
      'Konsinyasi adalah sistem titip jual produk di unit usaha Kopma Unpas:\n\n1. Anggota/mitra menitipkan produk di toko retail atau Green Cafe\n2. Kopma menjualkan produk tersebut kepada pelanggan\n3. Setelah terjual, hasil penjualan dibagi sesuai kesepakatan (komisi untuk Kopma)\n4. Produk yang tidak terjual dikembalikan ke pemilik\n\nKeuntungan: Anggota bisa berjualan tanpa modal sewa tempat. Hubungi sekretariat untuk pengajuan konsinyasi.',
    category: 'Unit Usaha',
    keywords: ['konsinyasi', 'titip jual', 'jual', 'produk', 'komisi'],
  },
  {
    id: 'sop-4',
    question: 'Jam operasional Kopma Unpas?',
    answer:
      'Sekretariat Kopma Unpas beroperasi:\n📅 Senin – Jumat\n⏰ 08.00 – 16.00 WIB\n📍 Kampus II Tamansari, Jl. Tamansari No. 6-8, Bandung\n\nUntuk pertanyaan di luar jam operasional, silakan kirim pesan ke:\n📧 kopmaunpas.bdg@gmail.com\n📲 Line: @nku4688t',
    category: 'Operasional',
    keywords: ['jam', 'buka', 'tutup', 'operasional', 'waktu', 'hari'],
  },
  {
    id: 'sop-5',
    question: 'Bagaimana cara memesan jaket PDH atau merchandise kampus?',
    answer:
      'Pemesanan jaket PDH/korsa, kaos kepanitiaan, dan merchandise kampus:\n\n1. **Hubungi** unit Perdagangan Umum via Line @nku4688t atau email\n2. **Konsultasi** desain dan spesifikasi (ukuran, warna, bahan, jumlah minimum)\n3. **Setujui** penawaran harga dan DP (uang muka) minimal 50%\n4. **Proses produksi** berlangsung 7-14 hari kerja\n5. **Pelunasan** sebelum pengambilan/pengiriman\n\nMinimum order: 12 pcs. Tersedia layanan desain gratis.',
    category: 'Unit Usaha',
    keywords: ['jaket', 'pdh', 'korsa', 'kaos', 'pesan', 'merchandise', 'konveksi'],
  },
  {
    id: 'sop-6',
    question: 'Bagaimana cara mendapatkan SHU (Sisa Hasil Usaha)?',
    answer:
      'SHU (Sisa Hasil Usaha) adalah pembagian keuntungan koperasi kepada anggota aktif:\n\n1. SHU dihitung setiap akhir tahun buku (Desember)\n2. Besaran SHU proporsional terhadap transaksi dan simpanan anggota\n3. SHU diumumkan dan dibagikan dalam RAT (Rapat Anggota Tahunan)\n4. Anggota aktif yang memenuhi kewajiban simpanan berhak mendapatkan SHU\n\nSyarat: Tercatat sebagai anggota aktif minimal 1 tahun dan tidak memiliki tunggakan simpanan wajib.',
    category: 'Keuangan',
    keywords: ['shu', 'sisa hasil usaha', 'keuntungan', 'bagi hasil', 'dividen'],
  },
  {
    id: 'sop-7',
    question: 'Apa saja fasilitas yang tersedia di Green Cafe Kopma Unpas?',
    answer:
      'Green Cafe Kopma Unpas di Kampus II Tamansari menawarkan:\n\n☕ Berbagai pilihan minuman kopi dan non-kopi\n🍽️ Menu makanan ringan dan berat dengan harga mahasiswa\n📶 WiFi gratis untuk pelanggan\n💺 Area duduk nyaman untuk belajar dan diskusi\n📱 Bisa digunakan untuk rapat organisasi (booking tempat)\n🕗 Jam buka: Senin-Jumat 08.00-16.00 WIB\n\nLokasi: Kampus II Tamansari, Jl. Tamansari No. 6-8, Bandung.',
    category: 'Unit Usaha',
    keywords: ['cafe', 'green cafe', 'kopi', 'makan', 'minum', 'wifi', 'tempat'],
  },
  {
    id: 'sop-8',
    question: 'Bagaimana cara mengundurkan diri dari keanggotaan?',
    answer:
      'Prosedur pengunduran diri anggota Kopma Unpas:\n\n1. Ajukan surat permohonan pengunduran diri ke sekretariat\n2. Lunasi seluruh kewajiban (simpanan wajib tertunggak, dll)\n3. Simpanan Pokok dikembalikan 100%\n4. Simpanan Sukarela dicairkan sesuai saldo\n5. Proses administrasi 3-7 hari kerja\n6. Kartu anggota dinonaktifkan\n\nCatatan: Simpanan Wajib tidak dikembalikan (menjadi modal koperasi), namun diperhitungkan dalam SHU.',
    category: 'Keanggotaan',
    keywords: ['keluar', 'mundur', 'resign', 'berhenti', 'nonaktif'],
  },
];

// ─── Member Portal Preview (Fase 2 Info) ─────────────────
export const memberPortalFeatures = [
  {
    icon: 'CreditCard',
    title: 'Simpanan Digital',
    description: 'Kelola Simpanan Pokok, Wajib, dan Sukarela secara real-time dengan riwayat lengkap.',
  },
  {
    icon: 'BarChart3',
    title: 'Dashboard SHU',
    description: 'Pantau estimasi Sisa Hasil Usaha dan rekap transaksi koperasi pribadimu.',
  },
  {
    icon: 'Package',
    title: 'Manajemen Konsinyasi',
    description: 'Daftarkan produk konsinyasi, pantau penjualan, dan kelola komisi secara digital.',
  },
  {
    icon: 'Bell',
    title: 'Notifikasi & Pengumuman',
    description: 'Terima update kegiatan, tagihan simpanan, dan pengumuman RAT langsung di portal.',
  },
];
