'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/components/portal/Toast';
import { formatRupiah } from '@/lib/utils/currency';
import { X, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  nim: string | null;
  nama_lengkap: string;
}

interface InputSetoranModalProps {
  currentUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const JENIS_OPTIONS = [
  { value: 'pokok', label: 'Simpanan Pokok', hint: 'Rp 50.000 — Dibayar sekali' },
  { value: 'wajib', label: 'Simpanan Wajib', hint: 'Rp 10.000 — Bulanan' },
  { value: 'sukarela', label: 'Simpanan Sukarela', hint: 'Bebas nominal' },
] as const;

export default function InputSetoranModal({ currentUserId, onClose, onSuccess }: InputSetoranModalProps) {
  const [anggotaList, setAnggotaList] = useState<Profile[]>([]);
  const [selectedAnggotaId, setSelectedAnggotaId] = useState('');
  const [jenis, setJenis] = useState<'pokok' | 'wajib' | 'sukarela'>('wajib');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('profiles')
      .select('id, nim, nama_lengkap')
      .eq('status_aktif', true)
      .order('nama_lengkap')
      .then(({ data }) => setAnggotaList(data ?? []));
  }, []);

  const nominalNum = Number(nominal.replace(/\D/g, '')) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnggotaId) { setError('Pilih anggota terlebih dahulu.'); return; }
    if (!nominal || nominalNum < 1000) { setError('Nominal minimal Rp 1.000.'); return; }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('simpanan_ledger').insert({
        anggota_id: selectedAnggotaId,
        jenis,
        nominal: nominalNum,
        keterangan: keterangan || null,
        verified_by: currentUserId,
      });

      if (insertError) throw insertError;

      showToast('Setoran simpanan berhasil diinput!', 'success');
      onSuccess();
      onClose();
    } catch {
      setError('Gagal menyimpan setoran. Silakan coba lagi.');
      showToast('Gagal menyimpan setoran.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-sm">Input Setoran Simpanan</div>
            <div className="text-green-300 text-xs">Verifikasi setoran anggota Kopma Unpas</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Anggota</label>
            <select
              value={selectedAnggotaId}
              onChange={(e) => setSelectedAnggotaId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700"
              disabled={loading}
            >
              <option value="">Pilih anggota...</option>
              {anggotaList.map((a) => (
                <option key={a.id} value={a.id}>{a.nim} — {a.nama_lengkap}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Jenis Simpanan</label>
            <div className="space-y-2">
              {JENIS_OPTIONS.map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${jenis === opt.value ? 'border-green-700 bg-green-50' : 'border-slate-200 hover:border-green-200'}`}>
                  <input type="radio" value={opt.value} checked={jenis === opt.value} onChange={() => setJenis(opt.value)} className="accent-green-700" disabled={loading} />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{opt.label}</div>
                    <div className="text-[11px] text-slate-500">{opt.hint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nominal (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              value={nominal}
              onChange={(e) => setNominal(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 50000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700"
              disabled={loading}
            />
            {nominalNum > 0 && (
              <p className="text-xs text-green-700 font-semibold mt-1 ml-1">{formatRupiah(nominalNum)}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keterangan (Opsional)</label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Setoran simpanan wajib bulan November 2026"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-800 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</> : '✓ Simpan Setoran'}
          </button>
        </form>
      </div>
    </div>
  );
}
