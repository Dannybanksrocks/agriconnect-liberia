# AgriHub Liberia

**Digital Agricultural Intelligence Platform + Consumer E-Commerce**
Built by [Tech 231 Liberia Limited](https://tech231liberia.com) · Commissioned by the Ministry of Commerce & Industry, Republic of Liberia

---

## Overview

AgriHub Liberia is a full-stack digital agricultural platform empowering rural Liberian farmers with real-time market prices, county-specific weather forecasts, expert agronomy guidance, and a peer-to-peer marketplace connecting farmers directly to buyers. No middlemen. Better prices.

It also includes a **consumer e-commerce storefront** (`/shop`) — a fresh, public-facing shop where everyday Liberians can browse and order produce directly from verified farmers, with delivery address management, order tracking, and MTN MoMo / Orange Money checkout.

The platform is designed for Liberia's infrastructure realities: low-bandwidth mobile browsers, WhatsApp-first communication, MTN MoMo / Orange Money payments, and USSD offline access via `*347#` on any Liberian phone.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | Zustand (with localStorage persist) |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| Auth | localStorage-based mock sessions (Phase 1) |

---

## Features

### Authentication — Farmers & Staff

- **6-Step Registration Wizard** — Personal info, Farm details, Account type, Mobile money setup, Preferences, Complete
- **Login Page** — Split layout, email/phone detection, role-based redirect, remember me
- Roles: `farmer`, `buyer`, `extension-officer`, `admin`, `supplier`
- Sessions stored in `localStorage` under `agrihub_session`

### Farmer Dashboard (`/dashboard`)
- Time-based greeting with county badge
- My Farm summary card (name, size, crops)
- AI Advisor widget — daily planting, price, and risk recommendations
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

### Marketplace — Farmer B2B (`/marketplace`, `/marketplace/[id]`)
- Listing grid: crop, county, quantity, LRD/USD price, farmer badge, WhatsApp status indicator
- Filters: crop type, county, quality, sort order
- **Listing detail page:**
  - Price comparison vs county market average
  - WhatsApp contact with pre-filled message (`wa.me/+231...?text=...`)
  - Reveal phone number for MTN / Orange call
  - Platform inquiry stored in localStorage
  - Farmer profile (privacy-protected: first name + last initial)
  - Payment info: MTN MoMo / Orange Money
  - USSD fallback: `*347*{listing_code}#`

### AI Crop Advisor (`/ai-advisor`)
- Season-aware planting recommendations (Dry / Rainy season + county)
- Price intelligence: best crops to sell this week, best market, 30-day price forecast
- Crop health calendar: seasonal pest and disease alerts for Liberia
- Income optimizer: "what if" simulator — fresh vs processed, intercropping suggestion

### Consumer Shop (`/shop`) — E-Commerce Extension

A dedicated storefront for everyday consumers (non-farmers) to browse and order fresh produce.

| Page | Route |
|---|---|
| Shop Home | `/shop` |
| Product Listing | `/shop/products` |
| Product Detail | `/shop/products/[id]` |
| Cart | `/shop/cart` |
| Checkout | `/shop/checkout` |
| Orders List | `/shop/orders` |
| Order Detail | `/shop/orders/[id]` |
| Consumer Login | `/shop/auth/login` |
| Consumer Register | `/shop/auth/register` |
| Account / Profile | `/shop/account` |

**Consumer Features:**
- Shopping cart with fulfillment selector per item (delivery / pickup / bulk / recurring)
- MTN MoMo / Orange Money checkout
- Delivery address management (county + landmark)
- Order tracking timeline: placed → confirmed → out for delivery → delivered
- Product reviews & star ratings
- Save (wishlist) items
- Scheduled recurring orders (weekly produce box)

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
│   ├── (public)/               # Landing page + farmer auth
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/       # 6-step farmer wizard
│   │   ├── about/
│   │   └── contact/
│   ├── (app)/                  # Authenticated farmer/officer pages
│   │   ├── dashboard/
│   │   ├── market/
│   │   ├── weather/
│   │   ├── tips/ + [slug]/
│   │   ├── marketplace/ + [id]/
│   │   ├── ai-advisor/
│   │   └── my-farm/
│   ├── (shop)/                 # Consumer e-commerce storefront
│   │   ├── page.tsx            # Shop home
│   │   ├── products/ + [id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/ + [id]/
│   │   ├── account/
│   │   └── auth/ (login, register)
│   └── admin/                  # Admin portal
│       ├── dashboard/
│       ├── users/
│       └── prices/
├── components/
│   ├── landing/                # Landing page sections
│   ├── dashboard/              # Dashboard + AI advisor widgets
│   ├── market/                 # Market price components
│   ├── tips/                   # Tip cards
│   ├── weather/                # Weather components
│   ├── shop/                   # Consumer shop components
│   └── shared/                 # Navbar, Footer, etc.
├── lib/
│   ├── auth.ts                 # Farmer/admin auth
│   ├── auth-consumer.ts        # Consumer auth
│   ├── constants.ts            # Crops list, mobile money providers
│   ├── constants/
│   │   └── cropImages.ts       # Unsplash crop image URLs
│   ├── store/
│   │   ├── useAppStore.ts      # Zustand app state
│   │   └── useShopStore.ts     # Zustand shop state (cart, orders, addresses)
│   ├── mock-data/              # Seed data (crops, tips, users, listings, etc.)
│   └── types/
│       ├── index.ts            # Farmer/market types
│       └── shop.ts             # Consumer/shop types
```

---

## Demo Accounts

### Farmer / Staff (login at `/auth/login`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@agrihub.lr | Admin@2024 |
| Farmer | fatu.kamara@agrihub.lr | Farmer@2024 |
| Farmer | musu.kollie@agrihub.lr | Farmer@2024 |
| Extension Officer | james.flomo@agrihub.lr | Officer@2024 |
| Supplier | greenfields@agrihub.lr | Supplier@2024 |
| AI Advisor User | advisor@agrihub.lr | Advisor@2024 |

### Consumer (login at `/shop/auth/login`)

| Name | Email or Phone | Password |
|---|---|---|
| Mary Johnson | consumer@agrihub.lr | Consumer@2024 |
| Emmanuel Dolo | +231550987654 | Consumer@2024 |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Landing page: `http://localhost:3000`
- Consumer shop: `http://localhost:3000/shop`
- Farmer login: `http://localhost:3000/auth/login`
- Consumer login: `http://localhost:3000/shop/auth/login`
- Admin portal: `http://localhost:3000/admin/dashboard`

---

## Mobile Money (Liberia)

AgriHub is adapted for Liberia's two mobile network operators:

- **MTN MoMo (Lonestar)** — formerly Lonestar Cell, available nationwide
- **Orange Money** — Orange Liberia, available nationwide

Payments flow directly from buyer or consumer to farmer wallet. AgriHub does not hold funds.

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
Built by **Tech 231 Liberia Limited** — Version 1.0 · February 2026 · CONFIDENTIAL
