import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';

const MASTER_FILE = 'public/data/products.json';
const EXPORTS_DIR = 'exports';
const OVERRIDES_FILE = 'scripts/market_price_overrides.json';

// ─── Market Price Overrides (from SA market research) ────────────
function loadMarketOverrides() {
  try {
    const raw = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    return raw.overrides || [];
  } catch {
    console.warn('⚠ No market_price_overrides.json found. Using calculated prices.');
    return [];
  }
}

function findOverride(productName, overrides) {
  const name = productName.toLowerCase();
  return overrides.find(o => name.includes(o.match.toLowerCase()));
}

// ─── Margin / COGS Helpers ──────────────────────────────────────
const EXCHANGE_RATE = 19.5;
const LANDED_BUFFER = 1.10;

function getMarginTier(rank) {
  if (rank <= 20) return { label: 'Tier A (Hero)', targetMargin: 0.75, maxCogsPct: 0.25 };
  if (rank <= 50) return { label: 'Tier B (Volume)', targetMargin: 0.70, maxCogsPct: 0.30 };
  return { label: 'Tier C (Long-tail)', targetMargin: 0.65, maxCogsPct: 0.35 };
}

function getMaxLandedCost(retailZAR, tier) {
  return retailZAR * tier.maxCogsPct;
}

// ─── Popularity Scoring ─────────────────────────────────────────
const HERO_BRANDS = new Set([
  'COSRX', 'Beauty of Joseon', 'ANUA', 'Biodance', 'Abib', 'SKIN1004',
  'Torriden', 'Mediheal', 'Innisfree', 'Laneige', 'Etude', 'Missha',
  'SOME BY MI', 'Purito', 'Benton', 'Klairs', 'I\'m From', 'Needly',
  'Round Lab', 'ma:nyo', 'ONE THING', 'mixsoon', 'Haruharu WONDER',
  'Isntree', 'By Wishtrend', 'TirTir', 'rom&nd', 'Peripera', 'TONYMOLY',
  'Banila Co', 'heimish', 'ILLIYOON', 'Goodal', 'AXIS-Y', 'Celimax',
  'numbuzin', 'medicube', 'VT', 'Dr.G', 'Dr. Althea', 'AHC'
]);

function popularityScore(product, catCounts) {
  let score = 0;
  const catSize = catCounts[product.category] || 0;
  score += Math.min(catSize, 100) * 2;
  if (HERO_BRANDS.has(product.brand)) score += 80;
  if (product.price >= 300 && product.price <= 900) score += 40;
  else if (product.price >= 200 && product.price <= 1200) score += 20;
  if (product.sourcePrice && product.sourcePrice < 20) score += 30;
  else if (product.sourcePrice && product.sourcePrice < 35) score += 15;
  return score;
}

// ─── CSV Generation ─────────────────────────────────────────────
async function generateCsv(products) {
  const csvWriter = createObjectCsvWriter({
    path: path.join(EXPORTS_DIR, 'catalog_full.csv'),
    header: [
      { id: 'rank',          title: '#' },
      { id: 'brand',         title: 'BRAND' },
      { id: 'name',          title: 'PRODUCT NAME' },
      { id: 'category',      title: 'CATEGORY' },
      { id: 'price',         title: 'RETAIL PRICE (ZAR)' },
      { id: 'saMarketPrice', title: 'SA MARKET PRICE (ZAR)' },
      { id: 'sourcePrice',   title: 'SOURCE PRICE (USD)' },
      { id: 'maxCogs',       title: 'MAX LANDED COST (ZAR)' },
      { id: 'tier',          title: 'MARGIN TIER' },
      { id: 'targetGM',      title: 'TARGET GM%' },
      { id: 'priceNote',     title: 'PRICING NOTE' },
      { id: 'sourceUrl',     title: 'SOURCE URL' },
      { id: 'description',   title: 'DESCRIPTION' },
      { id: 'ingredients',   title: 'INGREDIENTS' },
    ]
  });

  const rows = products.map((p, i) => {
    const tier = getMarginTier(i + 1);
    return {
      rank: i + 1,
      brand: p.brand,
      name: p.name,
      category: p.category,
      price: `R${p.price.toFixed(2)}`,
      saMarketPrice: p._saMarketPrice ? `R${p._saMarketPrice}` : '—',
      sourcePrice: p.sourcePrice ? `$${p.sourcePrice.toFixed(2)}` : '',
      maxCogs: `R${getMaxLandedCost(p.price, tier).toFixed(2)}`,
      tier: tier.label,
      targetGM: `${(tier.targetMargin * 100).toFixed(0)}%`,
      priceNote: p._priceNote || (p._saMarketPrice ? 'Competitive' : 'No local comp'),
      sourceUrl: p.sourceUrl || '',
      description: (p.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200),
      ingredients: (p.ingredients || '').substring(0, 200),
    };
  });

  await csvWriter.writeRecords(rows);
  console.log(`CSV Export complete: ${rows.length} products.`);
}

// ─── PDF Generation ─────────────────────────────────────────────
async function generatePdf(products) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const outputPath = path.join(EXPORTS_DIR, 'catalog_summary.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const pageWidth = 595.28 - 80;
  const bold = 'Helvetica-Bold';
  const regular = 'Helvetica';

  // ══════════════════════════════════════════════════════════════
  // PAGE 1: COVER
  // ══════════════════════════════════════════════════════════════
  doc.moveDown(8);
  doc.fontSize(28).font(bold).text('THE SKIN BOUTIQUE', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).font(regular).text('Strategic Sourcing Manifest', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(12).text(`April 2026 — ${products.length} SKUs`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#cc0000')
    .text('Includes SA Market Intelligence from Local Competitor Research', { align: 'center' });
  doc.fillColor('#000000');
  doc.moveDown(4);

  doc.fontSize(10).font(regular);
  doc.text('Prepared for: Teemdrop Sourcing Agent', { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(8).fillColor('#888888')
    .text('CONFIDENTIAL — This document contains proprietary pricing and margin targets. Do not distribute.', { align: 'center' });
  doc.fillColor('#000000');

  // ══════════════════════════════════════════════════════════════
  // PAGE 2: EXECUTIVE SUMMARY
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  doc.fontSize(18).font(bold).text('Executive Summary');
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.5);

  const catCounts = {};
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  const uniqueBrands = [...new Set(products.map(p => p.brand))].length;
  const uniqueCats = Object.keys(catCounts).length;
  const avgPrice = products.reduce((s, p) => s + p.price, 0) / products.length;
  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const medianPrice = prices[Math.floor(prices.length / 2)];
  const overriddenCount = products.filter(p => p._saMarketPrice).length;

  doc.fontSize(10).font(regular);
  const summaryItems = [
    `Total SKUs: ${products.length}`,
    `Unique Brands: ${uniqueBrands}`,
    `Product Categories: ${uniqueCats}`,
    `Price Range: R${prices[0].toFixed(0)} — R${prices[prices.length - 1].toFixed(0)}`,
    `Average Retail Price: R${avgPrice.toFixed(0)}`,
    `Median Retail Price: R${medianPrice.toFixed(0)}`,
    `Market-Adjusted Products: ${overriddenCount} (prices calibrated against SA competitors)`,
  ];
  summaryItems.forEach(item => {
    doc.text(`•  ${item}`);
    doc.moveDown(0.3);
  });

  doc.moveDown(1);
  doc.fontSize(14).font(bold).text('Margin Tier Structure');
  doc.moveDown(0.5);

  const tierData = [
    ['Tier A (Hero)', 'Ranks 1-20', '75%', '25%', 'First priority — source these immediately'],
    ['Tier B (Volume)', 'Ranks 21-50', '70%', '30%', 'Strong sellers — source within 2 weeks'],
    ['Tier C (Long-tail)', 'Ranks 51+', '65%', '35%', 'Catalog depth — source as available'],
  ];

  const tierColWidths = [100, 70, 50, 60, 200];
  const tierHeaders = ['Tier', 'Scope', 'Target GM', 'Max COGS%', 'Instructions'];

  let ty = doc.y;
  doc.fontSize(8).font(bold);
  tierHeaders.forEach((h, i) => {
    const x = 40 + tierColWidths.slice(0, i).reduce((s, w) => s + w, 0);
    doc.text(h, x, ty, { width: tierColWidths[i] });
  });

  ty += 15;
  doc.moveTo(40, ty).lineTo(555, ty).lineWidth(0.3).stroke();
  ty += 5;

  doc.font(regular);
  tierData.forEach(row => {
    row.forEach((cell, i) => {
      const x = 40 + tierColWidths.slice(0, i).reduce((s, w) => s + w, 0);
      doc.text(cell, x, ty, { width: tierColWidths[i] });
    });
    ty += 18;
  });

  // ─── COMPETITIVE INTELLIGENCE SECTION ───
  doc.moveDown(3);
  doc.fontSize(14).font(bold).fillColor('#cc0000').text('⚠ Competitive Intelligence: Market-Adjusted Pricing');
  doc.fillColor('#000000');
  doc.moveDown(0.3);
  doc.fontSize(9).font(regular);
  doc.text('The retail prices in this document have been calibrated against leading SA K-Beauty retailers (221+ products analysed). Products where local competitors sell below our calculated price have been repriced to remain competitive. The "SA Market" column shows what customers currently pay elsewhere in South Africa.');
  doc.moveDown(0.5);
  doc.font(bold).fontSize(9);
  doc.text('KEY INSIGHT: Brands with NO local competitor (Mediheal, COSRX, Beauty of Joseon) retain premium pricing. Overlapping brands are priced 10-15% above local market rates to maintain margin while remaining competitive.');
  doc.font(regular);

  doc.moveDown(1);
  doc.fontSize(14).font(bold).text('Top 10 Categories by Product Count');
  doc.moveDown(0.5);

  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const topCats = sortedCats.slice(0, 10);

  doc.fontSize(9).font(regular);
  topCats.forEach(([cat, count], i) => {
    const pct = ((count / products.length) * 100).toFixed(1);
    doc.text(`${(i + 1).toString().padStart(2)}.  ${cat}  —  ${count} products (${pct}%)`);
    doc.moveDown(0.2);
  });

  // ══════════════════════════════════════════════════════════════
  // PAGES 3+: TOP 50 HERO PRODUCTS (with SA Market column)
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  doc.fontSize(18).font(bold).text('Section 1: Top 50 Priority Products');
  doc.moveDown(0.3);
  doc.fontSize(9).font(regular).fillColor('#555555')
    .text('Ranked by composite popularity score. "SA Mkt" shows competitor pricing where available.');
  doc.fillColor('#000000');
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.5);

  // Updated columns with SA Market Price
  const colWidths = [22, 70, 135, 65, 52, 52, 58, 55];
  const headers = ['#', 'Brand', 'Product Name', 'Category', 'Retail', 'SA Mkt', 'Max COGS', 'Tier'];

  function drawTableHeader() {
    const y = doc.y;
    doc.fontSize(6.5).font(bold);
    headers.forEach((h, i) => {
      const x = 40 + colWidths.slice(0, i).reduce((s, w) => s + w, 0);
      doc.text(h, x, y, { width: colWidths[i] });
    });
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.3).stroke();
    doc.moveDown(0.3);
  }

  function drawProductRow(product, rank) {
    if (doc.y > 740) {
      doc.addPage();
      drawTableHeader();
    }

    const tier = getMarginTier(rank);
    const maxCogs = getMaxLandedCost(product.price, tier);
    const y = doc.y;

    // Highlight repriced products
    const isRepriced = !!product._saMarketPrice;
    doc.fontSize(6.5).font(rank <= 20 ? bold : regular);

    const cells = [
      rank.toString(),
      product.brand.substring(0, 14),
      product.name.substring(0, 34),
      product.category.substring(0, 14),
      `R${product.price.toFixed(0)}`,
      isRepriced ? `R${product._saMarketPrice}` : '—',
      `R${maxCogs.toFixed(0)}`,
      rank <= 20 ? 'A' : rank <= 50 ? 'B' : 'C',
    ];

    cells.forEach((cell, i) => {
      const x = 40 + colWidths.slice(0, i).reduce((s, w) => s + w, 0);
      // Highlight SA Market price in red if it's lower than our retail
      if (i === 5 && isRepriced) {
        doc.fillColor('#cc0000').text(cell, x, y, { width: colWidths[i] });
        doc.fillColor('#000000');
      } else {
        doc.text(cell, x, y, { width: colWidths[i] });
      }
    });

    doc.moveDown(0.5);

    if (rank === 20 || rank === 50) {
      doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).strokeColor('#cc0000').stroke();
      doc.strokeColor('#000000');
      doc.moveDown(0.3);
      if (rank === 20) {
        doc.fontSize(7).font(bold).fillColor('#cc0000')
          .text('─── END TIER A (HERO) · BEGIN TIER B (VOLUME) ───', { align: 'center' });
        doc.fillColor('#000000');
        doc.moveDown(0.3);
      }
    }
  }

  drawTableHeader();

  const top50 = products.slice(0, 50);
  top50.forEach((p, i) => drawProductRow(p, i + 1));

  // ══════════════════════════════════════════════════════════════
  // REMAINING PRODUCTS — SORTED BY CATEGORY POPULARITY
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  doc.fontSize(18).font(bold).text('Section 2: Full Catalog by Category');
  doc.moveDown(0.3);
  doc.fontSize(9).font(regular).fillColor('#555555')
    .text('Categories ordered by market demand. All products are Tier C (65% target margin). Red SA Mkt prices = local competition exists.');
  doc.fillColor('#000000');
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.5);

  const remaining = products.slice(50);

  const byCat = {};
  remaining.forEach(p => {
    if (!byCat[p.category]) byCat[p.category] = [];
    byCat[p.category].push(p);
  });

  const catOrder = Object.keys(byCat).sort((a, b) => (catCounts[b] || 0) - (catCounts[a] || 0));

  let globalRank = 51;

  catOrder.forEach(cat => {
    const catProducts = byCat[cat];

    if (doc.y > 720) doc.addPage();

    doc.moveDown(0.3);
    doc.fontSize(10).font(bold).fillColor('#333333')
      .text(`▸ ${cat}  (${catCounts[cat]} total in catalog, ${catProducts.length} in this section)`);
    doc.fillColor('#000000');
    doc.moveDown(0.3);

    drawTableHeader();

    catProducts.forEach(p => {
      drawProductRow(p, globalRank);
      globalRank++;
    });
  });

  // ══════════════════════════════════════════════════════════════
  // HIGH-TICKET SPECIAL REQUESTS
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  doc.fontSize(18).font(bold).fillColor('#cc0000').text('⭐ High-Ticket Special Requests');
  doc.fillColor('#000000');
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.5);

  doc.fontSize(10).font(regular);
  doc.text('The following high-value products require individual sourcing quotes with special attention to quality assurance and shipping insurance.');
  doc.moveDown(1);

  const highTicketItems = [
    {
      name: 'Medicube Age-R Booster Pro',
      localPrice: 'R6,799 (leading SA retailer)',
      intlPrice: '$305-$322 USD',
      targetCogs: 'R3,900-R4,875 landed (approx. $200-$250 wholesale)',
      ourRetail: 'R5,999',
      margin: '~25-40%',
      notes: 'Available in pink, black, white. The "Mini" version sells for R2,950-R2,999. This is a high-ticket hero product — single sales generate R1,500+ margin. Requires bubble wrap + insurance.',
    },
    {
      name: 'Medicube Booster Pro Special Edition',
      localPrice: 'R6,999 (leading SA retailer)',
      intlPrice: '~$330 USD',
      targetCogs: 'R4,200-R5,000 landed',
      ourRetail: 'R6,499',
      margin: '~25-35%',
      notes: 'Special edition colorway. Source alongside the standard Booster Pro.',
    }
  ];

  highTicketItems.forEach(item => {
    doc.fontSize(12).font(bold).text(item.name);
    doc.moveDown(0.3);
    doc.fontSize(9).font(regular);
    doc.font(bold).text('SA Competitor Price: ', { continued: true });
    doc.font(regular).text(item.localPrice);
    doc.font(bold).text('International Price: ', { continued: true });
    doc.font(regular).text(item.intlPrice);
    doc.font(bold).text('Target COGS: ', { continued: true });
    doc.font(regular).text(item.targetCogs);
    doc.font(bold).text('Our Retail Price: ', { continued: true });
    doc.font(regular).text(item.ourRetail);
    doc.font(bold).text('Target Margin: ', { continued: true });
    doc.font(regular).text(item.margin);
    doc.font(bold).text('Notes: ', { continued: true });
    doc.font(regular).text(item.notes);
    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.2).strokeColor('#cccccc').stroke();
    doc.strokeColor('#000000');
    doc.moveDown(0.5);
  });

  // ══════════════════════════════════════════════════════════════
  // LAST PAGE: SOURCING NOTES
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  doc.fontSize(18).font(bold).text('Sourcing Notes & Requirements');
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(0.5).stroke();
  doc.moveDown(0.5);

  const notes = [
    ['Fulfilment Model', 'Single-unit dropship only. Every order is one customer, one shipment. No bulk purchasing at this stage.'],
    ['Ghost Shipping', 'All packages must be blind-shipped. Zero supplier branding, zero external invoices, zero Chinese/HK labels.'],
    ['In-Box Branding', 'We will provide digital assets for branded packing slips. Please confirm your ability to include one insert per parcel.'],
    ['Dispatch SLA', '48-72 hour dispatch for in-stock SKUs. For made-to-order items, please quote expected lead time per product.'],
    ['Order Consolidation', 'When a customer orders 3-6 items (routine bundle), pack all items into a SINGLE parcel. Do NOT ship separately per item.'],
    ['INCI Compliance', 'All products must ship with valid INCI Ingredient Lists in English to prevent Port Health seizures (R1,500/incident).'],
    ['SAHPRA', 'No banned substances per SAHPRA cosmetic ingredient schedule. Proper batch/lot numbers required for traceability.'],
    ['HS Code', 'Skincare falls under HS 3304 (Beauty/Skincare preparations) at ~20% MFN duty. Confirm classification per product.'],
    ['Customs Clearance', 'Prioritise shipping lines with established clearance channels to minimise per-parcel delays.'],
    ['Exchange Buffer', 'Include a 3% buffer for USD/ZAR volatility in all landed cost quotes.'],
    ['Insurance', 'Mandatory insurance on glass-bottled items, liquids >100ml, and all high-ticket items (>R2,000 retail).'],
    ['Payment Terms', 'All orders prepaid at time of placement via the Teemdrop platform.'],
    ['Secondary Address', 'Failed deliveries or consolidated shipments should route to: 17 Calendula Road, Malabar, 6020 Port Elizabeth.'],
    ['Communication', 'WhatsApp for urgent ops: +27 69 325 9748. Email for non-urgent/formal correspondence.'],
    ['Growth Path', 'As volume proves out (20+ orders/week), top sellers will transition from dropship to pre-purchased inventory.'],
  ];

  doc.fontSize(9).font(regular);
  notes.forEach(([title, desc]) => {
    if (doc.y > 720) doc.addPage();
    doc.font(bold).text(`${title}:`, { continued: true });
    doc.font(regular).text(`  ${desc}`);
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc.fontSize(8).fillColor('#888888')
    .text('© 2026 The Skin Boutique — South Africa\'s Premium K-Beauty Destination', { align: 'center' });
  doc.text('CONFIDENTIAL — Do not distribute without written permission.', { align: 'center' });

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log(`PDF Export complete: ${outputPath}`);
      resolve();
    });
  });
}

// ─── Main ────────────────────────────────────────────────────────
async function run() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR);
  }

  const rawProducts = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf-8'));
  const overrides = loadMarketOverrides();

  console.log(`Loaded ${overrides.length} market price overrides from SA market intel.`);

  // Apply market price adjustments
  let adjustedCount = 0;
  rawProducts.forEach(p => {
    const override = findOverride(p.name, overrides);
    if (override) {
      const oldPrice = p.price;
      p.price = override.adjustedRetail;
      p._saMarketPrice = override.saMarketPrice;
      p._priceNote = override.note;
      if (oldPrice !== p.price) {
        adjustedCount++;
      }
    }
  });

  console.log(`✅ Adjusted ${adjustedCount} product prices based on SA market intel.`);

  // Build category counts for popularity scoring
  const catCounts = {};
  rawProducts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  // Score and sort: Top 50 by popularity, rest by category
  const scored = rawProducts.map(p => ({
    ...p,
    _score: popularityScore(p, catCounts),
  }));

  scored.sort((a, b) => b._score - a._score);

  console.log(`\nGenerating exports for ${scored.length} products...`);
  console.log(`Top 5 by popularity:`);
  scored.slice(0, 5).forEach((p, i) => {
    const mktTag = p._saMarketPrice ? ` [SA Mkt: R${p._saMarketPrice}]` : '';
    console.log(`  ${i + 1}. ${p.brand} — ${p.name} → R${p.price}${mktTag} (score: ${p._score})`);
  });

  await generateCsv(scored);
  await generatePdf(scored);

  // Print adjustment summary
  const adjusted = scored.filter(p => p._saMarketPrice);
  if (adjusted.length > 0) {
    console.log(`\n📊 Market-adjusted products (${adjusted.length}):`);
    adjusted.slice(0, 10).forEach(p => {
      console.log(`  ${p.brand} — ${p.name}: R${p.price} (SA market: R${p._saMarketPrice})`);
    });
    if (adjusted.length > 10) console.log(`  ... and ${adjusted.length - 10} more.`);
  }

  console.log('\n✅ All exports generated in /exports directory.');
  console.log('📋 Files: catalog_full.csv + catalog_summary.pdf');
  console.log('🔍 New features: SA Market Price column, competitive repricing, high-ticket section.');
}

run();
