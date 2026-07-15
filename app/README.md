# Donation Location

A charity discovery platform: search verified nonprofits by distance/cause,
browse charity profiles and their item wishlists, pledge items, and create
an account. Built from the design handoff in
[`design_handoff_donation_location/`](../design_handoff_donation_location).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Prisma 7** with the `@prisma/adapter-libsql` driver adapter — SQLite
  dialect throughout. Locally this points at a plain `file:./dev.db` (zero
  external services); in production it points at a hosted [Turso](https://turso.tech)
  database using the exact same schema and adapter — see "Deploying to
  Vercel" below.
- Email/password auth via [Supabase Auth](https://supabase.com/auth) (both
  donor accounts and charity accounts — see `lib/supabase/`). App data
  (charities, wishlist items, ads, pledges) stays in the Prisma/libsql
  database above; Supabase is used only for authentication. A `role`
  (`"donor"` | `"charity"`) is stored in each Supabase user's metadata, and
  a local `User`/`CharityAccount` row (keyed by `supabaseUserId`) holds the
  app-specific profile fields and FK relations (e.g. `Pledge.userId`).

## Run it locally

```bash
npm install
npm run setup   # generates the Prisma client, creates the SQLite db, seeds ad banner content
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

**Auth requires a Supabase project** (free tier is fine). Create one at
[supabase.com](https://supabase.com), then add a `.env.local` (gitignored —
never commit real credentials) with, from your project's
**Settings → API**:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon/public key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role key -- keep this one secret>"
```
The service role key is used server-side only (`lib/supabase/admin.ts`) to
create pre-confirmed users at signup, so there's no email-delivery step to
configure for this to work end to end.

There's no example/seed charity data — the database starts empty, and
charities create their own profiles via `/for-nonprofits`. `prisma/seed.ts`
only manages the `Ad` table (the sponsored banner + inline promoted
content) and is safe to re-run any time (`npm run db:seed`) — it never
touches `Charity`, `WishlistItem`, `Pledge`, or `User`, so it won't clobber
real signups.

## Deploying to Vercel

The app can't use the local `dev.db` SQLite file in production — Vercel's
serverless functions have an ephemeral, largely read-only filesystem, so
writes to a local file wouldn't persist between requests. Instead, point
the same Prisma schema/adapter at a hosted [Turso](https://turso.tech)
database (Turso is SQLite-compatible over the network, so no schema
changes are needed — just a different connection URL).

1. **Create a Turso database.** Sign up at [turso.tech](https://turso.tech),
   create a database, and copy its connection URL (`libsql://<name>-<org>.turso.io`)
   and an auth token from the dashboard.
2. **Push the schema and seed data to it**, from your machine, once. Note:
   `prisma db push` / `migrate dev` can't talk to `libsql://` URLs directly
   (their schema-diffing engine only understands `file:` for the sqlite
   provider — you'll get a `P1013` error), so use the `db:push:remote`
   script instead, which generates the full schema SQL and applies it
   straight over the libsql client:
   ```bash
   DATABASE_URL="libsql://<your-db>.turso.io" TURSO_AUTH_TOKEN="<your-token>" npm run db:push:remote
   DATABASE_URL="libsql://<your-db>.turso.io" TURSO_AUTH_TOKEN="<your-token>" npx tsx prisma/seed.ts
   ```
   (On Windows PowerShell, set each with `$env:DATABASE_URL = "..."` on its
   own line first, then run the commands without the `VAR=value` prefix.)
   This script is meant for first-time setup — it assumes the remote
   database is empty. If you later change `prisma/schema.prisma` and the
   remote already has data you want to keep, you'll need to write the
   incremental `ALTER TABLE`/`CREATE TABLE` SQL by hand and apply it the
   same way (Prisma can't introspect a live `libsql://` database to diff
   against automatically).
3. **In your Vercel project settings → Environment Variables**, set:
   - `DATABASE_URL` = the `libsql://...` URL from step 1
   - `TURSO_AUTH_TOKEN` = the token from step 1
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
     `SUPABASE_SERVICE_ROLE_KEY` = the same three values from your
     `.env.local` (see "Run it locally" above) — same Supabase project as
     local, or a separate one for production if you'd rather keep prod
     users isolated from local testing.
4. **Deploy** — either connect the GitHub repo in the Vercel dashboard, or
   run `npx vercel --prod` from the `app/` directory. The root directory
   for the Vercel project must be `app/` (this repo also contains the
   design handoff at the repo root, which isn't part of the deployable app).
   `npm run build` / `postinstall` already run `prisma generate`, so no
   extra build configuration is needed.

If you skip step 3, the app will silently fall back to `file:./dev.db` in
production, which will not work — you'll see empty search results / auth
failures because each cold start gets a fresh, empty, throwaway database.

## Project layout

- `app/` — routes: `/`, `/search`, `/charity/[slug]`, `/auth` (donor),
  `/for-nonprofits` (charity), `/charity/dashboard` (charity profile/wishlist
  editing), and the `api/*` route handlers
- `components/` — shared UI (nav, ad banner, footer) and per-screen client
  components
- `lib/` — Prisma client singleton, geo distance calculation, search/ads
  query logic, and `lib/supabase/` (`server.ts` for Server
  Components/Route Handlers, `admin.ts` for the service-role client used at
  signup); `lib/auth.ts`/`lib/charityAuth.ts` wrap Supabase's session with a
  lookup against the local `User`/`CharityAccount` row
- `proxy.ts` (project root) — refreshes the Supabase session token on every
  request (Next.js 16 renamed `middleware.ts` to `proxy.ts`)
- `prisma/schema.prisma` — data model (Charity, WishlistItem, Ad, User,
  CharityAccount, Pledge). `User`/`CharityAccount` don't store passwords —
  just a `supabaseUserId` linking to the Supabase Auth user
- `prisma/seed.ts` — seeds the ad banner/promoted content only; no example
  charities (charities create their own via `/for-nonprofits`)

## Notable implementation notes

- Search (`/search`) filters (text query, distance radius, cause,
  verified-only) are backed by a real API route (`/api/charities`) and
  filter instantly as you type/toggle, with the URL kept in sync with
  filter state. Defaults show *all* causes and both verified/unverified
  charities (unlike the original design mock, which defaulted to "Community
  aid" only + verified-only) — now that real self-registered charities
  start unverified with no admin review step, hiding them by default would
  make them invisible.
- Charity addresses are geocoded via [Nominatim](https://nominatim.org)
  (OpenStreetMap, free, no API key) at signup and whenever the address is
  edited (`lib/geocode.ts`), with a fallback chain (full address → city +
  state + zip → city + state) since informal/placeholder street text often
  fails to resolve. If geocoding fails outright, the charity falls back to
  the San Jose, CA default coordinates rather than blocking signup.
- The search page's location (used for the distance filter and "within N
  miles of ___" label) is user-changeable — click "Change" next to the
  location text to type a city/ZIP/address (geocoded via `/api/geocode`)
  or use "Near me" for browser geolocation. It persists in the URL
  (`?lat=&lng=&loc=`) across reloads. The homepage's "Featured near you"
  is not user-location-aware — it always shows the charities closest to
  San Jose, CA.
- The charity profile's wishlist search/category/condition filters run
  client-side against the already-fetched item list for instant results,
  and also sync to the URL (`?items_q=&category=&condition=`).
- Charities get their own signup/login (`/for-nonprofits`, separate from
  donor accounts) and a dashboard (`/charity/dashboard`) to edit their
  profile and manage wishlist items. Ownership is enforced server-side (not
  just authentication) — a charity can only ever edit its own items.
- Since Supabase Auth is one global session per browser, a donor and a
  charity account can no longer be logged in at the same time in the same
  browser (logging into one signs the other out) — a real behavior change
  from an earlier iteration of this app that used two independent cookies.
  Signing up/logging in with the wrong account type (e.g. a charity email
  on the donor login) is rejected and signs out the mismatched session.
- Donate / Pledge actions are auth-gated: logged-out users are routed to
  `/auth?tab=signup`; logged-in users can pledge an item (persisted per
  user) — money donation checkout is intentionally out of scope per the
  design handoff.
- Ad banner + inline promoted slot are pulled from the `Ad` table
  (`lib/ads.ts`), picked randomly in SQL (`ORDER BY RANDOM()`) rather than
  in JS, to keep render functions pure.
