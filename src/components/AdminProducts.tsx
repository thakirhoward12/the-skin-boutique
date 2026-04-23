import React, { useState, useMemo } from 'react';
import {
  PackageSearch,
  Plus,
  Loader2,
  Search,
  Pencil,
  Trash2,
  LayoutGrid,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { type Product } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

const PAGE_SIZE = 12;

interface AdminProductsProps {
  products: Product[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export default function AdminProducts({
  products,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  deletingId,
}: AdminProductsProps) {
  const { formatPrice } = useCurrency();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterCategory !== 'All') list = list.filter((p) => p.category === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, filterCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useMemo(() => setPage(1), [filterCategory, search]);

  return (
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-ink-900">Products</h2>
          <p className="text-ink-500 mt-1">Manage your catalog, pricing, and inventory.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-xl hover:bg-ink-800 transition-colors shadow-sm font-sans text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-pastel-pink rounded-xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-ink-700" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink-900">{products.length}</p>
            <p className="text-[10px] text-ink-500 uppercase tracking-widest font-semibold">Total Products</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-pastel-blue rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-ink-700" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink-900">{categories.length}</p>
            <p className="text-[10px] text-ink-500 uppercase tracking-widest font-semibold">Categories</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-ink-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-pastel-green rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-ink-700" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink-900">{brands.length}</p>
            <p className="text-[10px] text-ink-500 uppercase tracking-widest font-semibold">Brands</p>
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 focus:border-pastel-pink-dark text-sm font-light transition-all shadow-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-ink-100 text-ink-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 appearance-none shadow-sm cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
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
          <h3 className="text-lg font-medium text-ink-900 mb-2 font-serif">No products found</h3>
          <p className="text-ink-500 max-w-sm mx-auto font-light leading-relaxed">
            {products.length === 0
              ? 'Your catalog is empty. Click "Mass Import" to load your local inventory, or add products manually.'
              : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-ink-100 bg-ink-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest w-16" />
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest">Brand</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors group"
                    >
                      {/* Thumbnail */}
                      <td className="px-6 py-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-ink-100 shadow-sm">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      {/* Name */}
                      <td className="px-6 py-3">
                        <span className="font-medium text-ink-900 line-clamp-1 truncate max-w-[200px]">{product.name}</span>
                      </td>
                      {/* Brand */}
                      <td className="px-6 py-3 text-ink-500 font-light italic">{product.brand}</td>
                      {/* Category */}
                      <td className="px-6 py-3">
                        <span className="inline-block bg-pastel-pink/30 text-ink-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-3 text-ink-900 font-medium">{formatPrice(product.price)}</td>
                      {/* Actions */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(product)}
                            className="p-2.5 rounded-xl hover:bg-pastel-blue text-ink-500 hover:text-ink-900 transition-colors shadow-sm border border-transparent hover:border-pastel-blue-dark/20"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                onDelete(product.id);
                              }
                            }}
                            disabled={deletingId === product.id}
                            className="p-2.5 rounded-xl hover:bg-red-50 text-ink-500 hover:text-red-600 transition-colors disabled:opacity-50 shadow-sm border border-transparent hover:border-red-200"
                            title="Delete"
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
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
            <div className="flex items-center justify-between mt-8 pb-8">
              <p className="text-xs text-ink-400 font-light uppercase tracking-widest">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-ink-100 bg-white hover:bg-ink-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        n === page
                          ? 'bg-ink-900 text-white'
                          : 'bg-white text-ink-500 hover:bg-ink-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl border border-ink-100 bg-white hover:bg-ink-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
