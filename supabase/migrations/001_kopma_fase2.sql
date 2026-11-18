-- ============================================================
-- Kopma Unpas Fase 2 — Migration 001
-- Run via: supabase db push  OR  Supabase Dashboard → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 0. Helper: auto-update updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- 1. TABLES
-- ─────────────────────────────────────────────────────────────

-- 1a. profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nim            TEXT        UNIQUE,
  no_kta         TEXT        UNIQUE,
  nama_lengkap   TEXT        NOT NULL,
  fakultas_prodi TEXT,
  jabatan        TEXT,
  role           TEXT        NOT NULL DEFAULT 'anggota'
                             CHECK (role IN ('anggota', 'pengurus')),
  status_aktif   BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
  'Extended user profile linked to Supabase auth.users. One row per member.';

-- 1b. simpanan_ledger
CREATE TABLE IF NOT EXISTS public.simpanan_ledger (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jenis       TEXT        NOT NULL CHECK (jenis IN ('pokok', 'wajib', 'sukarela')),
  nominal     DECIMAL(15,2) NOT NULL CHECK (nominal > 0),
  keterangan  TEXT,
  verified_by UUID        REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.simpanan_ledger IS
  'Immutable ledger of simpanan transactions per anggota.';

-- 1c. konsinyasi_nota
CREATE TABLE IF NOT EXISTS public.konsinyasi_nota (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id    UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_usaha    TEXT          NOT NULL,
  nama_produk   TEXT          NOT NULL,
  harga_jual    DECIMAL(15,2) NOT NULL CHECK (harga_jual >= 0),
  qty_titip     INTEGER       NOT NULL CHECK (qty_titip > 0),
  qty_terjual   INTEGER       NOT NULL DEFAULT 0 CHECK (qty_terjual >= 0),
  persen_komisi DECIMAL(5,2)  NOT NULL DEFAULT 20
                              CHECK (persen_komisi BETWEEN 0 AND 100),
  komisi_kopma  DECIMAL(15,2) NOT NULL DEFAULT 0,
  hak_anggota   DECIMAL(15,2) NOT NULL DEFAULT 0,
  status        TEXT          NOT NULL DEFAULT 'aktif'
                              CHECK (status IN ('aktif', 'selesai')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.konsinyasi_nota IS
  'Consignment (titip jual) notes per anggota per product.';

-- 1d. pencairan_requests
CREATE TABLE IF NOT EXISTS public.pencairan_requests (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  anggota_id      UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sumber_dana     TEXT          NOT NULL
                                CHECK (sumber_dana IN ('konsinyasi', 'sukarela')),
  nominal         DECIMAL(15,2) NOT NULL CHECK (nominal > 0),
  metode_transfer TEXT          NOT NULL,
  nomor_rekening  TEXT          NOT NULL,
  status          TEXT          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'disetujui', 'ditolak')),
  reviewed_by     UUID          REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.pencairan_requests IS
  'Withdrawal (pencairan) requests submitted by anggota.';


-- ─────────────────────────────────────────────────────────────
-- 2. TRIGGERS — keep updated_at fresh
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE TRIGGER trg_konsinyasi_nota_updated_at
  BEFORE UPDATE ON public.konsinyasi_nota
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER trg_pencairan_requests_updated_at
  BEFORE UPDATE ON public.pencairan_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─────────────────────────────────────────────────────────────
-- 3. RPC FUNCTION
-- ─────────────────────────────────────────────────────────────

-- Used by the login page: anggota types NIM or No. KTA → we
-- look up the matching auth email so Supabase signInWithPassword
-- can be called with the real email.
CREATE OR REPLACE FUNCTION public.get_email_by_identifier(p_identifier TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_email   TEXT;
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

-- Allow any authenticated (or anon) caller to invoke the function
GRANT EXECUTE ON FUNCTION public.get_email_by_identifier(TEXT) TO anon, authenticated;


-- ─────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simpanan_ledger   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konsinyasi_nota   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pencairan_requests ENABLE ROW LEVEL SECURITY;

-- ── 4a. profiles ────────────────────────────────────────────

-- Any authenticated user can read their OWN profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Pengurus can read ALL profiles
CREATE POLICY "profiles_select_pengurus"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- A user can update only their own non-sensitive columns
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Pengurus can insert new profiles (e.g. registering a new member)
CREATE POLICY "profiles_insert_pengurus"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );


-- ── 4b. simpanan_ledger ──────────────────────────────────────

-- Anggota: read own rows
CREATE POLICY "simpanan_select_own"
  ON public.simpanan_ledger FOR SELECT
  TO authenticated
  USING (anggota_id = auth.uid());

-- Pengurus: full read
CREATE POLICY "simpanan_select_pengurus"
  ON public.simpanan_ledger FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- Pengurus: insert
CREATE POLICY "simpanan_insert_pengurus"
  ON public.simpanan_ledger FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- Pengurus: update (e.g. set verified_by)
CREATE POLICY "simpanan_update_pengurus"
  ON public.simpanan_ledger FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );


-- ── 4c. konsinyasi_nota ──────────────────────────────────────

-- Anggota: read own rows
CREATE POLICY "konsinyasi_select_own"
  ON public.konsinyasi_nota FOR SELECT
  TO authenticated
  USING (anggota_id = auth.uid());

-- Pengurus: full read
CREATE POLICY "konsinyasi_select_pengurus"
  ON public.konsinyasi_nota FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- Pengurus: insert
CREATE POLICY "konsinyasi_insert_pengurus"
  ON public.konsinyasi_nota FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- Pengurus: update
CREATE POLICY "konsinyasi_update_pengurus"
  ON public.konsinyasi_nota FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );


-- ── 4d. pencairan_requests ───────────────────────────────────

-- Anggota: read own rows
CREATE POLICY "pencairan_select_own"
  ON public.pencairan_requests FOR SELECT
  TO authenticated
  USING (anggota_id = auth.uid());

-- Anggota: insert own request
CREATE POLICY "pencairan_insert_own"
  ON public.pencairan_requests FOR INSERT
  TO authenticated
  WITH CHECK (anggota_id = auth.uid());

-- Pengurus: full read
CREATE POLICY "pencairan_select_pengurus"
  ON public.pencairan_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );

-- Pengurus: update (approve / reject)
CREATE POLICY "pencairan_update_pengurus"
  ON public.pencairan_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'pengurus'
    )
  );
