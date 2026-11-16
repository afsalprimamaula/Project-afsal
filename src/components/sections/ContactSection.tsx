'use client';

import { useState } from 'react';
import {
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  Copy,
  CheckCircle2,
  Send,
  Phone,
} from 'lucide-react';
import { contactInfo } from '@/data/kopmaData';

export default function ContactSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const copy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Nama lengkap wajib diisi';
    if (!form.email.trim()) e.email = 'Alamat email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.message.trim()) e.message = 'Pesan wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactCards = [
    {
      icon: Mail,
      label: 'Email Resmi',
      value: contactInfo.email,
      field: 'email',
      action: `mailto:${contactInfo.email}`,
      color: 'bg-green-50/70 border-green-200/80',
      iconBg: 'bg-green-800',
    },
    {
      icon: MessageCircle,
      label: 'Line Official',
      value: contactInfo.line,
      field: 'line',
      action: `https://line.me/ti/p/${contactInfo.line}`,
      color: 'bg-teal-50/70 border-teal-200/80',
      iconBg: 'bg-teal-700',
    },
    {
      icon: Clock,
      label: 'Jam Operasional',
      value: contactInfo.operatingHours,
      field: 'hours',
      action: null,
      color: 'bg-amber-50/70 border-amber-200/80',
      iconBg: 'bg-amber-600',
    },
    {
      icon: MapPin,
      label: 'Sekretariat Utama',
      value: contactInfo.address,
      field: 'address',
      action: 'https://maps.google.com/?q=Universitas+Pasundan+-+Kampus+Tamansari',
      color: 'bg-blue-50/70 border-blue-200/80',
      iconBg: 'bg-blue-700',
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-white scroll-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200/60 text-green-800 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            <Phone className="w-3.5 h-3.5" />
            <span>Hubungi Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight">
            Ada Pertanyaan? Kami <span className="text-green-800">Siap Membantu</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Hubungi kami melalui saluran komunikasi resmi di bawah, atau kirim pesan cepat melalui
            formulir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Contact Cards */}
          <div className="lg:col-span-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
              Saluran Resmi Kopma
            </h3>
            <div className="space-y-3 sm:space-y-3.5">
              {contactCards.map(({ icon: Icon, label, value, field, action, color, iconBg }) => (
                <div
                  key={field}
                  className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border ${color} transition-all card-hover`}
                >
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium mb-0.5">
                      {label}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 break-words line-clamp-2">
                      {value}
                    </div>
                  </div>
                  {/* Action Buttons (always visible on mobile, slick hover on desktop) */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => copy(value, field)}
                      title="Salin ke Clipboard"
                      className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-600 hover:text-green-800 border border-slate-200/80 shadow-xs transition-all active:scale-95"
                      aria-label={`Salin ${label}`}
                    >
                      {copiedField === field ? (
                        <CheckCircle2 className="w-4 h-4 text-green-700" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {action && (
                      <a
                        href={action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-600 hover:text-green-800 border border-slate-200/80 shadow-xs transition-all active:scale-95"
                        title="Buka Tautan"
                        aria-label={`Buka ${label}`}
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Message Form */}
          <div className="lg:col-span-7">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
              Kirim Pesan Cepat
            </h3>

            {formStatus === 'sent' ? (
              <div className="p-6 sm:p-8 rounded-2xl border border-green-200 bg-green-50/70 text-center">
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-green-700 mx-auto mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-bold text-green-950 mb-2">
                  Pesan Berhasil Terkirim!
                </h4>
                <p className="text-green-800 text-xs sm:text-sm mb-5 max-w-md mx-auto leading-relaxed">
                  Terima kasih telah menghubungi kami. Pengurus Kopma Unpas akan segera merespons
                  pertanyaan Anda.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="px-5 py-2.5 rounded-xl bg-green-800 text-white text-xs sm:text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 lg:p-7 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3.5 sm:space-y-4 shadow-xs"
                noValidate
              >
                {/* Name + Email grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nama Anda"
                      className={`w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl border text-base sm:text-sm bg-white outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors ${
                        errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@contoh.com"
                      className={`w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl border text-base sm:text-sm bg-white outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors ${
                        errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subjek Pertanyaan
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Contoh: Info Pemesanan PDH / Pendaftaran Anggota"
                    className="w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm bg-white outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Isi Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                    className={`w-full px-3.5 py-2.5 sm:py-2.5 rounded-xl border text-base sm:text-sm bg-white outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-colors resize-none ${
                      errors.message ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl bg-green-800 hover:bg-green-700 active:scale-98 disabled:opacity-70 text-white font-semibold text-sm sm:text-base transition-all shadow-md shadow-green-900/10"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan</span>
                    </>
                  )}
                </button>

                <p className="text-slate-400 text-[11px] sm:text-xs text-center leading-relaxed">
                  Respons estimasi 1–2 hari kerja. Jam operasional: Senin–Jumat 08.00–16.00 WIB.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
