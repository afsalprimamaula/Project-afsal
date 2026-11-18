'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils/currency';
import { showToast } from '@/components/portal/Toast';
import { Search, Plus, X } from 'lucide-react';

interface SimpananEntry {
  id: string;
  created_at: string;
  jenis: 'pokok' | 'wajib' | 'sukarela';
  nominal: number;
  keterangan: string | null;
  verified_by: string | null;
  profiles: {
    nim: string;
    nama_lengkap: string;
  } | null;
}

interface AnggotaProfile {
  id: string;
  nim: string;
  nama_lengkap: string;
}

const JENIS_COLORS: Record<string, string> = {
  pokok: 'bg-green-100 text-green-700',
  wajib: 'bg-blue-100 text-blue-700',
  sukarela: 'bg-amber-100 text-amber-700',
};

export default function PengurusSimpananPage() {
  const [entries, setEntries] = useState<SimpananEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal form state
  const [nimInput, setNimInput] = useState('');
  const [selectedAnggota, setSelectedAnggota] = useState<AnggotaProfile | null>(null);
  const [jenis, setJenis] = useState<'pokok' | 'wajib' | 'sukarela'>('wajib');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [nimLookupError, setNimLookupError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('simpanan_ledger')
      .select('*, profiles(nim, nama_lengkap)')
      .order('created_at', { ascending: false });

    if (error) showToast('Gagal memuat data simpanan.', 'error');
    else setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check URL for ?action=add
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') setShowModal(true);
  }, []);

  const handleNimLookup = async () => {
    setNimLookupError('');
    setSelectedAnggota(null);
    if (!nimInput.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, nim, nama_lengkap')
      .eq('nim', nimInput.trim())
      .single();
    if (!data) {
      setNimLookupError('Anggota dengan NIM tersebut tidak ditemukan.');
    } else {
      setSelectedAnggota(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnggota) {
      showToast('Cari anggota terlebih dahulu.', 'error');
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      showToast('Nominal tidak valid.', 'error');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('simpanan_ledger').insert({
      anggota_id: selectedAnggota.id,
      jenis,
      nominal: Number(nominal),
      keterangan: keterangan || null,
      verified_by: user?.id ?? null,
    });

    if (error) {
      showToast(`Gagal: ${error.message}`, 'error');
    } else {
      showToast('Setoran berhasil diinput!', 'success');
      setShowModal(false);
      setNimInput('');
      setSelectedAnggota(null);
      setJenis('wajib');
      setNominal('');
      setKeterangan('');
      fetchData();
    }
    setSubmitting(false);
  };

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.profiles?.nim?.toLowerCase().includes(q) ||
      e.profiles?.nama_lengkap?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">ADMIN</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Simpanan</h1>
          <p className="text-slate-500 text-sm mt-1">Semua transaksi simpanan anggota.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} /> Input Setoran Simpanan
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari NIM atau nama anggota..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {['No', 'Tanggal', 'NIM', 'Nama', 'Jenis', 'Nominal', 'Keterangan'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">
                  Tidak ada data simpanan.
                </td>
              </tr>
            ) : (
              filtered.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{entry.profiles?.nim ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {entry.profiles?.nama_lengkap ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        JENIS_COLORS[entry.jenis] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {entry.jenis}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {formatRupiah(entry.nominal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {entry.keterangan ?? '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Input Setoran Simpanan</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* NIM Lookup */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  NIM Anggota
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nimInput}
                    onChange={(e) => setNimInput(e.target.value)}
                    placeholder="Masukkan NIM..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleNimLookup}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cari
                  </button>
                </div>
                {nimLookupError && (
                  <p className="text-xs text-red-500 mt-1">{nimLookupError}</p>
                )}
                {selectedAnggota && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium">
                    ✓ {selectedAnggota.nama_lengkap} ({selectedAnggota.nim})
                  </div>
                )}
              </div>

              {/* Jenis */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Jenis Simpanan
                </label>
                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value as 'pokok' | 'wajib' | 'sukarela')}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="pokok">Pokok</option>
                  <option value="wajib">Wajib</option>
                  <option value="sukarela">Sukarela</option>
                </select>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  min={0}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Opsional..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedAnggota}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
