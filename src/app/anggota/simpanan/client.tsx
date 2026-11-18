'use client';

import { useState } from 'react';
import type { SimpananLedger } from '@/lib/supabase/types';
import { formatRupiah } from '@/lib/utils/currency';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface AnggotaSimpananClientProps {
  rows: SimpananLedger[];
}

export default function AnggotaSimpananClient({ rows }: AnggotaSimpananClientProps) {
  const [filterJenis, setFilterJenis] = useState<string>('semua');
  const [search, setSearch] = useState<string>('');

  const filtered = rows.filter((r) => {
    const matchJenis = filterJenis === 'semua' || r.jenis === filterJenis;
    const matchSearch =
      search === '' ||
      (r.keterangan && r.keterangan.toLowerCase().includes(search.toLowerCase())) ||
      r.nominal.toString().includes(search);
    return matchJenis && matchSearch;
  });

  const getBadgeStyle = (jenis: string) => {
    switch (jenis) {
      case 'pokok':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'wajib':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sukarela':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari keterangan / nominal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {(['semua', 'pokok', 'wajib', 'sukarela'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterJenis(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filterJenis === tab
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">No</th>
              <th className="py-3.5 px-4 sm:px-6">Tanggal</th>
              <th className="py-3.5 px-4 sm:px-6">Jenis Simpanan</th>
              <th className="py-3.5 px-4 sm:px-6">Keterangan</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Tidak ada catatan simpanan yang cocok.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(
                        item.jenis
                      )}`}
                    >
                      {item.jenis}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs truncate">
                    {item.keterangan || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formatRupiah(Number(item.nominal))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
