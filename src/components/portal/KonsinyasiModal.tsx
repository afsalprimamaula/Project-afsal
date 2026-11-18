'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/components/portal/Toast';
import { formatRupiah } from '@/lib/utils/currency';
import { X, Loader2, Calculator } from 'lucide-react';

interface Profile {
  id: string;
  nim: string | null;
  nama_lengkap: string;
}

const UNIT_OPTIONS = [
  'Toko Retail — Kampus II Tamansari',
  'Toko Retail — Kampus I Lengkong Besar',
  'Green Cafe — Kampus II Tamansari',
  'Fotokopi — Kampus IV Setiabudhi',
  'Perdagangan Umum — Online & Konveksi',
];

interface KonsinyasiModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUserId?: string; // If provided (pengurus), must select anggota. If undefined, use self.
}

export default function KonsinyasiModal({ onClose, onSuccess, currentUserId }: KonsinyasiModalProps) {
  const [anggotaList, setAnggotaList] = useState<Profile[]>([]);
  const [selectedAnggotaId, setSelectedAnggotaId] = useState('');
  const [unit, setUnit] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [qtyTitip, setQtyTitip] = useState('');
  const [qtyTerjual, setQtyTerjual] = useState('0');
  const [persenKomisi, setPersenKomisi] = useState('20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPengurus = !!currentUserId;

  useEffect(() => {
    if (isPengurus) {
      const supabase = createClient();
      supabase
        .from('profiles')
        .select('id, nim, nama_lengkap')
        .eq('role', 'anggota')
        .eq('status_aktif', true)
        .order('nama_lengkap')
        .then(({ data }) => setAnggotaList(data ?? []));
    }
  }, [isPengurus]);

  // Live calculations
  const harga = Number(hargaJual) || 0;
  const terjual = Number(qtyTerjual) || 0;
  const komisiPct = Number(persenKomisi) || 0;
  const totalPenjualan = harga * terjual;
  const komisiKopma = (totalPenjualan * komisiPct) / 100;
  const hakAnggota = totalPenjualan - komisiKopma;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const anggotaId = isPengurus ? selectedAnggotaId : currentUserId;
    if (!anggotaId) { setError('Pilih anggota terlebih dahulu.'); return; }
    if (!unit || !namaProduk || !hargaJual || !qtyTitip) {
      setError('Mohon lengkapi semua field.'); return;
    }
    if (Number(qtyTerjual) > Number(qtyTitip)) {
      setError('Qty terjual tidak boleh melebihi qty titip.'); return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('konsinyasi_nota').insert({
        anggota_id: anggotaId,
        unit_usaha: unit,
        nama_produk: namaProduk,
        harga_jual: Number(hargaJual),
        qty_titip: Number(qtyTitip),
        qty_terjual: Number(qtyTerjual),
        persen_komisi: komisiPct,
        komisi_kopma: komisiKopma,
        hak_anggota: hakAnggota,
        status: 'aktif',
      });

      if (insertError) throw insertError;

      showToast('Nota konsinyasi berhasil dibuat!', 'success');
      onSuccess();
      onClose();
    } catch {
      setError('Gagal menyimpan nota. Silakan coba lagi.');
      showToast('Gagal menyimpan nota.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-4">
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="text-white font-bold text-sm">Buat Nota Konsinyasi</div>
            <div className="text-green-300 text-xs">Input titip jual produk di unit usaha Kopma</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

          {/* Anggota selector (pengurus only) */}
          {isPengurus && (
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
                  <option key={a.id} value={a.id}>
                    {a.nim} — {a.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Unit Usaha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Unit Usaha</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700"
              disabled={loading}
            >
              <option value="">Pilih unit usaha...</option>
              {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Produk & Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Produk</label>
              <input type="text" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} placeholder="Contoh: Kue Basah" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700" disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Harga Jual (Rp)</label>
              <input type="number" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} placeholder="5000" min="0" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700" disabled={loading} />
            </div>
          </div>

          {/* Qty */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Qty Titip</label>
              <input type="number" value={qtyTitip} onChange={(e) => setQtyTitip(e.target.value)} placeholder="50" min="1" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700" disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Qty Terjual</label>
              <input type="number" value={qtyTerjual} onChange={(e) => setQtyTerjual(e.target.value)} placeholder="0" min="0" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700" disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">% Komisi</label>
              <input type="number" value={persenKomisi} onChange={(e) => setPersenKomisi(e.target.value)} placeholder="20" min="0" max="100" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700" disabled={loading} />
            </div>
          </div>

          {/* Live Preview */}
          {harga > 0 && terjual > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-2.5">
                <Calculator className="w-3.5 h-3.5" />
                Kalkulasi Otomatis
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Total Penjualan</div>
                  <div className="text-sm font-bold text-slate-800">{formatRupiah(totalPenjualan)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Komisi Kopma ({komisiPct}%)</div>
                  <div className="text-sm font-bold text-red-600">{formatRupiah(komisiKopma)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Hak Bersih Anggota</div>
                  <div className="text-sm font-bold text-green-700">{formatRupiah(hakAnggota)}</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-800 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</> : '+ Simpan Nota Konsinyasi'}
          </button>
        </form>
      </div>
    </div>
  );
}
