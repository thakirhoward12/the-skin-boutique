import React, { useState, useMemo } from 'react';
import AdminOverview from '../components/AdminOverview';
import AdminOrders from '../components/AdminOrders';
import AdminSettings from '../components/AdminSettings';
import SupplierManagement from '../components/SupplierManagement';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useCurrency } from '../contexts/CurrencyContext';
import {
  LogOut,
  PackageSearch,
  Settings,
  Plus,
  Loader2,
  Search,
  Pencil,
  Trash2,
  Upload,
  LayoutGrid,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Package,
  Truck,
  LineChart,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { products as localProducts, type Product } from '../data/products';
import ProductFormModal from '../components/ProductFormModal';

const PAGE_SIZE = 12;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { products, isLoading } = useProducts();
  const { formatPrice } = useCurrency();

  // Sidebar
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'suppliers' | 'analytics' | 'settings'>('overview');

  // Mass import
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Search & filter
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Pagination
  const [page, setPage] = useState(1);

  // Product form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Derived data ──────────────────────────────────────────────
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products],
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand))),
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCategory !== 'All') list = list.filter(p => p.category === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, filterCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useMemo(() => setPage(1), [filterCategory, search]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleImport = async () => {
    if (!window.confirm('Import all local products to Firebase? Existing products with the same ID will be overwritten.')) return;
    setIsImporting(true);
    setImportStatus('Starting import…');
    try {
      const ref = collection(db, 'products');
      const batch = writeBatch(db);
      localProducts.forEach(p => batch.set(doc(ref, p.id.toString()), p));
      await batch.commit();
      setImportStatus(`✓ Imported ${localProducts.length} products`);
    } catch (err) {
      console.error(err);
      setImportStatus('✗ Import failed — check console');
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportStatus(null), 5000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete. Check the console.');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-ink-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-ink-100">
          <h1 className="text-xl font-serif text-ink-900">Admin Panel</h1>
          <p className="text-sm text-ink-500 font-light mt-1">The Skin Boutique</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-pastel-pink/20 text-ink-900'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-pastel-pink/20 text-ink-900'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            <PackageSearch className="w-5 h-5" />
            Products
          </button>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full flex items-center gap-3 px-4 py-3 text-ink-500 hover:bg-ink-50 hover:text-ink-900 rounded-xl transition-colors disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {isImporting ? 'Importing…' : 'Mass Import'}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-pastel-pink text-ink-900 shadow-sm' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-700'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'suppliers'
                ? 'bg-pastel-pink/20 text-ink-900'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            <Truck className="w-5 h-5" />
            Suppliers
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-pastel-pink/20 text-ink-900'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            <LineChart className="w-5 h-5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-pastel-pink/20 text-ink-900'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        {/* Import toast */}
        {importStatus && (
          <div className="px-4 pb-2">
            <p className={`text-xs font-medium px-4 py-2 rounded-xl ${importStatus.startsWith('✗') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {importStatus}
            </p>
          </div>
        )}

        <div className="p-4 border-t border-ink-100">
          <div className="px-4 py-3 mb-2 bg-ink-50 rounded-xl">
            <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold mb-1">Logged in as</p>
            <p className="text-sm text-ink-900 truncate font-medium">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' ? (
          <AdminOverview products={products} />
        ) : activeTab === 'products' ? (
        <>
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-serif text-ink-900">Products</h2>
            <p className="text-ink-500 mt-1">Manage your catalog, pricing, and inventory.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-xl hover:bg-ink-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-ink-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-ink-700" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-900">{products.length}</p>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Total Products</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-ink-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-ink-700" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-900">{categories.length}</p>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Categories</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-ink-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-pastel-green rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-ink-700" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-900">{brands.length}</p>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Brands</p>
            </div>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search products, brands…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 focus:border-pastel-pink-dark text-sm font-light transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-white border border-ink-100 text-ink-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 appearance-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-ink-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-ink-100 p-16 text-center">
            <PackageSearch className="w-12 h-12 text-ink-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ink-900 mb-2">No products found</h3>
            <p className="text-ink-500 max-w-sm mx-auto">
              {products.length === 0
                ? 'Your catalog is empty. Click "Mass Import" to load your local inventory, or add products manually.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 bg-ink-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider w-16" />
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(product => (
                      <tr
                        key={product.id}
                        className="border-b border-ink-50 hover:bg-ink-50/40 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <td className="px-6 py-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-ink-50 border border-ink-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>
                        {/* Name */}
                        <td className="px-6 py-3">
                          <span className="font-medium text-ink-900 line-clamp-1">{product.name}</span>
                        </td>
                        {/* Brand */}
                        <td className="px-6 py-3 text-ink-500">{product.brand}</td>
                        {/* Category */}
                        <td className="px-6 py-3">
                          <span className="inline-block bg-pastel-pink text-ink-700 text-xs font-medium px-3 py-1 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="px-6 py-3 text-ink-900 font-medium">{formatPrice(product.price)}</td>
                        {/* Actions */}
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-2 rounded-lg hover:bg-pastel-blue text-ink-500 hover:text-ink-900 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                  handleDelete(product.id.toString());
                                }
                              }}
                              disabled={deletingId === product.id.toString()}
                              className="p-2 rounded-lg hover:bg-red-50 text-ink-500 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId === product.id.toString() ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-ink-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                  {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-ink-100 hover:bg-ink-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        n === page
                          ? 'bg-ink-900 text-white'
                          : 'text-ink-500 hover:bg-ink-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-ink-100 hover:bg-ink-50 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </>
        ) : activeTab === 'orders' ? (
          <AdminOrders />
        ) : activeTab === 'suppliers' ? (
          <SupplierManagement products={products} />
        ) : activeTab === 'analytics' ? (
          <AdvancedAnalytics />
        ) : activeTab === 'settings' ? (
          <AdminSettings />
        ) : null}
      </main>

      {/* ── Product Form Modal ───────────────────────────────── */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}
