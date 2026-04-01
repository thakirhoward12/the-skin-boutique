import React from 'react';
import { Plus, Settings, Package, Percent, AlertCircle } from 'lucide-react';

export default function SupplierManagement() {
  const metrics = [
    { title: 'Total Unfulfilled Orders', value: '142', icon: Package },
    { title: 'Global Fulfillment Ratio', value: '94.2%', icon: Percent },
    { title: 'Webhook API Errors', value: '3', icon: AlertCircle },
  ];

  const suppliers = [
    { name: 'Teemdrop', contact: 'api@teemdrop.com', sla: '2.4 Days', margin: '68%', sync: '5m ago' },
    { name: 'Local Warehouse', contact: 'ops@localwh.co.za', sla: '1.1 Days', margin: '42%', sync: '1m ago' },
    { name: 'Ethereal Botanical Co.', contact: 'supply@ethereal.kr', sla: '4.8 Days', margin: '75%', sync: '12m ago' },
  ];

  return (
    <div className="space-y-8 p-6 sm:p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-ink-900">Supplier Management</h2>
          <p className="text-ink-500 mt-1 font-sans text-sm">Manage fulfillment partners and routing rules.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 text-ink-900 rounded-xl shadow-sm hover:bg-white/80 transition-colors font-sans text-sm">
            <Settings className="w-4 h-4" />
            Configure Routing Rules
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity font-sans text-sm">
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm flex items-center gap-6">
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

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-white/40 bg-white/40">
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Supplier Name</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Avg SLA</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Profit Margin</th>
                <th className="px-8 py-6 text-xs font-semibold text-ink-500 uppercase tracking-wider">Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, idx) => (
                <tr key={idx} className="border-b border-white/20 hover:bg-white/40 transition-colors">
                  <td className="px-8 py-6 font-medium text-ink-900">{supplier.name}</td>
                  <td className="px-8 py-6 text-ink-500">{supplier.contact}</td>
                  <td className="px-8 py-6 text-ink-900">{supplier.sla}</td>
                  <td className="px-8 py-6 text-ink-900">{supplier.margin}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-ink-500 ml-1">{supplier.sync}</span>
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
