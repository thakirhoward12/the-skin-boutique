import React, { useMemo, useState, useEffect } from 'react';
import { Truck, Package, Clock, ShieldCheck, ExternalLink, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Product } from '../types';

interface Supplier {
  id: string;
  name: string;
  type: 'Dropship' | 'Wholesale' | 'Direct';
  status: 'active' | 'pending' | 'restricted';
  sla: string;
  revenue: number;
  orderCount: number;
}

const REAL_SUPPLIERS: Supplier[] = [
  { id: 'teemdrop', name: 'Teemdrop', type: 'Dropship', status: 'active', sla: '2-4 Days', revenue: 0, orderCount: 0 },
  { id: 'abw', name: 'AsianBeautyWholesale', type: 'Wholesale', status: 'active', sla: '5-8 Days', revenue: 0, orderCount: 0 },
  { id: 'kcosw', name: 'KCOSW', type: 'Wholesale', status: 'active', sla: '4-7 Days', revenue: 0, orderCount: 0 },
  { id: 'local', name: 'Local Warehouse', type: 'Direct', status: 'active', sla: '1-2 Days', revenue: 0, orderCount: 0 },
];

interface SupplierManagementProps {
  products: Product[];
}

export default function SupplierManagement({ products }: SupplierManagementProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch orders for supplier stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const supplierData = useMemo(() => {
    const stats: Record<string, { revenue: number, count: number }> = {
      teemdrop: { revenue: 0, count: 0 },
      abw: { revenue: 0, count: 0 },
      kcosw: { revenue: 0, count: 0 },
      local: { revenue: 0, count: 0 }
    };

    const eligibleOrders = orders.filter(o => o.status === 'paid' || o.status === 'processing' || o.status === 'confirmed' || o.status === 'fulfilled' || o.status === 'delivered');

    eligibleOrders.forEach(order => {
      const orderItems = order.items || [];
      const orderSuppliers = new Set<string>();

      orderItems.forEach((item: any) => {
        // Use supplierId from item, or fallback to product's supplierId
        const product = products.find(p => p.id === item.id || p.sku === item.sku);
        const sId = (item.supplierId || product?.supplierId || 'abw') as string;
        
        if (stats[sId]) {
          stats[sId].revenue += (item.price || 0) * (item.quantity || 1);
          orderSuppliers.add(sId);
        }
      });

      // Increment order count for each supplier involved in this order
      orderSuppliers.forEach(sId => {
        if (stats[sId]) stats[sId].count += 1;
      });
    });
    
    return REAL_SUPPLIERS.map(s => ({
      ...s,
      revenue: stats[s.id]?.revenue || 0,
      orderCount: stats[s.id]?.count || 0
    }));
  }, [orders, products]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ink-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-ink-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-ink-900">Logistics & Suppliers</h2>
          <p className="text-ink-500 mt-1">Manage fulfillment partners and sourcing channels.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-xl text-sm font-sans hover:bg-ink-800 transition-all">
            Connect Teemdrop
          </button>
        </div>
      </header>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {supplierData.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-[2rem] border border-ink-100 p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
             {/* Status Badge */}
             <div className="absolute top-8 right-8 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{supplier.status}</span>
             </div>

             <div className="flex items-start gap-6 mb-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${supplier.type === 'Dropship' ? 'bg-pastel-pink/20' : 'bg-pastel-blue/20'}`}>
                   <Truck className="w-8 h-8 text-ink-900" />
                </div>
                <div>
                   <h3 className="text-2xl font-serif text-ink-900 mb-1">{supplier.name}</h3>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400 bg-ink-50 px-2 py-0.5 rounded-md border border-ink-100/50">{supplier.type}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">SLA: {supplier.sla}</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 mb-8 pt-8 border-t border-ink-50">
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400 block mb-2">Processed Volume</span>
                   <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-pastel-pink-dark" />
                      <span className="text-2xl font-serif text-ink-900">{supplier.orderCount} <span className="text-sm font-sans text-ink-400 font-light">Orders</span></span>
                   </div>
                </div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400 block mb-2">Revenue Share</span>
                   <div className="flex items-center gap-2">
                      <span className="text-2xl font-serif text-ink-900">${supplier.revenue.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-ink-400 uppercase tracking-widest">
                   <Clock className="w-3.5 h-3.5" />
                   <span>Last Sync: 12m ago</span>
                </div>
                <button className="flex items-center gap-2 text-ink-900 text-sm font-medium hover:underline group">
                   Manage Integration
                   <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-ink-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
         <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <RefreshCw className="w-96 h-96 -rotate-12" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
               <AlertCircle className="w-6 h-6 text-pastel-pink" />
            </div>
            <h3 className="text-3xl font-serif mb-4">Auto-Fulfillment is vActive</h3>
            <p className="text-pastel-blue/80 font-light leading-relaxed mb-8">
               Orders are currently being synced to Shopify and intercepted by the **Teemdrop Shopify App**. Ensure your Teemdrop account has sufficient balance to prevent fulfillment delays.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pastel-pink block mb-1">Queue Status</span>
                  <span className="text-xl font-serif">Healthy (0 Pending)</span>
               </div>
               <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pastel-pink block mb-1">Last Transmission</span>
                  <span className="text-xl font-serif">Success</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
