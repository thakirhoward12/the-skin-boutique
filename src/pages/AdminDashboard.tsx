import React, { useState, useMemo } from 'react';
import AdminOverview from '../components/AdminOverview';
import AdminSettings from '../components/AdminSettings';
import SupplierManagement from '../components/SupplierManagement';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import AdminProducts from '../components/AdminProducts';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useCurrency } from '../contexts/CurrencyContext';
import {
  LogOut,
  PackageSearch,
  Settings,
  Loader2,
  Upload,
  BarChart3,
  Package,
  Truck,
  LineChart,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { products as localProducts } from '../data/products';
import { type Product } from '../types';
import ProductFormModal from '../components/ProductFormModal';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { products, isLoading } = useProducts();
  const { formatPrice } = useCurrency();

  // Sidebar
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'suppliers' | 'analytics' | 'settings'>('overview');

  // Mass import
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Product form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Derived data for the modal
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products],
  );

  // ── Handlers ──────────────────────────────────────────────────
  
  // Robust Mass Import with Chunking (batches of 500)
  const handleImport = async () => {
    if (!window.confirm(`Import all ${localProducts.length} local products to Firebase? Existing products with the same ID will be overwritten.`)) return;
    
    setIsImporting(true);
    setImportStatus('Starting chunked import…');
    
    try {
      const ref = collection(db, 'products');
      const chunks: Product[][] = [];
      const CHUNK_SIZE = 450; // Safety margin below 500 limit
      
      for (let i = 0; i < localProducts.length; i += CHUNK_SIZE) {
        chunks.push(localProducts.slice(i, i + CHUNK_SIZE));
      }
      
      for (let i = 0; i < chunks.length; i++) {
        setImportStatus(`Importing batch ${i + 1}/${chunks.length}…`);
        const batch = writeBatch(db);
        chunks[i].forEach(p => {
          batch.set(doc(ref, p.id.toString()), p);
        });
        await batch.commit();
      }
      
      setImportStatus(`✓ Successfully imported ${localProducts.length} products`);
    } catch (err) {
      console.error('Import error:', err);
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

  // ── Render Helpers ─────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview products={products} />;
      case 'products':
        return (
          <AdminProducts 
            products={products}
            isLoading={isLoading}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        );
      case 'suppliers':
        return <SupplierManagement products={products} />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-ink-100 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-8 border-b border-ink-100">
          <h1 className="text-xl font-serif text-ink-900 tracking-tight">Admin Shell</h1>
          <p className="text-[10px] text-ink-400 font-bold uppercase tracking-widest mt-1">THE SKIN BOUTIQUE v3</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={BarChart3} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
            icon={PackageSearch} 
            label="Products" 
          />
          
          <div className="pt-2 pb-1 px-4">
            <div className="h-px bg-ink-100" />
          </div>

          <NavItem 
            active={activeTab === 'suppliers'} 
            onClick={() => setActiveTab('suppliers')} 
            icon={Truck} 
            label="Suppliers" 
          />
          <NavItem 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
            icon={LineChart} 
            label="Analytics" 
          />
          
          <div className="pt-2 pb-1 px-4">
            <div className="h-px bg-ink-100" />
          </div>

          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings} 
            label="Settings" 
          />

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full flex items-center gap-3 px-4 py-3 text-ink-500 hover:bg-ink-50 hover:text-ink-900 rounded-xl transition-all disabled:opacity-50 group font-sans text-sm"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            <span className="font-medium">{isImporting ? 'Syncing...' : 'Mass Import'}</span>
          </button>
        </nav>

        {/* User profile footer */}
        <div className="p-6 border-t border-ink-100 bg-white/50">
          {importStatus && (
            <p className={`text-[10px] font-bold px-3 py-2 rounded-lg mb-4 uppercase tracking-tighter ${importStatus.startsWith('✗') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
              {importStatus}
            </p>
          )}
          
          <div className="px-4 py-3 mb-4 bg-ink-50 rounded-2xl border border-ink-100/50">
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-bold mb-1">Authenticated</p>
            <p className="text-sm text-ink-900 truncate font-medium">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <main className="flex-1 p-10 overflow-y-auto bg-ivory-50/30">
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* ── Modals ───────────────────────────────────────────── */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
        active
          ? 'bg-ink-900 text-white shadow-xl shadow-ink-900/10'
          : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-pastel-pink' : ''}`} />
      <span className="font-sans text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pastel-pink" />}
    </button>
  );
}
