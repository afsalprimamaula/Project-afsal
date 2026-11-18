import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatRupiah } from '@/lib/utils/currency';
import type { SimpananLedger } from '@/lib/supabase/types';
import AnggotaSimpananClient from './client';

export const metadata = { title: 'Simpanan Saya — Portal Anggota Kopma Unpas' };

export default async function SimpananPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: ledger } = await supabase
    .from('simpanan_ledger')
    .select('*')
    .eq('anggota_id', user.id)
    .order('created_at', { ascending: false });

  const rows = ledger ?? [];
  const totalPokok = rows.filter((r) => r.jenis === 'pokok').reduce((a, r) => a + Number(r.nominal), 0);
  const totalWajib = rows.filter((r) => r.jenis === 'wajib').reduce((a, r) => a + Number(r.nominal), 0);
  const totalSukarela = rows.filter((r) => r.jenis === 'sukarela').reduce((a, r) => a + Number(r.nominal), 0);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">PORTAL ANGGOTA</p>
        <h1 className="text-2xl font-extrabold text-slate-900">Simpanan Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Riwayat lengkap setoran simpanan Anda.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Simpanan Pokok', value: totalPokok, color: 'green' },
          { label: 'Simpanan Wajib', value: totalWajib, color: 'blue' },
          { label: 'Simpanan Sukarela', value: totalSukarela, color: 'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-white rounded-2xl border border-slate-200 p-4`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider text-${color}-600 mb-1`}>{label}</div>
            <div className="text-xl font-extrabold text-slate-900">{formatRupiah(value)}</div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
        ℹ️ <strong>Catatan:</strong> Simpanan Pokok tidak dapat dicairkan. Simpanan Wajib menjadi modal koperasi dan diperhitungkan dalam SHU (Sisa Hasil Usaha) tahunan.
      </div>

      {/* Client table with filter */}
      <AnggotaSimpananClient rows={rows as SimpananLedger[]} />
    </div>
  );
}
