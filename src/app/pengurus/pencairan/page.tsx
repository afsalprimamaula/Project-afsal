'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils/currency';
import { showToast } from '@/components/portal/Toast';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  User,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

interface PencairanJoined {
  id: string;
  anggota_id: string;
  sumber_dana: 'konsinyasi' | 'sukarela';
  nominal: number;
  metode_transfer: string;
  nomor_rekening: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  created_at: string;
  profiles?: {
    nama_lengkap: string;
    nim: string | null;
    no_kta: string | null;
  } | null;
}

export default function PengurusPencairanPage() {
  const [requests, setRequests] = useState<PencairanJoined[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [search, setSearch] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    const { data, error } = await supabase
      .from('pencairan_requests')
      .select('*, profiles(nama_lengkap, nim, no_kta)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      showToast('Gagal memuat antrean pencairan.', 'error');
    } else {
      setRequests((data as unknown as PencairanJoined[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (id: string, newStatus: 'disetujui' | 'ditolak') => {
    setUpdatingId(id);
    const supabase = createClient();

    const { error } = await supabase
      .from('pencairan_requests')
      .update({
        status: newStatus,
        reviewed_by: currentUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      showToast('Gagal memperbarui status permintaan.', 'error');
    } else {
      showToast(
        newStatus === 'disetujui'
          ? 'Pencairan berhasil disetujui!'
          : 'Pencairan telah ditolak.',
        newStatus === 'disetujui' ? 'success' : 'info'
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
    setUpdatingId(null);
  };

  const filtered = requests.filter((r) => {
    const matchStatus = statusFilter === 'semua' || r.status === statusFilter;
    const memberName = r.profiles?.nama_lengkap?.toLowerCase() || '';
    const memberNim = r.profiles?.nim?.toLowerCase() || '';
    const memberKta = r.profiles?.no_kta?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch =
      search === '' ||
      memberName.includes(q) ||
      memberNim.includes(q) ||
      memberKta.includes(q) ||
      r.nomor_rekening.includes(q);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Disetujui
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
            PANEL ADMIN PENGURUS
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Verifikasi Pencairan Dana
            {pendingCount > 0 && (
              <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                {pendingCount} Pending
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tinjau dan proses permohonan pencairan dana simpanan sukarela dan konsinyasi anggota.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* Control Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama anggota, NIM, no. rekening..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {(['semua', 'pending', 'disetujui', 'ditolak'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  statusFilter === tab
                    ? 'bg-white text-green-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Anggota Pemohon</th>
                <th className="py-3.5 px-4 sm:px-6">Tanggal Diajukan</th>
                <th className="py-3.5 px-4 sm:px-6">Sumber Dana</th>
                <th className="py-3.5 px-4 sm:px-6">Tujuan Transfer</th>
                <th className="py-3.5 px-4 sm:px-6">Nominal</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Memuat data permohonan...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada antrean pencairan dana yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">
                        {item.profiles?.nama_lengkap || 'Anggota Tanpa Nama'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.profiles?.nim || '-'} | {item.profiles?.no_kta || '-'}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {item.sumber_dana === 'konsinyasi' ? '📦 Konsinyasi' : '💰 Sukarela'}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-slate-800">{item.metode_transfer}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.nomor_rekening}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                      {formatRupiah(Number(item.nominal))}
                    </td>
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                      {item.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'disetujui')}
                            disabled={updatingId === item.id}
                            className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'ditolak')}
                            disabled={updatingId === item.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Telah diproses</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
