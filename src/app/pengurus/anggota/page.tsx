'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/components/portal/Toast';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import type { Profile } from '@/lib/supabase/types';

export default function PengurusAnggotaPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'semua' | 'anggota' | 'pengurus'>('semua');

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      showToast('Gagal memuat direktori anggota.', 'error');
    } else {
      setProfiles(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const filtered = profiles.filter((p) => {
    const matchRole = roleFilter === 'semua' || p.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      search === '' ||
      p.nama_lengkap.toLowerCase().includes(q) ||
      (p.nim && p.nim.toLowerCase().includes(q)) ||
      (p.no_kta && p.no_kta.toLowerCase().includes(q)) ||
      (p.fakultas_prodi && p.fakultas_prodi.toLowerCase().includes(q));
    return matchRole && matchSearch;
  });

  const totalAnggota = profiles.filter((p) => p.role === 'anggota').length;
  const totalPengurus = profiles.filter((p) => p.role === 'pengurus').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
            PANEL ADMIN PENGURUS
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Direktori Anggota Kopma Unpas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Data seluruh anggota dan pengurus terdaftar di database koperasi.
          </p>
        </div>

        <button
          onClick={fetchProfiles}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-xs self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Terdaftar
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{profiles.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
            Anggota Aktif
          </div>
          <div className="text-2xl font-extrabold text-blue-900">{totalAnggota}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">
            Pengurus Koperasi
          </div>
          <div className="text-2xl font-extrabold text-green-900">{totalPengurus}</div>
        </div>
      </div>

      {/* Control Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM, No. KTA, Nama, atau Prodi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {(['semua', 'anggota', 'pengurus'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  roleFilter === tab
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">No</th>
                <th className="py-3.5 px-4 sm:px-6">Nama Lengkap</th>
                <th className="py-3.5 px-4 sm:px-6">NIM / NPM</th>
                <th className="py-3.5 px-4 sm:px-6">Nomor KTA</th>
                <th className="py-3.5 px-4 sm:px-6">Fakultas / Program Studi</th>
                <th className="py-3.5 px-4 sm:px-6">Peran / Role</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Memuat direktori anggota...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada anggota yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">{item.nama_lengkap}</div>
                      {item.jabatan && (
                        <div className="text-[11px] text-green-700 font-medium">
                          {item.jabatan}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-700 font-semibold">
                      {item.nim || <span className="text-slate-300 font-normal italic">—</span>}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-700">
                      {item.no_kta || <span className="text-slate-300 font-normal italic">—</span>}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                      {item.fakultas_prodi || (
                        <span className="text-slate-300 italic">Belum diisi</span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.role === 'pengurus'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {item.role === 'pengurus' ? (
                          <ShieldCheck className="w-3 h-3 text-green-700" />
                        ) : (
                          <UserCheck className="w-3 h-3 text-blue-700" />
                        )}
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.status_aktif
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {item.status_aktif ? '● Aktif' : 'Nonaktif'}
                      </span>
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
