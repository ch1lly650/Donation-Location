# Donation Location

A charity discovery platform: search verified nonprofits by distance/cause,
browse charity profiles and their item wishlists, pledge items, and create
an account. Built from the design handoff in
[`design_handoff_donation_location/`](../design_handoff_donation_location).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Prisma 7** with the `better-sqlite3` driver adapter — a local SQLite
  file, zero external services required
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
