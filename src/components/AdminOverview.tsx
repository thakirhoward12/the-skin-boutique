import React, { useMemo, useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  Tag,
  Layers,
  TrendingUp,
  Star,
  DollarSign,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { type Product } from '../data/products';
import { useCurrency, exchangeRates } from '../contexts/CurrencyContext';

interface AdminOverviewProps {
  products: Product[];
}

// ── Helpers ───────────────────────────────────────────────────────
function parsePrice(price: string | number): number {
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

function getAvgRating(product: Product): number {
  if (!product.reviews || product.reviews.length === 0) return 0;
  return product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5"
    >
      <div className={`w-13 h-13 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink-900">{value}</p>
        <p className="text-xs text-ink-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Horizontal Bar ────────────────────────────────────────────────
function HBar({
  label,
  count,
  max,
  color,
  delay,
}: {
  key?: React.Key;
  label: string;
  count: number;
  max: number;
  color: string;
  delay: number;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-4"
    >
      <span className="w-32 text-sm text-ink-700 truncate text-right shrink-0">{label}</span>
      <div className="flex-1 h-7 bg-ink-50 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.15, duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="w-8 text-sm font-medium text-ink-900 text-right">{count}</span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function AdminOverview({ products }: AdminOverviewProps) {
  const { currency, formatPrice } = useCurrency();
  const rate = exchangeRates[currency] || 1;

  // ── Live Revenue Data ──
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'orders')));
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Only count legitimate completed transactions
        setOrders(fetched.filter(o => o.status === 'paid' || o.status === 'processing' || o.status === 'fulfilled' || o.paymentStatus === 'paid'));
      } catch (err) {
        console.error("Failed to fetch orders for revenue chart:", err);
      }
    };
    fetchOrders();
  }, []);

  const revenueData = useMemo(() => {
    if (orders.length === 0) return [];
    
    // Group by month
    const months: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize the last 6 months to 0 to establish the x-axis timeline
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
    }

    let hasActualData = false;

    orders.forEach(o => {
      let d = o.createdAt;
      if (d?.toDate) d = d.toDate();
      else if (typeof d === 'string' || typeof d === 'number') d = new Date(d);
      
      if (d instanceof Date && !isNaN(d.valueOf())) {
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        
        let orderTotal = 0;
        if (o.total) { 
           orderTotal = typeof o.total === 'number' ? o.total : parseFloat(o.total);
        } else if (o.items) { 
           o.items.forEach((item: any) => {
              const p = typeof item.price === 'number' ? item.price : parseFloat(item.price);
              const q = item.quantity || 1;
              if (!isNaN(p)) orderTotal += (p * q);
           });
        }
        
        if (months[key] !== undefined) {
           months[key] += orderTotal;
        } else {
           months[key] = orderTotal;
        }
        hasActualData = true;
      }
    });

    if (!hasActualData) return []; // Tell UI that no real orders exist yet

    return Object.keys(months).map(k => ({
      name: k,
      Revenue: months[k] * rate
    }));
  }, [orders, rate]);

  // ── Derived analytics ──
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products],
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand))),
    [products],
  );

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const brandCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.brand] = (map[p.brand] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const prices = useMemo(() => products.map(p => parsePrice(p.price)).filter(p => p > 0), [products]);
  const avgPrice = useMemo(() => (prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0), [prices]);
  const maxPrice = useMemo(() => Math.max(...prices, 0), [prices]);
  const minPrice = useMemo(() => (prices.length > 0 ? Math.min(...prices) : 0), [prices]);

  // Price range buckets
  const priceBuckets = useMemo(() => {
    const buckets = [
      { label: `${formatPrice(0)}–${formatPrice(99 / rate)}`.replace(/\.00/g, ''), min: 0, max: 99 / rate, count: 0, color: 'bg-emerald-400' },
      { label: `${formatPrice(100 / rate)}–${formatPrice(249 / rate)}`.replace(/\.00/g, ''), min: 100 / rate, max: 249 / rate, count: 0, color: 'bg-sky-400' },
      { label: `${formatPrice(250 / rate)}–${formatPrice(499 / rate)}`.replace(/\.00/g, ''), min: 250 / rate, max: 499 / rate, count: 0, color: 'bg-violet-400' },
      { label: `${formatPrice(500 / rate)}–${formatPrice(999 / rate)}`.replace(/\.00/g, ''), min: 500 / rate, max: 999 / rate, count: 0, color: 'bg-amber-400' },
      { label: `${formatPrice(1000 / rate)}+`.replace(/\.00/g, ''), min: 1000 / rate, max: Infinity, count: 0, color: 'bg-rose-400' },
    ];
    prices.forEach(p => {
      const b = buckets.find(b => p >= b.min && p <= b.max);
      if (b) b.count++;
    });
    return buckets;
  }, [prices, rate, formatPrice]);

  // Top rated products
  const topRated = useMemo(() => {
    return [...products]
      .filter(p => p.reviews && p.reviews.length > 0)
      .sort((a, b) => getAvgRating(b) - getAvgRating(a))
      .slice(0, 5);
  }, [products]);

  // Most expensive products
  const mostExpensive = useMemo(() => {
    return [...products].sort((a, b) => parsePrice(b.price) - parsePrice(a.price)).slice(0, 5);
  }, [products]);

  const maxCatCount = categoryCounts.length > 0 ? categoryCounts[0][1] : 1;
  const maxBrandCount = brandCounts.length > 0 ? brandCounts[0][1] : 1;
  const maxBucketCount = Math.max(...priceBuckets.map(b => b.count), 1);

  const catColors = [
    'bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-violet-400',
    'bg-pink-400', 'bg-teal-400', 'bg-orange-400', 'bg-indigo-400', 'bg-lime-400',
    'bg-fuchsia-400', 'bg-cyan-400',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-serif text-ink-900">Dashboard</h2>
        <p className="text-ink-500 mt-1">Catalog analytics and product insights at a glance.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={LayoutGrid} label="Total Products" value={products.length} accent="bg-pastel-pink text-ink-700" delay={0} />
        <StatCard icon={Layers} label="Categories" value={categories.length} accent="bg-pastel-blue text-ink-700" delay={0.05} />
        <StatCard icon={Tag} label="Brands" value={brands.length} accent="bg-pastel-green text-ink-700" delay={0.1} />
        <StatCard icon={DollarSign} label="Avg Price" value={formatPrice(avgPrice)} accent="bg-pastel-peach text-ink-700" delay={0.15} />
      </div>

      {/* Live Revenue Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-white rounded-2xl border border-ink-100 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Live Monthly Revenue</h3>
        </div>
        
        {revenueData.length === 0 ? (
            <div className="h-[300px] flex flex-col justify-center items-center text-ink-400 bg-ink-50/50 rounded-xl border border-dashed border-ink-200">
                <BarChart3 className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm font-medium text-ink-600">No order data yet.</p>
                <p className="text-xs mt-1">Revenue tracker will activate upon the first completed order.</p>
            </div>
        ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    tickFormatter={(val) => formatPrice(val / rate)} 
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#F472B6', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [formatPrice(value / rate), 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#F472B6" 
                    strokeWidth={3}
                    dot={{ fill: '#F472B6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#BE185D', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
        )}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl border border-ink-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-ink-400" />
            <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Products by Category</h3>
          </div>
          <div className="space-y-3">
            {categoryCounts.map(([cat, count], i) => (
              <HBar
                key={cat}
                label={cat}
                count={count}
                max={maxCatCount}
                color={catColors[i % catColors.length]}
                delay={0.25 + i * 0.03}
              />
            ))}
          </div>
        </motion.div>

        {/* Price Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-white rounded-2xl border border-ink-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-ink-400" />
            <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Price Distribution</h3>
          </div>
          <div className="space-y-3 mb-8">
            {priceBuckets.map((b, i) => (
              <HBar
                key={b.label}
                label={b.label}
                count={b.count}
                max={maxBucketCount}
                color={b.color}
                delay={0.3 + i * 0.05}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink-100">
            <div className="text-center">
              <p className="text-lg font-semibold text-ink-900">{formatPrice(minPrice)}</p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Cheapest</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-ink-900">{formatPrice(avgPrice)}</p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Average</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-ink-900">{formatPrice(maxPrice)}</p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Highest</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Top brands + Top rated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Brands */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-ink-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-4 h-4 text-ink-400" />
            <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Top Brands</h3>
          </div>
          <div className="space-y-3">
            {brandCounts.slice(0, 10).map(([brand, count], i) => (
              <HBar
                key={brand}
                label={brand}
                count={count}
                max={maxBrandCount}
                color={catColors[(i + 3) % catColors.length]}
                delay={0.35 + i * 0.03}
              />
            ))}
          </div>
        </motion.div>

        {/* Top Rated + Most Expensive */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white rounded-2xl border border-ink-100 p-6 flex flex-col"
        >
          {/* Top Rated */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Top Rated</h3>
            </div>
            {topRated.length > 0 ? (
              <div className="space-y-3">
                {topRated.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-ink-50 border border-ink-100 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-900 font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-ink-500 uppercase tracking-wider">{p.brand}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-ink-900">{getAvgRating(p).toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400 italic">No reviews yet.</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-ink-100 my-5" />

          {/* Most Expensive */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-5">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-ink-900 uppercase tracking-wider">Highest Priced</h3>
            </div>
            <div className="space-y-3">
              {mostExpensive.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-ink-50 border border-ink-100 shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-900 font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-ink-500 uppercase tracking-wider">{p.brand}</p>
                  </div>
                    <span className="text-sm font-semibold text-ink-900 shrink-0">{formatPrice(p.price)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
