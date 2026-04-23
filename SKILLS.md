# SKILLS.md — The Skin Boutique

> Capabilities, workflows, and operational skills available to agents working on this project.

---

## 🔧 Catalog Management

### Skill: Product Import & Normalisation
**When:** Adding new products from a supplier (Kiyoko, direct brand scrape)  
**How:**
1. Scrape raw data → save to `temp_*_raw.json`
2. Run `node scripts/normalize_kiyoko.mjs` to clean, categorise, and price
3. Output goes to `normalized_*.json`
4. Move normalised products into `src/data/brands/<brand>.ts`
5. Run `npx ts-node scripts/compile_catalog.ts` to rebuild `products.json`

**Watch out for:**
- Category strings must pass through `CATEGORY_MAP` in `normalize_kiyoko.mjs` — raw Kiyoko categories will fail Shopify import
- Slug collisions — run `catalog_deduper_v2.mjs` after any bulk import
- USD prices must be converted using the `EXCHANGE_RATE` constant (currently R19.50)

---

### Skill: Deduplication
**When:** After bulk imports, or when Shopify reports duplicate handles  
**How:** `node scripts/catalog_deduper_v2.mjs`  
**Logic:** Matches on normalised slug. Keeps the entry with the most complete data (description + ingredients + images).

---

### Skill: Category Normalisation
**When:** Shopify CSV import fails with "invalid product type"  
**How:** Update `CATEGORY_MAP` in `normalize_kiyoko.mjs`, then recompile  
**Valid categories:** Must conform to Shopify's product taxonomy. Use the `Type` column header, not `Product Category`.

---

## 💰 Pricing & Competitive Intelligence

### Skill: Market Price Benchmarking
**When:** Before finalising retail prices on products with SA competitors  
**How:**
1. Scrape competitor Shopify JSON (`/products.json` endpoint)
2. Run `scripts/parse_secretskin.mjs` (or equivalent) to extract prices
3. Run `scripts/check_discounts.mjs` to identify sale vs regular prices — **never benchmark against temporary discounts**
4. Update `scripts/market_price_overrides.json` with regular prices only
5. Run `node scripts/generate_exports.mjs` to apply overrides to the catalog

**Override format:**
```json
{
  "match": "product name substring (lowercase)",
  "saMarketPrice": 399,
  "source": "SA market",
  "adjustedRetail": 429,
  "note": "Regular R399, currently on sale R339. Priced against regular."
}
```

**Rules:**
- Never name competitors in any agent-facing or customer-facing output
- Always use `compare_at_price` field to detect sales — if set, the product is discounted
- Our retail = 10-15% above the competitor's **regular** price
- Products with no SA competitor retain premium (calculated) pricing

---

### Skill: Margin Tier Assignment
**Tiers:**
| Tier | Rank | Target GM | Max COGS % |
|------|------|-----------|------------|
| A (Hero) | 1-20 | 75% | 25% |
| B (Volume) | 21-50 | 70% | 30% |
| C (Long-tail) | 51+ | 65% | 35% |

Assigned automatically by `generate_exports.mjs` based on popularity score.

---

### Skill: Landed Cost Calculation
**Formula (SARS 2026):**
```
Customs Value  = FOB (USD) × Exchange Rate
Duty           = Customs Value × 20% (HS 3304)
ATV            = Customs Value + Freight + Insurance + Duty
VAT            = ATV × 15%
Total Landed   = Customs Value + Freight + Insurance + Duty + VAT
```

---

## 📦 Export & Sourcing

### Skill: Generate Sourcing Package
**When:** Preparing deliverables for Teemdrop or any sourcing agent  
**How:** `node scripts/generate_exports.mjs`  
**Outputs:**
- `exports/catalog_summary.pdf` — Visual reference with Top 50, category breakdown, high-ticket section
- `exports/catalog_full.csv` — Full 1,059 SKUs with SA Market Price column, pricing notes, margin tiers
- `exports/teemdrop_sourcing_manifest.md` — The agent brief (manually maintained)

**PDF includes:** Cover, executive summary, competitive intelligence section, Top 50 table, full catalog by category, high-ticket requests, sourcing notes.

---

### Skill: Generate Shopify CSV
**When:** Bulk importing or updating products in Shopify Admin  
**How:** `node scripts/generate_shopify_csv.mjs`  
**Watch out for:**
- Column must be `Type`, not `Product Category` — Shopify is strict
- Categories must be normalised via `CATEGORY_MAP`
- Handles must be unique (run deduper first)

---

## 🌐 Frontend & Deployment

### Skill: Local Development
```bash
npm run dev
```
Runs Vite dev server. Frontend reads from `public/data/products.json`.

### Skill: Production Build & Deploy
```bash
npm run build          # Vite production build → dist/
firebase deploy        # Deploy to Firebase Hosting + Cloud Functions
```

### Skill: Shopify Checkout Handoff
The frontend creates a Shopify checkout via the Storefront API (`src/lib/payment.ts`). Cart items are converted to Shopify line items with inventory validation. Discount codes and cart sessions are persisted through the handoff.

---

## 🔍 Scraping & Data Collection

### Skill: Kiyoko Bulk Scrape
**How:** `node scripts/kiyoko_bulk_importer.mjs`  
**What it does:** Fetches all products from Kiyoko.com's API, normalises them, and outputs `normalized_kiyoko.json`.

### Skill: Competitor Price Scrape
**How:** Hit any Shopify store's `/products.json` endpoint (paginate with `?page=N`)  
**Parse:** Use `compare_at_price` to detect discounts  
**Store:** Raw data in `exports/<competitor>_prices.json` (internal only, never in deliverables)

---

## 📊 Analytics & Auditing

### Skill: Catalog Audit
**How:** `node scripts/catalog_audit.mjs`  
**Checks:** Missing descriptions, missing images, price outliers, duplicate slugs, uncategorised products.

### Skill: Inventory Verification
Cross-reference `products.json` against Shopify Admin to find:
- Products in our catalog but not in Shopify
- Products in Shopify but not in our catalog
- Price mismatches between systems

---

## 🛡️ Security & Compliance

### Skill: SAHPRA Compliance Check
All skincare products must have:
- Valid INCI Ingredient Lists in English
- No banned substances per SAHPRA cosmetic schedule
- Batch/lot numbers for traceability
- HS 3304 classification for customs

### Skill: Secrets Management
- Never commit `.env`, `serviceAccountKey.json`, or `functions/.env`
- `.gitignore` is configured — verify before any `git add .`
- Competitor pricing data (`market_price_overrides.json`) is internal only

---

## 🧠 Decision Framework

When making changes, follow this priority:

1. **Does it affect the customer?** → Test on dev server first, verify pricing displays correctly
2. **Does it affect sourcing?** → Regenerate exports (`generate_exports.mjs`), verify no competitor names leak
3. **Does it affect Shopify?** → Regenerate Shopify CSV, verify category taxonomy, run deduper
4. **Is it a new product?** → Add to brand file → compile → dedupe → regenerate all exports
5. **Is it a price change?** → Update `market_price_overrides.json` → regenerate exports → verify margin tiers
