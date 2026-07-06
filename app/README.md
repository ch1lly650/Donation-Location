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
- Email/password auth via signed JWT session cookies (`jose` + `bcryptjs`)

## Run it locally

```bash
npm install
npm run setup   # generates the Prisma client, creates the SQLite db, seeds 20 charities + ads
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The seed data is idempotent — re-run `npm run db:seed` any time to reset
charities/items/ads back to their initial state (it does not touch
signed-up user accounts... actually it does clear users too, see
`prisma/seed.ts` if you want to change that).

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
2. **Push the schema and seed data to it**, from your machine, once:
   ```bash
   DATABASE_URL="libsql://<your-db>.turso.io" TURSO_AUTH_TOKEN="<your-token>" npx prisma db push
   DATABASE_URL="libsql://<your-db>.turso.io" TURSO_AUTH_TOKEN="<your-token>" npx tsx prisma/seed.ts
   ```
   (On Windows PowerShell, set each with `$env:DATABASE_URL = "..."` on its own line first.)
3. **In your Vercel project settings → Environment Variables**, set:
   - `DATABASE_URL` = the `libsql://...` URL from step 1
   - `TURSO_AUTH_TOKEN` = the token from step 1
   - `AUTH_SECRET` = a fresh random secret (**do not reuse** the one committed
     in `.env` — that one is fine for local/demo use only). Generate one with
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
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

- `app/` — routes: `/`, `/search`, `/charity/[slug]`, `/auth`, and the
  `api/*` route handlers (charity search, ads, auth, pledges)
- `components/` — shared UI (nav, ad banner, footer) and per-screen client
  components
- `lib/` — Prisma client singleton, auth/session helpers, geo distance
  calculation, and search/ads query logic
- `prisma/schema.prisma` — data model (Charity, WishlistItem, Ad, User, Pledge)
- `prisma/seed.ts` — 20 realistic charities (incl. the flagship "Helping
  Others Prosper Everywhere") with wishlist items and ad slots

## Notable implementation notes

- Search (`/search`) filters (text query, distance radius, cause,
  verified-only) are backed by a real API route (`/api/charities`) and
  filter instantly as you type/toggle, with the URL kept in sync with
  filter state.
- The charity profile's wishlist search/category/condition filters run
  client-side against the already-fetched item list for instant results,
  and also sync to the URL (`?items_q=&category=&condition=`).
- Donate / Pledge actions are auth-gated: logged-out users are routed to
  `/auth?tab=signup`; logged-in users can pledge an item (persisted per
  user) — money donation checkout is intentionally out of scope per the
  design handoff.
- Ad banner + inline promoted slot are pulled from the `Ad` table
  (`lib/ads.ts`), picked randomly in SQL (`ORDER BY RANDOM()`) rather than
  in JS, to keep render functions pure.
