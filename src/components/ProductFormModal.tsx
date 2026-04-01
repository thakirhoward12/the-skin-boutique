import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, ImageIcon } from 'lucide-react';
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Product } from '../data/products';
import { useCurrency, exchangeRates } from '../contexts/CurrencyContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null = add mode, Product = edit mode
  categories: string[];
}

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  price: string;
  image: string;
  description: string;
  ingredients: string;
}

const EMPTY: ProductFormData = {
  name: '',
  brand: '',
  category: '',
  price: '',
  image: '',
  description: '',
  ingredients: '',
};

export default function ProductFormModal({ isOpen, onClose, product, categories }: ProductFormModalProps) {
  const { currency, formatPrice } = useCurrency();
  const rate = exchangeRates[currency] || 1;
  const isEdit = !!product;

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form when modal opens / product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setForm({
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price.toString(),
          image: product.image,
          description: product.description,
          ingredients: product.ingredients,
        });
      } else {
        setForm(EMPTY);
      }
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen, product]);

  const set = (key: keyof ProductFormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitization guards
    const sanitizeStr = (str: string, maxLen: number) => str.trim().replace(/[<>]/g, '').slice(0, maxLen);
    
    const safeName = sanitizeStr(form.name, 150);
    const safeBrand = sanitizeStr(form.brand, 100);
    const safeCat = sanitizeStr(form.category, 50);
    const safeImg = form.image.trim().slice(0, 1000);
    const safeDesc = form.description.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 3000);
    const safeIngred = form.ingredients.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 3000);
    
    if (!safeName || !safeBrand || !safeCat || !form.price || !safeImg) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields with valid data.');
      return;
    }

    const finalPrice = parseFloat(form.price);
    if (isNaN(finalPrice) || finalPrice < 0 || finalPrice > 1000000) {
      setStatus('error');
      setErrorMsg('Invalid price value.');
      return;
    }

    setStatus('saving');
    setErrorMsg('');

    try {
      const data = {
        name: safeName,
        brand: safeBrand,
        category: safeCat,
        price: finalPrice,
        image: safeImg,
        description: safeDesc,
        ingredients: safeIngred,
      };

      if (isEdit && product) {
        // Update existing doc
        const ref = doc(db, 'products', product.id.toString());
        await updateDoc(ref, data);
      } else {
        // Create new doc — Firestore auto-generates the doc ID
        // Generate a numeric id based on timestamp for consistency with the Product interface
        const newId = Date.now();
        await addDoc(collection(db, 'products'), {
          ...data,
          id: newId,
          reviews: [],
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Firestore save error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to save. Check console.');
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-white/50 border border-ink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-pink-dark/40 focus:border-pastel-pink-dark transition-all font-light text-sm';
  const labelCls = 'text-xs font-medium text-ink-500 uppercase tracking-wider';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20 max-h-[90vh] flex flex-col"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-ink-500 hover:text-ink-900 transition-colors z-10 bg-white/50 rounded-full hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-10 overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-ink-900 mb-2">
                  {isEdit ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className="text-ink-500 font-light text-sm">
                  {isEdit
                    ? 'Update the product details below.'
                    : 'Fill in the details to add a new product to the catalog.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row: Name + Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className={inputCls}
                      placeholder="Snail Mucin Essence"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={e => set('brand', e.target.value)}
                      className={inputCls}
                      placeholder="COSRX"
                    />
                  </div>
                </div>

                {/* Row: Category + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={e => set('category', e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Price (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={e => set('price', e.target.value)}
                      className={inputCls}
                      placeholder="34.00"
                    />
                    {form.price && !isNaN(parseFloat(form.price)) && currency !== 'USD' && (
                      <p className="text-[10px] text-pastel-pink-dark font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                        Approx. {formatPrice(parseFloat(form.price))}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image URL + preview */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 items-start">
                    <input
                      type="text"
                      value={form.image}
                      onChange={e => set('image', e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="https://..."
                    />
                    <div className="w-16 h-16 rounded-xl border border-ink-100 bg-ink-50 flex items-center justify-center overflow-hidden shrink-0">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-ink-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder="A brief product description..."
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Ingredients</label>
                  <textarea
                    value={form.ingredients}
                    onChange={e => set('ingredients', e.target.value)}
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="Comma-separated ingredients"
                  />
                </div>

                {/* Error */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-red-500 bg-red-50/50 p-3 rounded-lg text-sm"
                  >
                    <p>{errorMsg}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'saving'}
                  className="w-full bg-ink-900 text-white py-4 rounded-xl hover:bg-ink-800 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {status === 'saving' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-light tracking-wide">Saving…</span>
                    </>
                  ) : (
                    <>
                      <span className="font-light tracking-wide uppercase text-sm">
                        {isEdit ? 'Update Product' : 'Add Product'}
                      </span>
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
