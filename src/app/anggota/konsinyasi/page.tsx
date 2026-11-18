import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatRupiah } from '@/lib/utils/currency';

type KonsinyasiNota = {
  id: string;
  created_at: string;
  unit_usaha: string;
  nama_produk: string;
  harga_jual: number;
  qty_titip: number;
  qty_terjual: number;
  persen_komisi: number;
  komisi_kopma: number;
  hak_anggota: number;
  status: 'aktif' | 'selesai';
};

export default async function KonsinyasiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: rows } = await supabase
    .from('konsinyasi_nota')
    .select(
      'id, created_at, unit_usaha, nama_produk, harga_jual, qty_titip, qty_terjual, persen_komisi, komisi_kopma, hak_anggota, status',
    )
    .eq('anggota_id', user.id)
    .order('created_at', { ascending: false });

  const notas: KonsinyasiNota[] = rows ?? [];

  const aktifItems = notas.filter((n) => n.status === 'aktif');
  const totalQtyTerjual = notas.reduce((acc, n) => acc + (n.qty_terjual ?? 0), 0);
  const totalQtyTitip = notas.reduce((acc, n) => acc + (n.qty_titip ?? 0), 0);
  const totalHak = notas.reduce((acc, n) => acc + (n.hak_anggota ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
          KONSINYASI
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900">Titip Jual (Konsinyasi)</h1>
        <p className="text-slate-500 text-sm mt-1">
          Daftar nota konsinyasi produk Anda di unit usaha koperasi.
        </p>
      </div>

      {notas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">📦</span>
          <p className="text-slate-500 text-sm">Anda belum memiliki nota konsinyasi.</p>
          <p className="text-slate-400 text-xs">
            Hubungi pengurus untuk mendaftarkan produk Anda.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Item Aktif
              </p>
              <p className="text-2xl font-extrabold text-green-700">{aktifItems.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">nota aktif</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Total Terjual / Titip
              </p>
              <p className="text-2xl font-extrabold text-blue-700">
                {totalQtyTerjual}
                <span className="text-base font-normal text-slate-400">
                  {' '}
                  / {totalQtyTitip}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">unit produk</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Total Hak Anggota
              </p>
              <p className="text-2xl font-extrabold text-emerald-700">
                {formatRupiah(totalHak)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">bersih setelah komisi</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Daftar Nota</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 text-left font-semibold">Unit Usaha</th>
                    <th className="px-5 py-3 text-left font-semibold">Produk</th>
                    <th className="px-5 py-3 text-right font-semibold">Harga Jual</th>
                    <th className="px-5 py-3 text-center font-semibold">Terjual / Titip</th>
                    <th className="px-5 py-3 text-right font-semibold">Komisi Kopma</th>
                    <th className="px-5 py-3 text-right font-semibold">Hak Bersih</th>
                    <th className="px-5 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {notas.map((nota) => {
                    const progress =
                      nota.qty_titip > 0
                        ? Math.round((nota.qty_terjual / nota.qty_titip) * 100)
                        : 0;
                    return (
                      <tr key={nota.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 text-slate-700 max-w-[160px] truncate">
                          {nota.unit_usaha}
                        </td>
                        <td className="px-5 py-3 text-slate-700 font-medium">
                          {nota.nama_produk}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-700">
                          {formatRupiah(nota.harga_jual)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-700">
                              {nota.qty_terjual}/{nota.qty_titip}
                            </span>
                            <div className="w-20 bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-700">
                          {formatRupiah(nota.komisi_kopma)}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-emerald-700">
                          {formatRupiah(nota.hak_anggota)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              nota.status === 'aktif'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {nota.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
