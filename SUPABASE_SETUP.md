# Supabase Setup — Kopma Unpas Fase 2

This guide walks you through creating the Supabase project, running the database migration, seeding demo data, and testing the login flow.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **"New project"**.
3. Choose your organisation, give the project a name (e.g. `kopma-unpas`), set a strong database password, and pick the region closest to you.
4. Wait ~2 minutes for the project to be provisioned.

---

## 2. Set Environment Variables

In the Supabase Dashboard open **Project Settings → API**.

Copy the two values:

| Dashboard label | `.env.local` key |
|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

Create (or update) `c:\Users\HYPE AMD\Downloads\Kopma-unpas\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> [!IMPORTANT]
> Never commit `.env.local` to version control. It is already listed in `.gitignore` by the Next.js template.

---

## 3. Run the Migration

### Option A — Supabase Dashboard (SQL Editor)

1. In the Dashboard open **SQL Editor**.
2. Click **"New query"**.
3. Open the migration file locally:
   `supabase/migrations/001_kopma_fase2.sql`
4. Paste the entire contents into the editor.
5. Click **"Run"** (▶).

### Option B — Supabase CLI

```bash
# Install CLI (once)
npm install -g supabase

# Log in
supabase login

# Link to your project (get <project-ref> from Dashboard → Settings → General)
supabase link --project-ref <project-ref>

# Push the migration
supabase db push
```

---

## 4. Create Auth Users

The auth users **must** be created before running the seed, because `profiles` has a foreign-key constraint on `auth.users(id)`.

### Option A — Supabase Dashboard (recommended for beginners)

1. In the Dashboard go to **Authentication → Users**.
2. Click **"Add user"** → **"Create new user"** for each of the three demo accounts:

   | Email | Password | Role |
   |---|---|---|
   | `anggota1@kopma-demo.id` | `root123` | anggota |
   | `anggota2@kopma-demo.id` | `root123` | anggota |
   | `pengurus1@kopma-demo.id` | `root123` | pengurus |

3. After creating each user, click on their row to view their **UUID**.
4. Open `supabase/seed.sql` and replace the three placeholder UUIDs:
   - `aaaaaaaa-0000-0000-0000-000000000001` → UUID of `anggota1@kopma-demo.id`
   - `aaaaaaaa-0000-0000-0000-000000000002` → UUID of `anggota2@kopma-demo.id`
   - `aaaaaaaa-0000-0000-0000-000000000003` → UUID of `pengurus1@kopma-demo.id`

> [!TIP]
> You can do a **Find & Replace** in VS Code across the seed file to swap all occurrences of each placeholder at once.

### Option B — Supabase CLI (keeps the seed UUIDs as-is)

Run the following in the SQL Editor or via `supabase db execute`:

```sql
INSERT INTO auth.users
  (id, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'anggota1@kopma-demo.id',
   crypt('root123', gen_salt('bf')),
   NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),

  ('aaaaaaaa-0000-0000-0000-000000000002',
   'anggota2@kopma-demo.id',
   crypt('root123', gen_salt('bf')),
   NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW()),

  ('aaaaaaaa-0000-0000-0000-000000000003',
   'pengurus1@kopma-demo.id',
   crypt('root123', gen_salt('bf')),
   NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW());
```

This inserts users with the **exact** placeholder UUIDs used in `seed.sql`, so no UUID substitution is needed.

---

## 5. Run the Seed

### Option A — Supabase Dashboard

1. Open **SQL Editor → New query**.
2. Paste the contents of `supabase/seed.sql`.
3. Click **"Run"**.

### Option B — Supabase CLI

```bash
supabase db execute --file supabase/seed.sql
```

> [!NOTE]
> All seed inserts use `ON CONFLICT DO NOTHING`, so running the seed multiple times is safe.

---

## 6. Test the Login Flow

Start the dev server:

```bash
pnpm dev
# or
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Demo credentials

| Login identifier | Password | Expected role |
|---|---|---|
| `243040092` (NIM) | `root123` | anggota — Budi Santoso |
| `KTA-2026-002` (No. KTA) | `root123` | anggota — Siti Rahayu |
| `243040001` (NIM) | `root123` | pengurus — Ahmad Fauzan |
| `ADM-2026-001` (No. KTA) | `root123` | pengurus — Ahmad Fauzan |

**How the login works:**

1. The login page calls the RPC `get_email_by_identifier(identifier)`.
2. The function looks up the NIM or No. KTA in `public.profiles` and returns the linked auth email.
3. The app then calls `supabase.auth.signInWithPassword({ email, password })`.
4. On success the user is redirected to `/anggota` (anggota) or `/pengurus` (pengurus) based on `profile.role`.

### Quick check via Supabase Dashboard

After seeding, verify data in **Table Editor**:

```sql
-- Should return 3 rows
SELECT * FROM public.profiles;

-- Should return 10 rows
SELECT * FROM public.simpanan_ledger;

-- Should return 4 rows
SELECT * FROM public.konsinyasi_nota;

-- Should return 4 rows
SELECT * FROM public.pencairan_requests;

-- Test the RPC
SELECT public.get_email_by_identifier('243040092');   -- → anggota1@kopma-demo.id
SELECT public.get_email_by_identifier('ADM-2026-001'); -- → pengurus1@kopma-demo.id
```

---

## File Reference

| File | Purpose |
|---|---|
| `supabase/migrations/001_kopma_fase2.sql` | Creates all tables, triggers, RPC, and RLS policies |
| `supabase/seed.sql` | Inserts demo profiles and sample transaction data |
| `.env.local` | Supabase URL & anon key (not committed to git) |
