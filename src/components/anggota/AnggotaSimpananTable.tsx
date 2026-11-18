'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils/currency';

type SimpananRow = {
  id: string;
  created_at: string;
  jenis: 'pokok' | 'wajib' | 'sukarela';
  keterangan: string | null;
  nominal: number;
};

type Props = {
  rows: SimpananRow[];
};

const jenisBadgeClass: Record<string, string> = {
  pokok: 'bg-green-100 text-green-700',
  wajib: 'bg-blue-100 text-blue-700',
  sukarela: 'bg-amber-100 text-amber-700',
};

type JenisFilter = 'semua' | 'pokok' | 'wajib' | 'sukarela';

export default function AnggotaSimpananTable({ rows }: Props) {
  const [filter, setFilter] = useState<JenisFilter>('semua');

  const filtered =
    filter === 'semua' ? rows : rows.filter((r) => r.jenis === filter);

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium text-slate-600">Filter Jenis:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as JenisFilter)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="semua">Semua</option>
          <option value="pokok">Pokok</option>
          <option value="wajib">Wajib</option>
          <option value="sukarela">Sukarela</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Tidak ada data simpanan untuk jenis ini.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold w-10">No</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-left font-semibold">Jenis</th>
                <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                <th className="px-4 py-3 text-right font-semibold">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filtered.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${jenisBadgeClass[row.jenis] ?? 'bg-slate-100 text-slate-700'}`}
                    >
                      {row.jenis}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.keterangan ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {formatRupiah(row.nominal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
