'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils/currency';
import { showToast } from '@/components/portal/Toast';
import { Check, X } from 'lucide-react';

interface PencairanRequest {
  id: string;
  created_at: string;
  nominal: number;
  sumber_dana?: string;
  sumber?: string;
  metode_transfer: string;
  status: string;
  profiles: {
    nama_lengkap: string;
    nim?: string | null;
  } | null;
}

interface Props {
  initialRequests: any[];
  currentUserId: string;
}

export default function PendingApprovalWidget({ initialRequests, currentUserId }: Props) {
  const [requests, setRequests] = useState<PencairanRequest[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, newStatus: 'disetujui' | 'ditolak') => {
    setLoadingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from('pencairan_requests')
      .update({ status: newStatus, reviewed_by: currentUserId })
      .eq('id', id);

    if (error) {
      showToast(`Gagal: ${error.message}`, 'error');
    } else {
      showToast(
        newStatus === 'disetujui' ? 'Pencairan disetujui.' : 'Pencairan ditolak.',
        newStatus === 'disetujui' ? 'success' : 'error'
      );
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
    setLoadingId(null);
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
        Tidak ada antrean pencairan pending.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {['Tanggal', 'Anggota', 'Sumber', 'Nominal', 'Metode', 'Aksi'].map((h) => (
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
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                {new Date(req.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-slate-800">
                {req.profiles?.nama_lengkap ?? '—'}
                <div className="text-xs text-slate-400 font-mono">{req.profiles?.nim || '-'}</div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                {req.sumber_dana ?? req.sumber ?? '—'}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                {formatRupiah(req.nominal)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                {req.metode_transfer}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    disabled={loadingId === req.id}
                    onClick={() => handleAction(req.id, 'disetujui')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Check size={12} /> Setujui
                  </button>
                  <button
                    disabled={loadingId === req.id}
                    onClick={() => handleAction(req.id, 'ditolak')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <X size={12} /> Tolak
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
