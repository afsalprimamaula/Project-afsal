'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  UserPlus,
  CheckCircle2,
  BookOpen,
  Wallet,
  Users,
  ArrowRight,
  Send,
} from 'lucide-react';
import { contactInfo } from '@/data/kopmaData';

interface JoinMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    step: '01',
    title: 'Isi Formulir Pendaftaran',
    description: 'Lengkapi data diri dan informasi akademik sebagai mahasiswa aktif Unpas.',
  },
  {
    step: '02',
    title: 'Bayar Simpanan Pokok',
    description: 'Rp 10.000 (sekali seumur hidup) sebagai syarat keanggotaan resmi.',
  },
  {
    step: '03',
    title: 'Ikuti Orientasi Anggota',
    description: 'Pembekalan dasar koperasi dan pengenalan unit usaha Kopma Unpas.',
  },
  {
    step: '04',
    title: 'Kartu Anggota Aktif',
    description: 'Nikmati seluruh manfaat, hak SHU tahunan, dan kesempatan berkarya.',
  },
];

const benefits = [
  { icon: Wallet, title: 'Simpanan Produktif', desc: 'Tabung & raih SHU tiap akhir tahun buku.' },
  { icon: BookOpen, title: 'Pelatihan Bisnis', desc: 'Workshop kewirausahaan & soft skills gratis.' },
  { icon: Users, title: 'Jaringan Luas', desc: 'Koneksi luas antar civitas & alumni Unpas.' },
];

export default function JoinMemberModal({ isOpen, onClose }: JoinMemberModalProps) {
  const [preRegForm, setPreRegForm] = useState({ name: '', npm: '', faculty: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preRegForm.name.trim() || !preRegForm.npm.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleClose = () => {
    setSubmitted(false);
    setPreRegForm({ name: '', npm: '', faculty: '', phone: '' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-5 sm:px-6 py-5 sm:py-6 overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all z-10"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative pr-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md border-2 border-amber-400/50 flex-shrink-0 bg-white">
                <Image
                  src="/images/logo-kopma.jpg"
                  alt="Logo Kopma Unpas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-white text-base sm:text-lg font-bold leading-tight">
                  Pendaftaran Anggota
                </h2>
                <p className="text-green-300 text-xs">Kopma Unpas Digital Hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {submitted ? (
            /* Success State */
            <div className="py-6 px-2 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                Pra-Registrasi Berhasil!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
                Terima kasih, <strong>{preRegForm.name}</strong>! Data pra-registrasi Anda telah
                tercatat. Tim keanggotaan Kopma Unpas akan menghubungi Anda untuk konfirmasi simpanan
                pokok dan jadwal orientasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-sm mx-auto">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-800 text-xs sm:text-sm font-semibold hover:bg-green-100 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Email Sekretariat</span>
                </a>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-green-800 text-white text-xs sm:text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Benefits Grid */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Keuntungan Menjadi Anggota
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {benefits.map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="p-3 sm:p-3.5 rounded-xl bg-green-50/70 border border-green-200/70 text-left sm:text-center"
                    >
                      <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center sm:mx-auto mb-2 text-white shadow-xs">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs font-bold text-slate-900 mb-0.5">{title}</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps List */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Alur Registrasi
                </p>
                <div className="space-y-2.5">
                  {steps.map((s, i) => (
                    <div key={s.step} className="flex gap-3 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-green-800 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                          {s.step}
                        </div>
                        {i < steps.length - 1 && <div className="w-px h-5 bg-green-200 mt-1" />}
                      </div>
                      <div className="pb-1">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {s.title}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-700" />
                  <span>Formulir Pra-Registrasi Online</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={preRegForm.name}
                        onChange={(e) => setPreRegForm({ ...preRegForm, name: e.target.value })}
                        placeholder="Nama sesuai KTM"
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                        NPM Mahasiswa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={preRegForm.npm}
                        onChange={(e) => setPreRegForm({ ...preRegForm, npm: e.target.value })}
                        placeholder="Nomor Pokok Mahasiswa"
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                        Fakultas / Jurusan
                      </label>
                      <input
                        type="text"
                        value={preRegForm.faculty}
                        onChange={(e) => setPreRegForm({ ...preRegForm, faculty: e.target.value })}
                        placeholder="Contoh: Teknik Informatika"
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 mb-1 block">
                        No. WhatsApp Aktif
                      </label>
                      <input
                        type="tel"
                        value={preRegForm.phone}
                        onChange={(e) => setPreRegForm({ ...preRegForm, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-base sm:text-xs outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 disabled:opacity-70 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 mt-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span>Daftar Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-slate-400 text-[10px] text-center leading-relaxed">
                    Dengan mendaftar, Anda menyetujui ketentuan AD/ART keanggotaan Kopma Unpas.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
