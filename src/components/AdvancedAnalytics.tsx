import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, RefreshCcw, Activity } from 'lucide-react';

export default function AdvancedAnalytics() {
  const coreMetrics = [
    { title: 'Total Sales', value: '$124,500', icon: DollarSign },
    { title: 'Conversion Rate', value: '3.2%', icon: TrendingUp },
    { title: 'Average Order Value', value: '$185', icon: ShoppingCart },
    { title: 'Returning Customer Rate', value: '42%', icon: RefreshCcw },
  ];

  const topSuppliers = [
    { name: 'Ethereal Botanical Co.', revenue: '$68,200', sla: '4.8 Days' },
    { name: 'Teemdrop', revenue: '$42,100', sla: '2.4 Days' },
    { name: 'Local Warehouse', revenue: '$14,200', sla: '1.1 Days' },
  ];

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hero Widget */}
        <div className="lg:w-1/3 p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-sans font-semibold text-ink-500 uppercase tracking-wider">Live Site Visitors</h3>
          </div>
          <p className="text-7xl font-serif text-ink-900 mb-2">342</p>
          <p className="text-sm font-sans text-ink-400">Active Now</p>
        </div>

        {/* Core Metrics Grid */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {coreMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-pastel-blue flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-ink-700" />
                </div>
                <div>
                  <p className="text-3xl font-serif text-ink-900">{metric.value}</p>
                  <p className="text-xs font-sans text-ink-500 uppercase tracking-wider mt-2">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-10">
          <Activity className="w-5 h-5 text-ink-400" />
          <h3 className="text-sm font-sans font-semibold text-ink-900 uppercase tracking-wider">Monthly Unique Visitors</h3>
        </div>
        <div className="h-64 flex items-end gap-2 sm:gap-4">
          {/* Mock Area Chart using divs */}
          {[40, 55, 45, 70, 65, 85, 75, 90, 80, 95, 85, 100].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col justify-end h-full group">
              <div 
                className="w-full bg-pastel-pink-dark/30 rounded-t-sm group-hover:bg-pastel-pink-dark/60 transition-colors relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-1 left-0 right-0 h-1 bg-pastel-pink-dark rounded-t-sm" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 text-xs font-sans text-ink-400 uppercase tracking-wider">
          <span>Jan</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
        <h3 className="text-sm font-sans font-semibold text-ink-900 uppercase tracking-wider mb-8">Top Performing Suppliers</h3>
        <div className="space-y-4">
          {topSuppliers.map((supplier, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 rounded-xl border border-white/20 hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-5 mb-4 sm:mb-0">
                <div className="w-10 h-10 rounded-full bg-ink-50 flex items-center justify-center font-serif text-ink-500 text-sm">
                  {idx + 1}
                </div>
                <span className="font-sans font-medium text-ink-900 text-lg">{supplier.name}</span>
              </div>
              <div className="flex items-center gap-10 font-sans text-sm">
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-ink-400 uppercase tracking-wider mb-1">Revenue</span>
                  <span className="font-medium text-ink-900 text-lg">{supplier.revenue}</span>
                </div>
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-ink-400 uppercase tracking-wider mb-1">Avg SLA</span>
                  <span className="font-medium text-ink-900 text-lg">{supplier.sla}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
