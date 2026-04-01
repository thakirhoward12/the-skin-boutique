import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  ExternalLink, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Eye,
  Mail,
  CreditCard,
  MapPin,
  Calendar,
  Filter
} from 'lucide-react';
import { useOrders, Order, OrderStatus } from '../contexts/OrderContext';
import { useCurrency } from '../contexts/CurrencyContext';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  shipped: 'bg-pastel-pink text-ink-700 border-pastel-pink-dark/20',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  paid: CheckCircle2,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export default function AdminOrders() {
  const { orders, isLoading, updateOrderStatus } = useOrders();
  const { formatPrice } = useCurrency();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-ink-100 border-t-pastel-pink-dark rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-ink-900">Orders</h2>
          <p className="text-ink-500 mt-1">Manage customer orders and fulfillment status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search by order # or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 focus:border-pastel-pink-dark text-sm font-light transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="relative inline-block">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-11 pr-10 py-3 bg-white border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 appearance-none text-sm font-light shadow-sm cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Order No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-500">
                    <Package className="w-12 h-12 text-ink-100 mx-auto mb-3" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-ink-50 hover:bg-ink-50/40 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-ink-900">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink-900">{order.customerEmail.split('@')[0]}</span>
                        <span className="text-xs text-ink-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {order.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-500">
                      {new Date(order.createdAt instanceof Date ? order.createdAt : (order.createdAt as any).toDate()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-ink-900">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                        {React.createElement(statusIcons[order.status], { className: "w-3 h-3" })}
                        {order.status.charAt(0)?.toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-pastel-pink/20 text-ink-400 hover:text-ink-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-serif text-ink-900 mb-2">Order Details</h2>
                    <p className="text-sm font-mono text-ink-500">{selectedOrder.orderNumber}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-ink-50 rounded-full transition-colors">
                    <XCircle className="w-6 h-6 text-ink-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-ink-50 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-1">Status</p>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className={`w-full bg-transparent font-medium focus:outline-none cursor-pointer ${statusColors[selectedOrder.status].replace('bg-', 'text-')}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="p-4 bg-ink-50 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-1">Customer</p>
                    <p className="font-medium text-ink-900 truncate">{selectedOrder.customerEmail}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-ink-400">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-ink-100" />
                        <div className="flex-1">
                          <p className="font-medium text-ink-900 line-clamp-1">{item.title}</p>
                          <p className="text-sm text-ink-400">{item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="font-medium text-ink-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-ink-100 space-y-3">
                  <div className="flex justify-between text-sm text-ink-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-500">
                    <span>Shipping</span>
                    <span>{formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-ink-900 pt-3 border-t border-ink-50">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-ink-700 p-4 bg-pastel-pink/10 rounded-2xl border border-pastel-pink/20">
                    <CreditCard className="w-5 h-5 text-pastel-pink-dark" />
                    <span>Paid via <strong>{selectedOrder.paymentMethod.toUpperCase()}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-ink-700 p-4 bg-ink-50 rounded-2xl border border-ink-100">
                    <Calendar className="w-5 h-5 text-ink-400" />
                    <span>Last updated: <strong>{new Date(selectedOrder.updatedAt instanceof Date ? selectedOrder.updatedAt : (selectedOrder.updatedAt as any).toDate()).toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
