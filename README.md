# AgriHub Liberia

**Digital Agricultural Intelligence Platform**
Built by [Tech 231 Liberia Limited](https://tech231liberia.com) · Commissioned by the Ministry of Commerce & Industry, Republic of Liberia

---

## Overview

AgriHub Liberia is a full-stack digital agricultural intelligence platform empowering rural Liberian farmers — particularly women — with real-time market prices, county-specific weather forecasts, expert agronomy guidance, and a peer-to-peer marketplace connecting farmers directly to buyers. No middlemen. Better prices.

The platform is designed for Liberia's infrastructure realities: low-bandwidth mobile browsers, WhatsApp-first communication, MTN MoMo / Orange Money payments, and USSD offline access via `*347#` on any Liberian phone.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| Auth | localStorage-based mock sessions (Phase 1) |

---

## Features

### Authentication
- **5-Step Registration Wizard** — Personal info, Farm details, Account type, Mobile money setup, Preferences
- **Login Page** — Split layout, email/phone detection, role-based redirect, remember me
- Roles: `farmer`, `buyer`, `extension-officer`, `admin`, `supplier`
- All sessions stored in `localStorage` — no backend required for Phase 1

### Farmer Dashboard (`/dashboard`)
- Time-based greeting with county badge
- My Farm summary card (name, size, crops)
- Price Watch filtered to farmer's registered crops
- County-specific weather widget
- Recent activity feed
- Quick access tiles: Market / Weather / Tips / Marketplace

### Market Prices (`/market`)
- Filter by crop, county, date range, category
- Sortable price table with LRD / USD, 7-day change, sparkline trends
- 30-day rolling price trend chart (Recharts LineChart)
- Top Gainers / Top Losers widget
- Liberia county SVG map color-coded by price level
- Export CSV

### Weather (`/weather`)
- County selector (all 15 Liberian counties)
- Current conditions: temp, humidity, wind, UV index, rain chance
- 7-day forecast strip
- 24-hour hourly chart (Recharts AreaChart)
- Agricultural alerts: planting windows, harvest conditions, risk warnings
- 30-day historical rainfall bar chart

### Agronomy Tips (`/tips`, `/tips/[slug]`)
- Category grid: Rice, Cassava, Vegetables, Soil Health, Pest Control, Post-Harvest
- Featured tip hero card
- Tip detail page: hero image, step-by-step guide, audio player (EN / Kpelle / Bassa), related tips, save & share

### Marketplace (`/marketplace`, `/marketplace/[id]`)
- Listing grid: crop, county, quantity, LRD/USD price, farmer badge, WhatsApp status
- Filters: crop type, county, quality, sort order
- **Listing detail page:**
  - Price comparison vs county market average
  - WhatsApp contact with pre-filled message (`wa.me/+231...?text=...`)
  - Reveal phone number for MTN / Orange call
  - Platform inquiry stored in localStorage
  - Farmer profile (privacy-protected: first name + last initial)
  - Payment info: MTN MoMo (Lonestar) / Orange Money
  - USSD fallback: `*347*{listing_code}#`

### Admin Dashboard (`/admin/dashboard`)
- KPI row: Total Farmers, Active Today, USSD Sessions, Counties Active
- Farmer signups chart (Recharts LineChart)
- County breakdown bar chart
- Most searched crops chart
- Farmer management table with Activate/Deactivate
- Price management with inline editing

---

## Project Structure

```
agriconnect-liberia/
├── app/
│   ├── (public)/               # Public pages (landing, auth)
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/       # 5-step registration wizard
│   │   ├── about/
│   │   └── contact/
│   ├── (app)/                  # Authenticated app pages
│   │   ├── dashboard/
│   │   ├── market/
│   │   ├── weather/
│   │   ├── tips/
│   │   │   └── [slug]/
│   │   ├── marketplace/
│   │   │   └── [id]/
│   │   ├── my-farm/
│   │   ├── inventory/
│   │   ├── alerts/
│   │   └── ai-advisor/
│   └── admin/                  # Admin portal
│       ├── dashboard/
│       ├── users/
│       ├── prices/
│       └── analytics/
├── components/
│   ├── landing/                # Landing page sections
│   ├── dashboard/              # Dashboard widgets
│   ├── market/                 # Market price components
│   ├── tips/                   # Tip cards and category grid
│   ├── weather/                # Weather components
│   ├── farm/                   # Farm management
│   ├── shared/                 # Navbar, Logo, PageHeader, etc.
│   └── ui/                     # Base UI primitives
├── lib/
│   ├── auth.ts                 # Auth logic + useAuth hook
│   ├── constants.ts            # Crops list, mobile money providers
│   ├── store/
│   │   └── useAppStore.ts      # Zustand global state
│   ├── api/                    # Mock API functions
│   ├── mock-data/              # Seed data (crops, tips, users, etc.)
│   ├── hooks/
│   │   └── useAuth.ts          # Re-export of useAuth
│   └── types/
│       └── index.ts            # TypeScript interfaces
```

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@agrihub.lr | Admin@2024 |
| Farmer | fatu.kamara@agrihub.lr | Farmer@2024 |
| Farmer | musu.kollie@agrihub.lr | Farmer@2024 |
| Extension Officer | james.flomo@agrihub.lr | Officer@2024 |
| Supplier | greenfields@agrihub.lr | Supplier@2024 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Mobile Money (Liberia)

AgriHub is adapted for Liberia's two mobile network operators:

- **MTN MoMo (Lonestar)** — formerly Lonestar Cell, available nationwide
- **Orange Money** — Orange Liberia, available nationwide

Payments flow directly from buyer to farmer wallet. AgriHub does not hold funds.

---

## Offline Access

Farmers without smartphones can access market prices and agronomy tips via USSD:

```
*347#
```

Available on any Liberian phone on MTN or Orange network.

---

## Commissioned By

Ministry of Commerce & Industry, Republic of Liberia
Built by **Tech 231 Liberia Limited** — Version 1.0 · February 2025 · CONFIDENTIAL
