'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatRupiah } from '@/lib/utils/currency';
import { showToast } from '@/components/portal/Toast';

type PencairanRequest = {
  id: string;
  created_at: string;
  sumber_dana: 'konsinyasi' | 'sukarela';
  nominal: number;
  metode_transfer: string;
  nomor_rekening: string;
  status: 'pending' | 'disetujui' | 'ditolak';
};

type FormState = {
  sumber_dana: 'konsinyasi' | 'sukarela';
  nominal: string;
  metode_transfer: string;
  nomor_rekening: string;
};

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  disetujui: 'bg-green-100 text-green-700',
  ditolak: 'bg-red-100 text-red-700',
};

const defaultForm: FormState = {
  sumber_dana: 'sukarela',
  nominal: '',
  metode_transfer: '',
  nomor_rekening: '',
};

export default function PencairanPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<PencairanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('pencairan_requests')
      .select('id, created_at, sumber_dana, nominal, metode_transfer, nomor_rekening, status')
      .eq('anggota_id', user.id)
      .order('created_at', { ascending: false });
    setRequests((data as PencairanRequest[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showToast('Sesi habis, silakan login ulang.', 'error');
        setSubmitting(false);
        return;
      }
      const nominalNum = Number(form.nominal);
      if (!nominalNum || nominalNum <= 0) {
        showToast('Nominal harus lebih dari 0.', 'error');
        setSubmitting(false);
        return;
      }
      const { error } = await supabase.from('pencairan_requests').insert({
        anggota_id: user.id,
        sumber_dana: form.sumber_dana,
        nominal: nominalNum,
        metode_transfer: form.metode_transfer,
        nomor_rekening: form.nomor_rekening,
        status: 'pending',
      });
      if (error) {
        showToast(`Gagal mengajukan: ${error.message}`, 'error');
      } else {
        showToast('Pengajuan pencairan berhasil dikirim!', 'success');
        setModalOpen(false);
        setForm(defaultForm);
        await fetchRequests();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
            KEUANGAN
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">Pencairan Dana</h1>
          <p className="text-slate-500 text-sm mt-1">
            Ajukan dan pantau status pencairan dana simpanan atau konsinyasi Anda.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Ajukan Pencairan Dana
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Riwayat Pengajuan</h2>
        </div>
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Memuat data...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Belum ada pengajuan pencairan dana.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-5 py-3 text-left font-semibold">Sumber Dana</th>
                  <th className="px-5 py-3 text-right font-semibold">Nominal</th>
                  <th className="px-5 py-3 text-left font-semibold">Metode</th>
                  <th className="px-5 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-700">{req.sumber_dana}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800">
                      {formatRupiah(req.nominal)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{req.metode_transfer}</td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge[req.status] ?? 'bg-slate-100 text-slate-600'}`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Ajukan Pencairan Dana</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Sumber Dana */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Sumber Dana
                </label>
                <select
                  value={form.sumber_dana}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sumber_dana: e.target.value as 'konsinyasi' | 'sukarela',
                    }))
                  }
                  required
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="sukarela">Simpanan Sukarela</option>
                  <option value="konsinyasi">Hak Konsinyasi</option>
                </select>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.nominal}
                  onChange={(e) => setForm((f) => ({ ...f, nominal: e.target.value }))}
                  required
                  placeholder="Contoh: 500000"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Metode Transfer */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Metode Transfer
                </label>
                <input
                  type="text"
                  value={form.metode_transfer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, metode_transfer: e.target.value }))
                  }
                  required
                  placeholder="Contoh: Transfer BCA, OVO, GoPay"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nomor Rekening */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nomor Rekening / Akun
                </label>
                <input
                  type="text"
                  value={form.nomor_rekening}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nomor_rekening: e.target.value }))
                  }
                  required
                  placeholder="Contoh: 1234567890"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setForm(defaultForm);
                  }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Mengirim...' : 'Ajukan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
