# AGENTS.md — The Skin Boutique

> Project context file for AI coding agents. Read this first before making any changes.

---

## Project Identity

**Name:** The Skin Boutique  
**Domain:** Premium K-Beauty e-commerce, South Africa  
**Business Model:** Headless Shopify storefront + Teemdrop dropship sourcing  
**Stack:** Vite + React + TypeScript frontend, Firebase (Firestore + Hosting + Cloud Functions), Shopify Storefront API

---

## Architecture Overview

```
the-skin-boutique/
├── src/                          # Frontend (Vite + React + TS)
│   ├── App.tsx                   # Root router
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React context providers (cart, auth, currency)
│   ├── data/brands/              # Modular per-brand product data (.ts files)
│   ├── lib/
│   │   ├── firebase.ts           # Firebase SDK init
│   │   ├── pricingEngine.ts      # ZAR pricing, margin calculations, currency conversion
│   │   ├── payment.ts            # Shopify checkout handoff
│   │   └── purchaseLedger.ts     # Order tracking / Firestore ledger
│   ├── pages/                    # Route-level page components
│   └── utils/                    # Slug generation, helpers
│
├── functions/src/index.ts        # Firebase Cloud Functions (order sync, Shopify webhooks)
│
├── public/data/products.json     # ★ MASTER CATALOG — compiled from src/data/brands/
│
├── scripts/                      # Offline tooling (NOT part of the frontend build)
│   ├── generate_exports.mjs      # Produces catalog_summary.pdf + catalog_full.csv
│   ├── generate_shopify_csv.mjs  # Produces Shopify-compatible product import CSV
│   ├── normalize_kiyoko.mjs      # Scrapes & normalises raw Kiyoko.com product data
│   ├── market_price_overrides.json  # SA competitor pricing benchmarks (confidential)
│   ├── compile_catalog.ts        # Aggregates brand files → products.json
│   ├── catalog_deduper*.mjs      # Deduplication scripts
│   └── ...                       # Scrapers, auditors, Firebase admin scripts
│
├── exports/                      # Agent-facing deliverables
│   ├── catalog_summary.pdf       # Sourcing PDF for Teemdrop agent
│   ├── catalog_full.csv          # Full product data with SA market pricing
│   └── teemdrop_sourcing_manifest.md  # Sourcing brief / script for agent
│
├── firebase.json                 # Firebase Hosting + Functions config
├── firestore.rules               # Firestore security rules
└── vite.config.ts                # Vite build config
```

---

## Critical Data Flow

```
Kiyoko.com (scraper) → normalize_kiyoko.mjs → normalized_kiyoko.json
                                                       ↓
                                              src/data/brands/*.ts
                                                       ↓
                                           compile_catalog.ts
                                                       ↓
                                         public/data/products.json  ← ★ SINGLE SOURCE OF TRUTH
                                              ↓              ↓
                                     Frontend (React)    generate_exports.mjs
                                                              ↓
                                                   exports/ (PDF + CSV + manifest)
```

**Rule:** Never edit `products.json` directly. Always update the brand files in `src/data/brands/` and recompile.

---

## Pricing Model

- **Base currency:** USD (sourced from Kiyoko.com)
- **Exchange rate:** R19.50/USD (hardcoded in `pricingEngine.ts` and `normalize_kiyoko.mjs`)
- **Landed cost buffer:** 10% on top of converted price
- **Target margin:** 45% (frontend pricing), 65-75% (sourcing targets)
- **Market overrides:** `scripts/market_price_overrides.json` caps prices on products with SA competitors
- **Free shipping:** Baked into retail prices (R100-R200 per parcel absorbed)

---

## Key Business Rules

1. **Single-unit dropship only** — no bulk purchasing. Each order = one customer shipment.
2. **Ghost shipping** — zero supplier branding on packages. Customer sees only The Skin Boutique.
3. **Shopify is the checkout** — frontend hands off to Shopify Storefront API for payment. We are headless.
4. **Firestore is the ledger** — order records, customer data, and inventory sync live in Firestore.
5. **Products.json is the master** — the frontend reads from `public/data/products.json`, not Firestore, for product display.

---

## Sensitive Files (Do Not Expose)

| File | Contains |
|------|----------|
| `.env` | Firebase API keys, Shopify tokens |
| `functions/.env` | Cloud Function secrets |
| `serviceAccountKey.json` | Firebase admin SDK credentials |
| `scripts/market_price_overrides.json` | Competitor pricing intelligence |
| `exports/teemdrop_sourcing_manifest.md` | Agent pricing targets & contact info |

---

## Common Agent Tasks

### Regenerate exports (PDF + CSV)
```bash
node scripts/generate_exports.mjs
```
Outputs: `exports/catalog_summary.pdf` + `exports/catalog_full.csv`

### Recompile master catalog
```bash
npx ts-node scripts/compile_catalog.ts
```
Outputs: `public/data/products.json`

### Generate Shopify import CSV
```bash
node scripts/generate_shopify_csv.mjs
```
Outputs: `shopify_products.csv`

### Run deduplication
```bash
node scripts/catalog_deduper_v2.mjs
```

---

## Style & Conventions

- **Scripts:** `.mjs` (ESM) for Node tooling, `.ts` for anything that touches the frontend
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components, `kebab-case` for file slugs
- **Categories:** Must use normalised Shopify taxonomy (see `CATEGORY_MAP` in `normalize_kiyoko.mjs`)
- **Currency:** Always display ZAR with `R` prefix (e.g., `R499.00`). Never show USD to customers.
- **No competitor names** in any customer-facing or agent-facing output. Use "SA market" / "local retailers" instead.

---

## Contact & Operations

- **Primary comms:** WhatsApp (+27 69 325 9748)
- **Secondary address:** 17 Calendula Road, Malabar, 6020 Port Elizabeth (failed delivery routing)
- **Sourcing partner:** Teemdrop (dropship agent, quotes pending)
