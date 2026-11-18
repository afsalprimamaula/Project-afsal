// ============================================================
// src/lib/supabase/types.ts
// Database type definitions for Kopma Unpas Supabase schema
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nim: string | null;
          no_kta: string | null;
          nama_lengkap: string;
          fakultas_prodi: string | null;
          jabatan: string | null;
          role: 'anggota' | 'pengurus';
          status_aktif: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          nim?: string | null;
          no_kta?: string | null;
          nama_lengkap: string;
          fakultas_prodi?: string | null;
          jabatan?: string | null;
          role?: 'anggota' | 'pengurus';
          status_aktif?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nim?: string | null;
          no_kta?: string | null;
          nama_lengkap?: string;
          fakultas_prodi?: string | null;
          jabatan?: string | null;
          role?: 'anggota' | 'pengurus';
          status_aktif?: boolean;
          created_at?: string;
        };
      };
      simpanan_ledger: {
        Row: {
          id: string;
          anggota_id: string;
          jenis: 'pokok' | 'wajib' | 'sukarela';
          nominal: number;
          keterangan: string | null;
          verified_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          anggota_id: string;
          jenis: 'pokok' | 'wajib' | 'sukarela';
          nominal: number;
          keterangan?: string | null;
          verified_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          anggota_id?: string;
          jenis?: 'pokok' | 'wajib' | 'sukarela';
          nominal?: number;
          keterangan?: string | null;
          verified_by?: string | null;
          created_at?: string;
        };
      };
      konsinyasi_nota: {
        Row: {
          id: string;
          anggota_id: string;
          unit_usaha: string;
          nama_produk: string;
          harga_jual: number;
          qty_titip: number;
          qty_terjual: number;
          persen_komisi: number;
          komisi_kopma: number;
          hak_anggota: number;
          status: 'aktif' | 'selesai';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          anggota_id: string;
          unit_usaha: string;
          nama_produk: string;
          harga_jual: number;
          qty_titip: number;
          qty_terjual?: number;
          persen_komisi: number;
          komisi_kopma?: number;
          hak_anggota?: number;
          status?: 'aktif' | 'selesai';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          anggota_id?: string;
          unit_usaha?: string;
          nama_produk?: string;
          harga_jual?: number;
          qty_titip?: number;
          qty_terjual?: number;
          persen_komisi?: number;
          komisi_kopma?: number;
          hak_anggota?: number;
          status?: 'aktif' | 'selesai';
          created_at?: string;
          updated_at?: string;
        };
      };
      pencairan_requests: {
        Row: {
          id: string;
          anggota_id: string;
          sumber_dana: 'konsinyasi' | 'sukarela';
          nominal: number;
          metode_transfer: string;
          nomor_rekening: string;
          status: 'pending' | 'disetujui' | 'ditolak';
          reviewed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          anggota_id: string;
          sumber_dana: 'konsinyasi' | 'sukarela';
          nominal: number;
          metode_transfer: string;
          nomor_rekening: string;
          status?: 'pending' | 'disetujui' | 'ditolak';
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          anggota_id?: string;
          sumber_dana?: 'konsinyasi' | 'sukarela';
          nominal?: number;
          metode_transfer?: string;
          nomor_rekening?: string;
          status?: 'pending' | 'disetujui' | 'ditolak';
          reviewed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_email_by_identifier: {
        Args: { p_identifier: string };
        Returns: string | null;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SimpananLedger = Database['public']['Tables']['simpanan_ledger']['Row'];
export type KonsinyasiNota = Database['public']['Tables']['konsinyasi_nota']['Row'];
export type PencairanRequest = Database['public']['Tables']['pencairan_requests']['Row'];
