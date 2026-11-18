'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils/currency';
import { showToast } from '@/components/portal/Toast';
import { Plus, X, Edit2 } from 'lucide-react';

interface KonsinyasiNota {
  id: string;
  created_at: string;
  anggota_id: string;
  unit_usaha: string;
  nama_produk: string;
  harga_jual: number;
  qty_titip: number;
  qty_terjual: number;
  persen_komisi: number;
  komisi_kopma: number;
  hak_anggota: number;
  status: string;
  profiles: {
    nim: string;
    nama_lengkap: string;
  } | null;
}

const UNIT_USAHA_OPTIONS = [
  'Toko Retail — Kampus II Tamansari',
  'Toko Retail — Kampus I Lengkong Besar',
  'Green Cafe — Kampus II Tamansari',
  'Fotokopi — Kampus IV Setiabudhi',
  'Perdagangan Umum — Online & Konveksi',
];

export default function PengurusKonsinyasiPage() {
  const [notas, setNotas] = useState<KonsinyasiNota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [nimInput, setNimInput] = useState('');
  const [selectedAnggotaId, setSelectedAnggotaId] = useState('');
  const [nimLookupError, setNimLookupError] = useState('');
  const [nimLookupName, setNimLookupName] = useState('');
  const [unitUsaha, setUnitUsaha] = useState(UNIT_USAHA_OPTIONS[0]);
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [qtyTitip, setQtyTitip] = useState('');
  const [qtyTerjual, setQtyTerjual] = useState('0');
  const [persenKomisi, setPersenKomisi] = useState('20');

  // Edit qty modal
  const [editingNota, setEditingNota] = useState<KonsinyasiNota | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Live preview
  const komisiPreview =
    (Number(hargaJual) * Number(qtyTerjual) * Number(persenKomisi)) / 100;
  const hakBersihPreview =
    Number(hargaJual) * Number(qtyTerjual) - komisiPreview;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('konsinyasi_nota')
      .select('*, profiles(nim, nama_lengkap)')
      .order('created_at', { ascending: false });
    if (error) showToast('Gagal memuat data konsinyasi.', 'error');
    else setNotas(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNimLookup = async () => {
    setNimLookupError('');
    setSelectedAnggotaId('');
    setNimLookupName('');
    if (!nimInput.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, nim, nama_lengkap')
      .eq('nim', nimInput.trim())
      .single();
    if (!data) {
      setNimLookupError('Anggota tidak ditemukan.');
    } else {
      setSelectedAnggotaId(data.id);
      setNimLookupName(data.nama_lengkap);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnggotaId) {
      showToast('Cari anggota terlebih dahulu.', 'error');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const hj = Number(hargaJual);
    const qt = Number(qtyTerjual);
    const pk = Number(persenKomisi);
    const komisi = (hj * qt * pk) / 100;
    const hak = hj * qt - komisi;

    const { error } = await supabase.from('konsinyasi_nota').insert({
      anggota_id: selectedAnggotaId,
      unit_usaha: unitUsaha,
      nama_produk: namaProduk,
      harga_jual: hj,
      qty_titip: Number(qtyTitip),
      qty_terjual: qt,
      persen_komisi: pk,
      komisi_kopma: komisi,
      hak_anggota: hak,
      status: 'aktif',
    });

    if (error) {
      showToast(`Gagal: ${error.message}`, 'error');
    } else {
      showToast('Nota konsinyasi berhasil dibuat!', 'success');
      setShowModal(false);
      resetForm();
      fetchData();
    }
    setSubmitting(false);
  };

  const handleUpdateQty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNota) return;
    setEditSubmitting(true);
    const supabase = createClient();
    const newQty = Number(editQty);
    const pk = editingNota.persen_komisi;
    const hj = editingNota.harga_jual;
    const komisi = (hj * newQty * pk) / 100;
    const hak = hj * newQty - komisi;

    const { error } = await supabase
      .from('konsinyasi_nota')
      .update({ qty_terjual: newQty, komisi_kopma: komisi, hak_anggota: hak })
      .eq('id', editingNota.id);

    if (error) {
      showToast(`Gagal: ${error.message}`, 'error');
    } else {
      showToast('Qty terjual diperbarui!', 'success');
      setEditingNota(null);
      fetchData();
    }
    setEditSubmitting(false);
  };

  const handleSelesai = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('konsinyasi_nota')
      .update({ status: 'selesai' })
      .eq('id', id);
    if (error) showToast(`Gagal: ${error.message}`, 'error');
    else {
      showToast('Nota ditandai selesai.', 'success');
      fetchData();
    }
  };

  const resetForm = () => {
    setNimInput('');
    setSelectedAnggotaId('');
    setNimLookupName('');
    setNimLookupError('');
    setUnitUsaha(UNIT_USAHA_OPTIONS[0]);
    setNamaProduk('');
    setHargaJual('');
    setQtyTitip('');
    setQtyTerjual('0');
    setPersenKomisi('20');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">ADMIN</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Nota Konsinyasi</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola titip jual anggota.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} /> Buat Nota Konsinyasi
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {['Tanggal', 'Anggota', 'Unit Usaha', 'Produk', 'Harga Jual', 'Qty Terjual/Titip', 'Komisi Kopma', 'Hak Bersih', 'Status', 'Aksi'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            ) : notas.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Belum ada nota konsinyasi.
                </td>
              </tr>
            ) : (
              notas.map((nota) => (
                <tr key={nota.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(nota.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                    {nota.profiles?.nama_lengkap ?? '—'}
                    <div className="text-xs text-slate-400">{nota.profiles?.nim}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[160px]">
                    {nota.unit_usaha}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{nota.nama_produk}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatRupiah(nota.harga_jual)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">
                    {nota.qty_terjual}/{nota.qty_titip}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    {formatRupiah(nota.komisi_kopma)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">
                    {formatRupiah(nota.hak_anggota)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        nota.status === 'aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {nota.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {nota.status === 'aktif' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingNota(nota);
                            setEditQty(String(nota.qty_terjual));
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                        >
                          <Edit2 size={11} /> Qty
                        </button>
                        <button
                          onClick={() => handleSelesai(nota.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          Selesai
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Nota Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Buat Nota Konsinyasi</h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* NIM Lookup */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">NIM Anggota</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nimInput}
                    onChange={(e) => setNimInput(e.target.value)}
                    placeholder="Masukkan NIM..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleNimLookup}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-lg"
                  >
                    Cari
                  </button>
                </div>
                {nimLookupError && <p className="text-xs text-red-500 mt-1">{nimLookupError}</p>}
                {nimLookupName && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 font-medium">
                    ✓ {nimLookupName}
                  </div>
                )}
              </div>

              {/* Unit Usaha */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Usaha</label>
                <select
                  value={unitUsaha}
                  onChange={(e) => setUnitUsaha(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {UNIT_USAHA_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  required
                  placeholder="Nama produk..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={hargaJual}
                    onChange={(e) => setHargaJual(e.target.value)}
                    required
                    min={0}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qty Titip</label>
                  <input
                    type="number"
                    value={qtyTitip}
                    onChange={(e) => setQtyTitip(e.target.value)}
                    required
                    min={1}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qty Terjual</label>
                  <input
                    type="number"
                    value={qtyTerjual}
                    onChange={(e) => setQtyTerjual(e.target.value)}
                    min={0}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">% Komisi Kopma</label>
                  <input
                    type="number"
                    value={persenKomisi}
                    onChange={(e) => setPersenKomisi(e.target.value)}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {(Number(hargaJual) > 0 || Number(qtyTerjual) > 0) && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Komisi Kopma:</span>
                    <span className="font-semibold text-red-600">{formatRupiah(komisiPreview)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hak Bersih Anggota:</span>
                    <span className="font-semibold text-green-700">{formatRupiah(hakBersihPreview)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedAnggotaId}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Nota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Qty Modal */}
      {editingNota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Update Qty Terjual</h2>
              <button
                onClick={() => setEditingNota(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateQty} className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-600">
                Produk: <span className="font-semibold">{editingNota.nama_produk}</span>
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Qty Terjual (maks. {editingNota.qty_titip})
                </label>
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  min={0}
                  max={editingNota.qty_titip}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNota(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50"
                >
                  {editSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
