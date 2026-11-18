-- ============================================================
-- Kopma Unpas Fase 2 — Seed Data
-- ============================================================
--
-- ⚠️  IMPORTANT: This seed file uses placeholder UUIDs.
--     You MUST first create the matching auth users in Supabase
--     and then update the UUIDs here to match.
--
--     Steps:
--     1. Go to Supabase Dashboard → Authentication → Users
--     2. Click "Add user" → "Create new user" for each demo user:
--
--        Email                   Password    UUID to put below
--        ─────────────────────── ─────────── ──────────────────────────────────
--        anggota1@kopma-demo.id  root123     aaaaaaaa-0000-0000-0000-000000000001
--        anggota2@kopma-demo.id  root123     aaaaaaaa-0000-0000-0000-000000000002
--        pengurus1@kopma-demo.id root123     aaaaaaaa-0000-0000-0000-000000000003
--
--     3. After creating the users in the Dashboard, copy their
--        real UUIDs and replace the placeholder values below,
--        OR use the Supabase CLI approach below.
--
-- ── CLI approach (creates real auth users with known UUIDs) ──
--
--   supabase db execute --file - <<'EOF'
--   INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at,
--     raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
--   VALUES
--     ('aaaaaaaa-0000-0000-0000-000000000001',
--      'anggota1@kopma-demo.id',
--      crypt('root123', gen_salt('bf')),
--      NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
--     ('aaaaaaaa-0000-0000-0000-000000000002',
--      'anggota2@kopma-demo.id',
--      crypt('root123', gen_salt('bf')),
--      NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),
--     ('aaaaaaaa-0000-0000-0000-000000000003',
--      'pengurus1@kopma-demo.id',
--      crypt('root123', gen_salt('bf')),
--      NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW());
--   EOF
--
-- ─────────────────────────────────────────────────────────────

-- Placeholder UUIDs (replace if you created users via Dashboard
-- and they received different UUIDs)
DO $$
BEGIN
  -- These are only used as local references within this script.
  -- The actual values must match what is in auth.users.
END $$;

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────────────────────────

INSERT INTO public.profiles (id, nim, no_kta, nama_lengkap, fakultas_prodi, jabatan, role, status_aktif)
VALUES
  -- Anggota 1
  ('aaaaaaaa-0000-0000-0000-000000000001',
   '243040092', 'KTA-2026-001',
   'Budi Santoso',
   'Fakultas Ilmu Komputer / Informatika',
   NULL,
   'anggota', true),

  -- Anggota 2
  ('aaaaaaaa-0000-0000-0000-000000000002',
   '243040093', 'KTA-2026-002',
   'Siti Rahayu',
   'Fakultas Ekonomi / Manajemen',
   NULL,
   'anggota', true),

  -- Pengurus
  ('aaaaaaaa-0000-0000-0000-000000000003',
   '243040001', 'ADM-2026-001',
   'Ahmad Fauzan',
   'Fakultas Ilmu Komputer / Sistem Informasi',
   'Ketua Umum',
   'pengurus', true)

ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 2. SIMPANAN LEDGER
-- ─────────────────────────────────────────────────────────────

INSERT INTO public.simpanan_ledger (anggota_id, jenis, nominal, keterangan, verified_by, created_at)
VALUES
  -- Budi — simpanan pokok (satu kali di awal)
  ('aaaaaaaa-0000-0000-0000-000000000001', 'pokok',    50000.00,
   'Simpanan pokok pendaftaran anggota',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '6 months'),

  -- Budi — simpanan wajib (bulanan)
  ('aaaaaaaa-0000-0000-0000-000000000001', 'wajib',    10000.00,
   'Iuran wajib bulan Juni 2026',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '5 months'),

  ('aaaaaaaa-0000-0000-0000-000000000001', 'wajib',    10000.00,
   'Iuran wajib bulan Juli 2026',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '4 months'),

  ('aaaaaaaa-0000-0000-0000-000000000001', 'wajib',    10000.00,
   'Iuran wajib bulan Agustus 2026',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '3 months'),

  -- Budi — simpanan sukarela
  ('aaaaaaaa-0000-0000-0000-000000000001', 'sukarela', 75000.00,
   'Tabungan sukarela',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '2 months'),

  ('aaaaaaaa-0000-0000-0000-000000000001', 'sukarela', 25000.00,
   'Tabungan sukarela tambahan',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '1 month'),

  -- Siti — simpanan pokok
  ('aaaaaaaa-0000-0000-0000-000000000002', 'pokok',    50000.00,
   'Simpanan pokok pendaftaran anggota',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '5 months'),

  -- Siti — simpanan wajib
  ('aaaaaaaa-0000-0000-0000-000000000002', 'wajib',    10000.00,
   'Iuran wajib bulan Juli 2026',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '4 months'),

  ('aaaaaaaa-0000-0000-0000-000000000002', 'wajib',    10000.00,
   'Iuran wajib bulan Agustus 2026',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '3 months'),

  -- Siti — simpanan sukarela
  ('aaaaaaaa-0000-0000-0000-000000000002', 'sukarela', 100000.00,
   'Tabungan sukarela',
   'aaaaaaaa-0000-0000-0000-000000000003',
   NOW() - INTERVAL '2 months')

ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 3. KONSINYASI NOTA
-- ─────────────────────────────────────────────────────────────
-- komisi_kopma  = harga_jual * qty_terjual * (persen_komisi / 100)
-- hak_anggota   = harga_jual * qty_terjual - komisi_kopma

INSERT INTO public.konsinyasi_nota
  (anggota_id, unit_usaha, nama_produk, harga_jual,
   qty_titip, qty_terjual, persen_komisi, komisi_kopma, hak_anggota, status)
VALUES
  -- Budi: produk aktif
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'Koperasi Mahasiswa', 'Keripik Tempe Pedas', 8000.00,
   30, 18, 20.00,
   8000 * 18 * 0.20,          -- 28800
   8000 * 18 * 0.80,          -- 115200
   'aktif'),

  -- Budi: produk selesai
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'Koperasi Mahasiswa', 'Brownies Coklat', 15000.00,
   20, 20, 20.00,
   15000 * 20 * 0.20,         -- 60000
   15000 * 20 * 0.80,         -- 240000
   'selesai'),

  -- Siti: produk aktif
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'Unit Usaha Kreatif', 'Totebag Batik Unpas', 45000.00,
   15, 7, 20.00,
   45000 * 7 * 0.20,          -- 63000
   45000 * 7 * 0.80,          -- 252000
   'aktif'),

  -- Siti: produk aktif, komisi berbeda
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'Unit Usaha Kreatif', 'Pin Karakter', 5000.00,
   50, 30, 15.00,
   5000 * 30 * 0.15,          -- 22500
   5000 * 30 * 0.85,          -- 127500
   'aktif')

ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────
-- 4. PENCAIRAN REQUESTS
-- ─────────────────────────────────────────────────────────────

INSERT INTO public.pencairan_requests
  (anggota_id, sumber_dana, nominal, metode_transfer, nomor_rekening,
   status, reviewed_by)
VALUES
  -- Budi: disetujui
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'konsinyasi', 100000.00, 'BCA', '1234567890',
   'disetujui', 'aaaaaaaa-0000-0000-0000-000000000003'),

  -- Budi: pending
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'sukarela', 50000.00, 'BCA', '1234567890',
   'pending', NULL),

  -- Siti: pending
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'konsinyasi', 200000.00, 'Mandiri', '0987654321',
   'pending', NULL),

  -- Siti: ditolak
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'sukarela', 500000.00, 'Mandiri', '0987654321',
   'ditolak', 'aaaaaaaa-0000-0000-0000-000000000003')

ON CONFLICT DO NOTHING;
