'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn, Info, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Mohon isi NIM/Nomor KTA dan password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Step 1: Call RPC to resolve identifier to internal auth email
      const { data: emailResult, error: rpcError } = await supabase.rpc(
        'get_email_by_identifier',
        { p_identifier: identifier.trim() }
      );

      if (rpcError) {
        console.error('Supabase RPC Error:', rpcError);
        if (
          rpcError.code === 'PGRST202' ||
          rpcError.code === 'PGRST205' ||
          rpcError.message?.includes('schema cache')
        ) {
          setError(
            'Tabel database belum dibuat di Supabase. Silakan jalankan file supabase/SETUP_ALL_IN_ONE.sql di Supabase SQL Editor.'
          );
        } else {
          setError(`Koneksi Supabase error: ${rpcError.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (!emailResult) {
        setError('NIM atau Nomor KTA tidak terdaftar.');
        setIsLoading(false);
        return;
      }

      // Step 2: Sign in with password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailResult,
        password,
      });

      if (signInError || !signInData.user) {
        setError('Password salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      // Step 3: Check role and redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', signInData.user.id)
        .single();

      router.refresh();

      if (profile?.role === 'pengurus') {
        router.push('/pengurus');
      } else {
        router.push('/anggota');
      }
    } catch {
      setError('Terjadi kendala pada sistem. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-8 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-700/30 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <Link
            href="/"
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="relative flex flex-col items-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-amber-400 mb-3 bg-white">
              <Image
                src="/images/logo-kopma.jpg"
                alt="Logo Kopma Unpas"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">KOPMA UNPAS</h1>
            <p className="text-xs text-emerald-300 font-medium mt-0.5">Portal Layanan Digital Terintegrasi</p>
            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Login Portal Anggota & Pengurus
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Demo Helper Hint */}
          <div className="mb-5 p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 flex gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-800 leading-relaxed">
              <strong className="font-bold">Kredensial Demo Testing:</strong>
              <div className="mt-1">
                • <strong>Anggota:</strong> <code className="bg-blue-100/80 px-1 rounded">243040092</code> / <code className="bg-blue-100/80 px-1 rounded">KTA-2026-001</code>
              </div>
              <div className="mt-0.5">
                • <strong>Pengurus:</strong> <code className="bg-blue-100/80 px-1 rounded">243040001</code> / <code className="bg-blue-100/80 px-1 rounded">ADM-2026-001</code>
              </div>
              <div className="mt-0.5">
                • <strong>Password:</strong> <code className="bg-blue-100/80 px-1 rounded">root123</code>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NIM atau Nomor KTA
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: 243040092 atau KTA-2026-001"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Masukkan password (default: root123)"
                  className="w-full px-4 py-3 pr-11 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-green-800 hover:bg-green-700 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-green-900/20 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Kembali ke{' '}
            <Link href="/" className="text-green-800 font-bold hover:underline">
              Halaman Utama Profil Koperasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
