import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import HeroBanner from '@/components/portal/HeroBanner';
import { StatCard } from '@/components/portal/StatCard';
import { formatRupiah } from '@/lib/utils/currency';
import { PiggyBank, Package, Banknote, Wallet } from 'lucide-react';

function JenisBadge({ jenis }: { jenis: string }) {
  const styles: Record<string, string> = {
    pokok: 'bg-green-100 text-green-700',
    wajib: 'bg-blue-100 text-blue-700',
    sukarela: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${styles[jenis] ?? 'bg-slate-100 text-slate-600'}`}>
      {jenis}
    </span>
  );
}

export default async function AnggotaDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!profile) redirect('/');

  // Fetch simpanan totals
  const { data: simpanan } = await supabase
    .from('simpanan_ledger')
    .select('jenis, nominal')
    .eq('anggota_id', user.id);

  const totalPokok = simpanan?.filter((s) => s.jenis === 'pokok').reduce((a, s) => a + Number(s.nominal), 0) ?? 0;
  const totalWajib = simpanan?.filter((s) => s.jenis === 'wajib').reduce((a, s) => a + Number(s.nominal), 0) ?? 0;
  const totalSukarela = simpanan?.filter((s) => s.jenis === 'sukarela').reduce((a, s) => a + Number(s.nominal), 0) ?? 0;

  // Fetch konsinyasi hak
  const { data: konsinyasi } = await supabase
    .from('konsinyasi_nota')
    .select('hak_anggota')
    .eq('anggota_id', user.id)
    .eq('status', 'aktif');
  const totalHak = konsinyasi?.reduce((a, k) => a + Number(k.hak_anggota), 0) ?? 0;

  // Fetch recent 5 simpanan
  const { data: recentSimpanan } = await supabase
    .from('simpanan_ledger')
    .select('id, jenis, nominal, keterangan, created_at')
    .eq('anggota_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">PORTAL ANGGOTA</p>
        <h1 className="text-2xl font-extrabold text-slate-900">Halo, {profile.nama_lengkap}! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan akun koperasi Anda.</p>
      </div>

      {/* Hero Banner */}
      <HeroBanner
        profile={profile}
        primaryLabel="Lihat Simpanan"
        secondaryLabel="Ajukan Pencairan"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Simpanan Pokok"
          value={totalPokok}
          tag="TERVERIFIKASI"
          tagColor="green"
          icon={<PiggyBank className="w-5 h-5 text-green-700" />}
          iconBg="bg-green-100"
        />
        <StatCard
          label="Simpanan Wajib"
          value={totalWajib}
          tag="AKTIF"
          tagColor="blue"
          icon={<Wallet className="w-5 h-5 text-blue-700" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          label="Simpanan Sukarela"
          value={totalSukarela}
          tag="FLEKSIBEL"
          tagColor="amber"
          icon={<Banknote className="w-5 h-5 text-amber-700" />}
          iconBg="bg-amber-100"
        />
        <StatCard
          label="Hak Konsinyasi Bersih"
          value={totalHak}
          tag="SIAP CAIR"
          tagColor="green"
          icon={<Package className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-100"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Transaksi Simpanan Terbaru</h2>
            <p className="text-xs text-slate-500">5 setoran terakhir</p>
          </div>
          <a href="/anggota/simpanan" className="text-xs font-semibold text-green-700 hover:underline">
            Lihat Semua →
          </a>
        </div>

        {recentSimpanan && recentSimpanan.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-5 py-3 text-left font-semibold">Jenis</th>
                  <th className="px-5 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-5 py-3 text-right font-semibold">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSimpanan.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-slate-600 text-xs whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <JenisBadge jenis={s.jenis} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs">{s.keterangan ?? '—'}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatRupiah(Number(s.nominal))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
            Belum ada transaksi simpanan.
          </div>
        )}
      </div>
    </div>
  );
}
