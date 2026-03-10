import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Check } from 'lucide-react';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies: { code: Currency; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
];

export default function CurrencyModal({ isOpen, onClose }: CurrencyModalProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-pastel-blue/20">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-ink-900" />
                <h2 className="text-xl font-serif font-semibold text-ink-900">Regional Settings</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-ink-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-ink-500 mb-6">
                Select your preferred currency. Prices will be updated across the store.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      currency === c.code 
                        ? 'border-pastel-blue-dark bg-pastel-blue/10' 
                        : 'border-ink-200 hover:border-pastel-blue-dark/50 hover:bg-ink-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        currency === c.code ? 'bg-pastel-blue-dark text-ink-900' : 'bg-ink-100 text-ink-600'
                      }`}>
                        {c.symbol}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold text-sm ${currency === c.code ? 'text-ink-900' : 'text-ink-700'}`}>
                          {c.code}
                        </p>
                        <p className="text-xs text-ink-500">{c.name}</p>
                      </div>
                    </div>
                    {currency === c.code && (
                      <Check className="w-5 h-5 text-pastel-blue-dark" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
