import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Settings, Package, Percent, AlertCircle, Truck, Clock } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Product } from '../data/products';

interface SupplierManagementProps {
  products: Product[];
}

export default function SupplierManagement({ products }: SupplierManagementProps) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'orders')));
        setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Derive real brand/supplier stats from product data
  const supplierStats = useMemo(() => {
    const brandMap: Record<string, { count: number; categories: Set<string> }> = {};
    products.forEach(p => {
      if (!brandMap[p.brand]) {
        brandMap[p.brand] = { count: 0, categories: new Set() };
      }
      brandMap[p.brand].count++;
      brandMap[p.brand].categories.add(p.category);
    });

    return Object.entries(brandMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([brand, data]) => ({
        name: brand,
        products: data.count,
        categories: Array.from(data.categories).join(', '),
        status: 'Active',
      }));
  }, [products]);

  const totalBrands = useMemo(() => new Set(products.map(p => p.brand)).size, [products]);
  const totalCategories = useMemo(() => new Set(products.map(p => p.category)).size, [products]);
  const unfulfilledOrders = useMemo(() => orders.filter(o => o.status !== 'fulfilled' && o.status !== 'delivered').length, [orders]);

  const metrics = [
    { title: 'Active Suppliers', value: totalBrands.toString(), icon: Truck },
    { title: 'Total Products', value: products.length.toString(), icon: Package },
    { title: 'Pending Orders', value: unfulfilledOrders.toString(), icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-white border border-ink-100 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-ink-900">Supplier Management</h2>
          <p className="text-ink-500 mt-1 font-sans text-sm">Brand catalog and fulfillment overview.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-ink-50 border border-ink-200 text-ink-900 rounded-xl shadow-sm hover:bg-ink-100 transition-colors font-sans text-sm">
            <Settings className="w-4 h-4" />
            Configure Routing
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-xl shadow-sm hover:bg-ink-800 transition-colors font-sans text-sm">
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="p-8 bg-white border border-ink-100 rounded-2xl shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-pastel-pink flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-ink-700" />
              </div>
              <div>
                <p className="text-4xl font-serif text-ink-900">{metric.value}</p>
                <p className="text-xs font-sans text-ink-500 uppercase tracking-wider mt-2">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-ink-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50">
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Brand / Supplier</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Products</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Categories</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {supplierStats.map((supplier, idx) => (
                <tr key={idx} className="border-b border-ink-50 hover:bg-ink-50 transition-colors">
                  <td className="px-8 py-6 font-medium text-ink-900">{supplier.name}</td>
                  <td className="px-8 py-6 text-ink-900">{supplier.products}</td>
                  <td className="px-8 py-6 text-ink-500 text-xs">{supplier.categories}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-ink-500 ml-1">{supplier.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
