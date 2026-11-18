'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MemberPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberPortalModal({ isOpen, onClose }: MemberPortalModalProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

      // Step 1: Resolve NIM or No. KTA → email
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

      // Step 2: Sign in with resolved email
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailResult,
        password,
      });

      if (signInError || !signInData.user) {
        setError('Password salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      // Step 3: Fetch role and redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', signInData.user.id)
        .single();

      onClose();
      router.refresh();

      if (profile?.role === 'pengurus') {
        router.push('/pengurus');
      } else {
        router.push('/anggota');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-5 sm:px-6 py-5 sm:py-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-700/30 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative pr-8">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-amber-400/50 flex-shrink-0 bg-white">
                <Image src="/images/logo-kopma.jpg" alt="Logo Kopma Unpas" fill className="object-cover" />
              </div>
              <div>
                <div className="text-white font-bold text-base sm:text-lg leading-tight">Portal Anggota</div>
                <div className="text-green-300 text-xs">Kopma Unpas Digital Hub</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold">
              <Lock className="w-3 h-3" />
              Masuk dengan NIM atau Nomor KTA
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-5 sm:p-6">
          {/* Demo credentials hint */}
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200/80 flex gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-800 leading-relaxed">
              <strong>Demo Testing:</strong>
              <br />• Anggota: <code className="bg-blue-100 px-1 rounded">243040092</code> atau <code className="bg-blue-100 px-1 rounded">KTA-2026-001</code>
              <br />• Pengurus: <code className="bg-blue-100 px-1 rounded">243040001</code> atau <code className="bg-blue-100 px-1 rounded">ADM-2026-001</code>
              <br />• Password: <code className="bg-blue-100 px-1 rounded">root123</code>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* NIM / KTA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIM atau Nomor KTA
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                placeholder="Contoh: 243040092 atau KTA-2026-001"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-all"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password (default: root123)"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-700 transition-all"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-green-800 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98 text-white text-sm font-semibold transition-all shadow-md shadow-green-900/20"
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

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Belum terdaftar? Hubungi sekretariat Kopma Unpas
          </p>
        </div>
      </div>
    </div>
  );
}
