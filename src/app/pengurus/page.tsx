import { createClient } from '@/lib/supabase/server';
import HeroBanner from '@/components/portal/HeroBanner';
import StatCard from '@/components/portal/StatCard';
import { formatRupiah } from '@/lib/utils/currency';
import { PiggyBank, ShoppingBag, Percent, Clock } from 'lucide-react';
import PendingApprovalWidget from './PendingApprovalWidget';

export default async function PengurusDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  // 1. Total Simpanan
  const { data: simpananData } = await supabase
    .from('simpanan_ledger')
    .select('nominal');
  const totalSimpanan = (simpananData ?? []).reduce((sum, r) => sum + (r.nominal ?? 0), 0);

  // 2. Total Penjualan Konsinyasi
  const { data: konsinyasiData } = await supabase
    .from('konsinyasi_nota')
    .select('harga_jual, qty_terjual, komisi_kopma');
  const totalPenjualan = (konsinyasiData ?? []).reduce(
    (sum, r) => sum + (r.harga_jual ?? 0) * (r.qty_terjual ?? 0),
    0
  );
  const totalKomisi = (konsinyasiData ?? []).reduce(
    (sum, r) => sum + (r.komisi_kopma ?? 0),
    0
  );

  // 4. Antrean Pencairan Pending
  const { count: pendingCount } = await supabase
    .from('pencairan_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Recent 5 pending pencairan with profiles
  const { data: pendingRequests } = await supabase
    .from('pencairan_requests')
    .select('*, profiles(nama_lengkap, nim)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
          PANEL ADMIN PENGURUS
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Halo, {profile?.nama_lengkap}!
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Ringkasan operasional koperasi hari ini.
        </p>
      </div>

      {/* Hero Banner */}
      <HeroBanner
        title="Dashboard Pengurus"
        subtitle="Kelola simpanan, konsinyasi, dan persetujuan pencairan dana anggota."
        primaryLabel="+ Input Setoran"
        primaryHref="/pengurus/simpanan?action=add"
        secondaryLabel="Lihat Semua Anggota"
        secondaryHref="/pengurus/anggota"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Total Simpanan"
          value={formatRupiah(totalSimpanan)}
          icon={<PiggyBank size={22} className="text-green-600" />}
          tag="SEMUA JENIS"
          tagColor="green"
          iconBg="bg-green-100"
        />
        <StatCard
          title="Total Penjualan Konsinyasi"
          value={formatRupiah(totalPenjualan)}
          icon={<ShoppingBag size={22} className="text-blue-600" />}
          tag="BRUTO"
          tagColor="blue"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Pendapatan Komisi Kopma"
          value={formatRupiah(totalKomisi)}
          icon={<Percent size={22} className="text-purple-600" />}
          tag="NET"
          tagColor="purple"
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Antrean Pencairan Pending"
          value={String(pendingCount ?? 0)}
          icon={<Clock size={22} className="text-amber-600" />}
          tag="PENDING"
          tagColor="amber"
          iconBg="bg-amber-100"
        />
      </div>

      {/* Pending Approval Widget */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-3">
          Antrean Pencairan — Butuh Persetujuan
        </h2>
        <PendingApprovalWidget initialRequests={pendingRequests ?? []} currentUserId={user!.id} />
      </div>
    </div>
  );
}
