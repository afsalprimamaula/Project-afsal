'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils/currency';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/components/portal/Toast';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface PencairanModalProps {
  anggotaId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const METODE_OPTIONS = [
  'Transfer Bank — BCA',
  'Transfer Bank — BRI',
  'Transfer Bank — BNI',
  'Transfer Bank — Mandiri',
  'Transfer Bank — BSI',
  'Dana',
  'OVO',
  'GoPay',
  'Shopee Pay',
];

export default function PencairanModal({ anggotaId, onClose, onSuccess }: PencairanModalProps) {
  const [sumber, setSumber] = useState<'konsinyasi' | 'sukarela'>('konsinyasi');
  const [nominal, setNominal] = useState('');
  const [metode, setMetode] = useState('');
  const [noRek, setNoRek] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominalNum = Number(nominal.replace(/\D/g, ''));
    if (!nominalNum || nominalNum < 10000) {
      setError('Nominal minimal Rp 10.000');
      return;
    }
    if (!metode || !noRek.trim()) {
      setError('Mohon lengkapi semua field.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('pencairan_requests').insert({
        anggota_id: anggotaId,
        sumber_dana: sumber,
        nominal: nominalNum,
        metode_transfer: metode,
        nomor_rekening: noRek.trim(),
        status: 'pending',
      });

      if (insertError) throw insertError;

      showToast('Pengajuan pencairan berhasil dikirim!', 'success');
      onSuccess();
      onClose();
    } catch {
      setError('Gagal mengirim pengajuan. Silakan coba lagi.');
      showToast('Gagal mengirim pengajuan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const nominalFormatted = nominal
    ? formatRupiah(Number(nominal.replace(/\D/g, '')))
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-sm">Ajukan Pencairan Dana</div>
            <div className="text-green-300 text-xs">Proses review 1–3 hari kerja</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
          )}

          {/* Sumber Dana */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Sumber Dana</label>
            <div className="grid grid-cols-2 gap-2">
              {(['konsinyasi', 'sukarela'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSumber(s)}
                  className={`py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    sumber === s
                      ? 'bg-green-800 text-white border-green-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-green-300'
                  }`}
                >
                  {s === 'konsinyasi' ? '📦 Konsinyasi' : '💰 Sukarela'}
                </button>
              ))}
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nominal Pencairan</label>
            <input
              type="text"
              inputMode="numeric"
              value={nominal}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setNominal(digits);
              }}
              placeholder="Contoh: 500000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-all"
              disabled={loading}
            />
            {nominalFormatted && (
              <p className="text-xs text-green-700 font-semibold mt-1 ml-1">{nominalFormatted}</p>
            )}
          </div>

          {/* Metode Transfer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Metode Transfer</label>
            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-all"
              disabled={loading}
            >
              <option value="">Pilih metode...</option>
              {METODE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Nomor Rekening */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Rekening / Akun</label>
            <input
              type="text"
              value={noRek}
              onChange={(e) => setNoRek(e.target.value)}
              placeholder="Contoh: 1234567890 (atas nama: Budi)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-800 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Mengirim...</>
            ) : (
              <><CheckCircle className="w-4 h-4" />Ajukan Pencairan</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
