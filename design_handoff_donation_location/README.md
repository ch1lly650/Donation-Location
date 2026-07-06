# Handoff: Donation Location — Charity Donation Website Frontend

## Overview
Donation Location is a charity discovery platform for everyday individual donors. Users search verified nonprofits near them (example flagship charity: **Helping Others Prosper Everywhere**, "HOPE"), filter by distance/cause/verification, create an account, and donate. The site also carries sponsored ad/promotion slots.

This handoff covers four screens in one linked prototype: **Home**, **Search Results**, **Charity Profile**, and **Sign up / Log in**.

Beyond money donations, charities also accept **item donations** (a wishlist): each accepted item has a name, a category, and a condition requirement — e.g. `Socks | Clothing | New or used`. Donors browse this wishlist on the charity's profile and "pledge" items.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, NOT production code to copy directly. Your task is to **recreate these designs in your chosen stack** (e.g. React/Next.js + a real backend) using established patterns and libraries. No environment exists yet, so choose the most appropriate framework and implement the designs there.

`Donation Location App.dc.html` is the combined interactive prototype (the source of truth). `Donation Location.dc.html` contains earlier design explorations (six option cards) — reference only.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final intent. Recreate pixel-perfectly. Grey striped SVG blocks are **image placeholders** (charity cover photos, logos) — replace with real uploaded charity imagery served from the backend.

## Screens / Views

### 1. Home
- **Purpose**: Entry point; search for charities, browse categories, see featured charities nearby.
- **Layout** (top to bottom):
  1. **Sponsored ad banner** — full-width, bg `oklch(0.35 0.09 255)` (deep blue), white 13.5px text, centered, with a "SPONSORED" pill (10px/700, white 18% alpha bg, radius 4px). This is a monetization slot — should be backend-driven (ad content, link, dismissible optional).
  2. **Nav bar** — white bg, bottom border `#e6ebf2`, padding 16px 40px. Left: logo (34px rounded-10px blue square with "DL" + wordmark "DonationLocation", Nunito 800 18px, "Location" in brand blue). Center links: Browse charities, Causes, How it works, For nonprofits (14.5px/600, `#44526a`). Right: "Log in" text button + "Create account" pill button (brand blue bg, white text, radius 999px, padding 10px 18px).
  3. **Hero** — centered, padding 64px 40px 48px, bg gradient `linear-gradient(180deg, oklch(0.97 0.012 250), #fbfcfe)`. H1: Nunito 900 44px `#152238`, two lines: "Find a charity close to your heart — and close to home." Subhead 18px `#5a6a84`.
  4. **Search bar** — max-width 720px, pill (radius 999px), 2px brand-blue border, shadow `0 8px 28px rgba(30,70,140,.12)`. Three zones: text input (placeholder "Search charities, causes, or keywords…"), divider, "Near me" geolocation affordance with pin icon, and a solid blue "Search" submit (700 16px, padding 16px 30px). Enter key or Search click navigates to Search Results carrying the query.
  5. **Category chips** — wrap row, gap 10px: Hunger relief, Education, Housing, Health, Environment, Animals. White bg, 1px `#dbe3ee` border, radius 999px, 13.5px/600 `#44526a`. Hover: blue border + blue text. Click → search filtered by category.
  6. **Featured near you** — H2 Nunito 800 22px + "See all →" link (brand blue 700 14px). 3-column grid, gap 20px. Card: 1px `#e6ebf2` border, radius 14px, cover image 120px tall, then padding 16px 18px: name (Nunito 800 16px) + green "VERIFIED" badge (10px/700 `#1e7f4f` on `#e3f5ec`, radius 4px), meta line 13px `#5a6a84` (cause · distance · city), full-width blue "Donate" button (radius 8px). Hover: shadow `0 6px 20px rgba(30,70,140,.1)`.
  7. **Footer** — bg `#152238`, text `#a8b6cc` 13px, padding 20px 40px. Left: © 2026 Donation Location. Right links: About, Trust & safety, Advertise with us, Contact.

### 2. Search Results
- **Purpose**: Filter and browse charities near a location; donate or sign up.
- **Layout**: Ad banner + nav persist. Body: 2-col grid `250px 1fr`, gap 24px, padding 24px 32px 36px, bg `#f7f9fc`.
- **Filter rail** (left, white card, radius 14px, padding 20px, sticky-friendly):
  - Header: "Filters" (Nunito 800 15px) + "Clear all" (brand blue 700 12.5px) which resets all filters.
  - **DISTANCE** — section labels are 12px/700, letter-spacing .06em, `#8fa2bd`, uppercase. Range slider 1–50 mi (default 10), brand-blue accent; live label shows current value.
  - **CAUSE** — checkbox list: Community aid (default checked), Hunger relief, Education, Housing, Health. Checked = 16px radius-4 blue square with white ✓; unchecked = 1.5px `#c6d1e0` border.
  - **VERIFICATION** — "Verified only" checkbox, default checked.
  - "Apply filters" full-width blue button. (In the prototype filtering is live/instant; live filtering is the preferred production behavior too.)
- **Results column**:
  - Search input (pill, white, magnifier icon) pre-filled with query + location indicator "San Jose, CA" with pin.
  - Result count line: "**N charities** within {radius} miles of San Jose, CA" + sort dropdown ("Sort: Closest first ▾").
  - **Result card**: white, 1px `#e6ebf2`, radius 14px, padding 18px, flex row: 150×110 image, then name (Nunito 800 17px) + VERIFIED badge + optional amber "TOP MATCH" badge (`#8a5a00` on `#fdf1dc`), meta line (cause · ★ rating (reviews) · 501(c)(3)), 14px description; right column: distance (13px/700) + "Donate" button.
  - **Inline promoted slot** after the results: bg `oklch(0.96 0.015 65)` (warm cream), 1px dashed `oklch(0.8 0.06 65)` border, radius 14px, "PROMOTED" pill + one line of copy. Backend-driven ad slot.

### 3. Charity Profile (social-media style)
- **Purpose**: A charity's public page — identity, mission, contact info, and the searchable/filterable list of item donations it accepts. Reached by clicking a charity name anywhere (featured cards, search results).
- **Layout**: Ad banner + nav persist. Then:
  1. **Cover photo** — full-width, 220px tall (placeholder in prototype; charity-uploaded in production).
  2. **Avatar** — 112px, radius 24px, 5px white border, overlapping cover bottom-left (left 40px, bottom −44px), shadow `0 8px 24px rgba(20,45,90,.18)`. Prototype uses a brand-blue tile with initial; production uses charity logo.
  3. **Header row** — white bg, bottom border. Name (Nunito 900 26px) + "VERIFIED" green badge + "501(c)(3)" blue badge (10px/700 `#1c3557` on `oklch(0.93 0.03 250)`). Below: pin icon + street address + distance ("1284 Willow Street, San Jose, CA 95112 · 2.3 mi from you", 14px `#5a6a84`). Stats row 13.5px: ★ rating (reviews) · supporters count · founding year. Right-aligned actions: "♡ Follow" outline pill + "Donate" solid blue pill.
  4. **Body** — 2-col grid `340px 1fr`, gap 24px, padding 24px 40px 44px, bg `#f7f9fc`.
- **Left sidebar** (stacked white cards, radius 14px, padding 22px):
  - **Our mission** — card title Nunito 800 15px; bio paragraph 14.5px `#44526a`, line-height 1.6. Charity-editable free text (what they do, who they serve).
  - **Contact** — labeled rows (PHONE / EMAIL / WEB / HOURS; labels 12.5px/700 `#8fa2bd`, 56px wide). Email + web render as brand-blue links.
  - **Drop-off location** — small map (placeholder in prototype).
- **Items list** (right column):
  - Header: "Donations we're accepting" (Nunito 800 20px) + live item count.
  - **Search + filter bar** (white card): pill search input ("Search items (e.g. socks)…") that matches name/category/notes; then two chip groups labeled CATEGORY (All, Clothing, Food, Hygiene, School supplies, Household) and CONDITION (All, New only, New or used), separated by a vertical divider. Active chip: `#152238` bg, white text; inactive: white bg, `#dbe3ee` border, `#44526a` text. All filters + search intersect and apply instantly.
  - **Item row** (white, radius 12px, padding 14px 18px, flex row, gap 14px): 44px icon tile (`oklch(0.93 0.02 250)` bg — emoji in prototype, item image in production), name (Nunito 800 15.5px) with a 12.5px muted note under it (e.g. "All sizes — kids and adult"), then pills: category (blue tint `#1c3557` on `oklch(0.93 0.03 250)`), condition ("New or used" = green `#1e7f4f` on `#e3f5ec`; "New only" = rose `#8a4a5e` on `#faeaef`), optional "HIGH NEED" amber pill (`#8a5a00` on `#fdf1dc`), and an outline "Pledge" button (fills blue on hover). Row hover: soft blue shadow.
  - **Empty state**: dashed-border card, "No items match — try clearing the filters."

### 4. Sign up / Log in
- **Purpose**: Account creation and login in one card with tabs.
- **Layout**: Ad banner + nav persist. Body: full-height centered on gradient `linear-gradient(160deg, oklch(0.96 0.015 250), oklch(0.9 0.035 250))`.
- **Card**: 400px wide, white, radius 18px, shadow `0 20px 50px rgba(20,45,90,.15)`, padding 32px. Top: 44px round blue circle with heart glyph + "Welcome to Donation Location" (Nunito 800 18px).
- **Tab switch**: 2-col segmented control on `#f2f5f9`, radius 10px, 4px padding. Active tab: white bg, radius 8px, shadow `0 1px 4px rgba(0,0,0,.08)`, `#152238`; inactive: transparent, `#8fa2bd`.
- **Create account tab**: inputs — Full name, Email address, Password, ZIP code ("for charities near you" — powers the near-me defaults). Inputs: 1.5px `#dbe3ee` border, radius 9px, padding 12px 14px, 14.5px; focus → brand blue border. Checkbox "Email me about charities near me" (default checked). Primary CTA: "Get started — it's free" (Nunito 800 15px, blue, radius 9px). Secondary: "Continue with Google" (white, 1.5px border).
- **Log in tab**: Email, Password, "Forgot password?" link, "Log in" CTA, "Continue with Google".

## Interactions & Behavior
- Logo click → Home. "Browse charities", category chips, hero Search, Enter in search input, "See all →", featured Donate → Search Results.
- Charity name click (featured card or search result) → Charity Profile. Profile "Donate" and item "Pledge" → auth (production: donation/pledge flow, auth-gated).
- Profile item list: search + category chip + condition chip filter instantly; item count updates; empty state when nothing matches.
- "Log in" → auth screen with Log in tab active; "Create account" / result-card "Donate" (when logged out) → auth screen with Create account tab active.
- Auth submit → return Home (prototype); production: create session, return to previous context.
- Filters apply instantly: distance slider, cause checkboxes (multi-select; empty = all), verified toggle, and text query all intersect.
- Current screen persists across reload (prototype uses localStorage; production uses routes — suggested: `/`, `/search?q=&radius=&causes=&verified=`, `/auth?tab=signup|login`).
- Hovers: buttons darken to `oklch(0.5 0.15 250)`; cards gain soft blue shadow; nav links turn blue.

## State Management
- `screen` (route), `authTab`, `query`, `radius` (1–50, default 10), `selectedCauses` (string[], default ["Community aid"]), `verifiedOnly` (bool, default true), `emailOptIn` (bool, default true).
- Profile: `itemQuery` (string), `itemCategory` (default "All"), `itemCondition` (default "All").
- Data fetching needed: charity search (query + geo radius + cause + verified), featured-near-you list, ad/promotion slots (top banner + inline promoted card), auth (email/password + Google OAuth).

## Design Tokens
- **Brand blue**: `oklch(0.55 0.15 250)` (≈ #3b7ad9); hover `oklch(0.5 0.15 250)`; deep navy `oklch(0.35 0.09 255)`; ink `#152238`; body text `#44526a`; muted `#5a6a84`; faint `#8fa2bd`.
- **Surfaces**: page `#fbfcfe` / `#f7f9fc`; borders `#e6ebf2`, `#dbe3ee`; input inactive border `#c6d1e0`; light blue tint `oklch(0.93 0.03 250)`.
- **Semantic**: verified green `#1e7f4f` on `#e3f5ec`; promoted amber `#8a5a00` on `#fdf1dc` / cream `oklch(0.96 0.015 65)`.
- **Type**: Nunito (800/900) for headings, logo, card titles, primary CTAs; Source Sans 3 (400/600/700) for everything else. Scale: 44 (H1), 22 (H2), 17–18 (card titles/subhead), 14–14.5 (body/UI), 13–13.5 (meta), 12–12.5 (labels), 10 (badges).
- **Radius**: 999px pills (search, chips, nav CTA), 14px cards, 18px auth card, 8–10px buttons/inputs/segmented control.
- **Shadows**: search `0 8px 28px rgba(30,70,140,.12)`; card hover `0 6px 20px rgba(30,70,140,.1)`; auth card `0 20px 50px rgba(20,45,90,.15)`.

## Assets
No external assets. Logo is typeset ("DL" mark + wordmark). All grey striped blocks are placeholders for real charity photos/logos/map imagery to be served by the backend. Google Fonts: Nunito, Source Sans 3.

## Files
- `Donation Location App.dc.html` — combined interactive prototype (Home + Search Results + Auth). Open in a browser.
- `Donation Location.dc.html` — earlier design explorations (options 1a–1f), reference only.

## Suggested Backend Scope (from the design)
- Charity model: name, cause category, description, lat/lng, city, verified flag, rating, review count, 501(c)(3) status, cover image, logo.
- Charity profile fields: cover image, logo, street address, phone, email, website, hours, mission bio, supporters count, founding year.
- WishlistItem model: charity id, name, icon/image, category (Clothing | Food | Hygiene | School supplies | Household), condition ("New only" | "New or used"), note, highNeed flag.
- Endpoints: charity search (text + geo + filters), featured list, charity profile by slug, wishlist items (searchable/filterable), item pledge (auth-gated), ad slots, auth (email/password + OAuth), donation checkout (not yet designed — future screen).
- Suggested routes: `/charity/[slug]` for profiles with `?items_q=&category=&condition=` for the wishlist filters.
