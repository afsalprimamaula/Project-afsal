-- ============================================================
-- KOPMA UNPAS FASE 2 — SETUP ALL-IN-ONE (1-CLICK RUN)
-- Copy paste ALL of this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. HELPER FUNCTION: auto-update updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 2. CREATE TABLES (MUST BE CREATED FIRST)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nim            TEXT        UNIQUE,
  no_kta         TEXT        UNIQUE,
  nama_lengkap   TEXT        NOT NULL,
  fakultas_prodi TEXT,
  jabatan        TEXT,
  role           TEXT        NOT NULL DEFAULT 'anggota' CHECK (role IN ('anggota', 'pengurus')),
  status_aktif   BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.simpanan_ledger (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id  UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jenis       TEXT          NOT NULL CHECK (jenis IN ('pokok', 'wajib', 'sukarela')),
  nominal     DECIMAL(15,2) NOT NULL CHECK (nominal > 0),
  keterangan  TEXT,
  verified_by UUID          REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.konsinyasi_nota (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id    UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_usaha    TEXT          NOT NULL,
  nama_produk   TEXT          NOT NULL,
  harga_jual    DECIMAL(15,2) NOT NULL CHECK (harga_jual >= 0),
  qty_titip     INTEGER       NOT NULL CHECK (qty_titip > 0),
  qty_terjual   INTEGER       NOT NULL DEFAULT 0 CHECK (qty_terjual >= 0),
  persen_komisi DECIMAL(5,2)  NOT NULL DEFAULT 20.00 CHECK (persen_komisi BETWEEN 0 AND 100),
  komisi_kopma  DECIMAL(15,2) NOT NULL DEFAULT 0,
  hak_anggota   DECIMAL(15,2) NOT NULL DEFAULT 0,
  status        TEXT          NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pencairan_requests (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id      UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sumber_dana     TEXT          NOT NULL CHECK (sumber_dana IN ('konsinyasi', 'sukarela')),
  nominal         DECIMAL(15,2) NOT NULL CHECK (nominal > 0),
  metode_transfer TEXT          NOT NULL,
  nomor_rekening  TEXT          NOT NULL,
  status          TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'disetujui', 'ditolak')),
  reviewed_by     UUID          REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at (created AFTER tables exist)
DROP TRIGGER IF EXISTS trg_konsinyasi_updated_at ON public.konsinyasi_nota;
CREATE TRIGGER trg_konsinyasi_updated_at
  BEFORE UPDATE ON public.konsinyasi_nota
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pencairan_updated_at ON public.pencairan_requests;
CREATE TRIGGER trg_pencairan_updated_at
  BEFORE UPDATE ON public.pencairan_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 3. FUNCTION: get_email_by_identifier
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_email_by_identifier(p_identifier TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  SELECT id INTO v_user_id
  FROM public.profiles
  WHERE nim = p_identifier OR no_kta = p_identifier
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT email INTO v_email
  FROM auth.users
  WHERE id = v_user_id;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_identifier(TEXT) TO anon, authenticated;

-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simpanan_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konsinyasi_nota ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pencairan_requests ENABLE ROW LEVEL SECURITY;

-- Helper check pengurus
CREATE OR REPLACE FUNCTION public.is_pengurus(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'pengurus'
  );
$$;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Simpanan policies
DROP POLICY IF EXISTS "simpanan_select" ON public.simpanan_ledger;
CREATE POLICY "simpanan_select" ON public.simpanan_ledger FOR SELECT
USING (auth.uid() = anggota_id OR public.is_pengurus(auth.uid()));

DROP POLICY IF EXISTS "simpanan_insert_pengurus" ON public.simpanan_ledger;
CREATE POLICY "simpanan_insert_pengurus" ON public.simpanan_ledger FOR INSERT
WITH CHECK (public.is_pengurus(auth.uid()));

-- Konsinyasi policies
DROP POLICY IF EXISTS "konsinyasi_select" ON public.konsinyasi_nota;
CREATE POLICY "konsinyasi_select" ON public.konsinyasi_nota FOR SELECT
USING (auth.uid() = anggota_id OR public.is_pengurus(auth.uid()));

DROP POLICY IF EXISTS "konsinyasi_write_pengurus" ON public.konsinyasi_nota;
CREATE POLICY "konsinyasi_write_pengurus" ON public.konsinyasi_nota FOR ALL
USING (public.is_pengurus(auth.uid()));

-- Pencairan policies
DROP POLICY IF EXISTS "pencairan_select" ON public.pencairan_requests;
CREATE POLICY "pencairan_select" ON public.pencairan_requests FOR SELECT
USING (auth.uid() = anggota_id OR public.is_pengurus(auth.uid()));

DROP POLICY IF EXISTS "pencairan_insert_anggota" ON public.pencairan_requests;
CREATE POLICY "pencairan_insert_anggota" ON public.pencairan_requests FOR INSERT
WITH CHECK (auth.uid() = anggota_id);

DROP POLICY IF EXISTS "pencairan_update_pengurus" ON public.pencairan_requests;
CREATE POLICY "pencairan_update_pengurus" ON public.pencairan_requests FOR UPDATE
USING (public.is_pengurus(auth.uid()));

-- ------------------------------------------------------------
-- 5. INSERT DEMO USERS INTO auth.users, auth.identities & public.profiles
-- Password for all: root123
-- ------------------------------------------------------------
-- User 1: Anggota (243040092 / KTA-2026-001)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'anggota1@kopma.unpas.ac.id',
  crypt('root123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Budi Santoso"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO UPDATE
SET encrypted_password = crypt('root123', gen_salt('bf')),
    email_confirmed_at = NOW();

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'a1111111-1111-1111-1111-111111111111',
  format('{"sub":"%s","email":"%s"}', 'a1111111-1111-1111-1111-111111111111', 'anggota1@kopma.unpas.ac.id')::jsonb,
  'email',
  'a1111111-1111-1111-1111-111111111111',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- User 2: Pengurus (243040001 / ADM-2026-001)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'pengurus@kopma.unpas.ac.id',
  crypt('root123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nama_lengkap":"Ahmad Fauzi"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO UPDATE
SET encrypted_password = crypt('root123', gen_salt('bf')),
    email_confirmed_at = NOW();

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'b2222222-2222-2222-2222-222222222222',
  format('{"sub":"%s","email":"%s"}', 'b2222222-2222-2222-2222-222222222222', 'pengurus@kopma.unpas.ac.id')::jsonb,
  'email',
  'b2222222-2222-2222-2222-222222222222',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- Insert Profiles
INSERT INTO public.profiles (id, nim, no_kta, nama_lengkap, fakultas_prodi, jabatan, role, status_aktif)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '243040092', 'KTA-2026-001', 'Budi Santoso', 'Teknik / Teknik Informatika', 'Anggota Biasa', 'anggota', true),
  ('b2222222-2222-2222-2222-222222222222', '243040001', 'ADM-2026-001', 'Ahmad Fauzi', 'Ekonomi / Manajemen', 'Ketua Umum', 'pengurus', true)
ON CONFLICT (id) DO UPDATE
SET nim = EXCLUDED.nim,
    no_kta = EXCLUDED.no_kta,
    nama_lengkap = EXCLUDED.nama_lengkap,
    role = EXCLUDED.role;

-- ------------------------------------------------------------
-- 6. SEED SIMPANAN, KONSINYASI & PENCAIRAN
-- ------------------------------------------------------------
-- Simpanan Budi
INSERT INTO public.simpanan_ledger (anggota_id, jenis, nominal, keterangan, verified_by, created_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'pokok', 50000, 'Simpanan Pokok Pendaftaran Anggota', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '30 days'),
  ('a1111111-1111-1111-1111-111111111111', 'wajib', 10000, 'Simpanan Wajib Oktober 2026', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '20 days'),
  ('a1111111-1111-1111-1111-111111111111', 'wajib', 10000, 'Simpanan Wajib November 2026', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 days'),
  ('a1111111-1111-1111-1111-111111111111', 'sukarela', 150000, 'Tabungan Sukarela Tambahan', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days');

-- Konsinyasi Budi
INSERT INTO public.konsinyasi_nota (anggota_id, unit_usaha, nama_produk, harga_jual, qty_titip, qty_terjual, persen_komisi, komisi_kopma, hak_anggota, status)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Green Cafe — Kampus II Tamansari', 'Kue Brownies Panggang', 15000, 30, 22, 20.00, 66000, 264000, 'aktif'),
  ('a1111111-1111-1111-1111-111111111111', 'Toko Retail — Kampus II Tamansari', 'Keripik Tempe Renyah', 8000, 50, 45, 15.00, 54000, 306000, 'aktif');

-- Pencairan Request Budi (1 Pending)
INSERT INTO public.pencairan_requests (anggota_id, sumber_dana, nominal, metode_transfer, nomor_rekening, status, created_at)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'konsinyasi', 250000, 'Transfer Bank — BCA', '1234567890 (a.n Budi Santoso)', 'pending', NOW() - INTERVAL '1 day');
