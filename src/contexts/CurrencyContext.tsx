import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'ZAR' | 'JPY' | 'RUB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  detectedCountry: string | null;
}

export const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  AUD: 1.52,
  ZAR: 18.95,
  JPY: 150.25,
  RUB: 92.50,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  ZAR: 'R',
  JPY: '¥',
  RUB: '₽',
};

// Map country codes to supported currencies
const countryCurrencyMap: Record<string, Currency> = {
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  AU: 'AUD',
  ZA: 'ZAR',
  JP: 'JPY',
  RU: 'RUB',
  // Eurozone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
  GR: 'EUR', SK: 'EUR', SI: 'EUR', LT: 'EUR', LV: 'EUR',
  EE: 'EUR', CY: 'EUR', MT: 'EUR', LU: 'EUR', HR: 'EUR',
};

const STORAGE_KEY = 'tsb_currency';
const COUNTRY_KEY = 'tsb_detected_country';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, otherwise default to USD
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in exchangeRates) return saved as Currency;
    return 'USD';
  });

  const [detectedCountry, setDetectedCountry] = useState<string | null>(
    () => localStorage.getItem(COUNTRY_KEY)
  );

  // Persist currency choice
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  };

  // Auto-detect on first ever visit (no saved preference)
  useEffect(() => {
    const hasSaved = localStorage.getItem(STORAGE_KEY);
    if (hasSaved) return; // User already has a preference, don't override

    const detect = async () => {
      try {
        // Free, no-key-required IP geolocation
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        if (!res.ok) return;
        const data = await res.json();
        const code = data.country_code as string;

        if (code) {
          setDetectedCountry(code);
          localStorage.setItem(COUNTRY_KEY, code);

          const mapped = countryCurrencyMap[code];
          if (mapped) {
            setCurrency(mapped);
          }
        }
      } catch {
        // Silently fail — user can still pick manually
      }
    };

    detect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatPrice = (priceInUSD: number) => {
    // Guard against NaN, undefined, null, or string values
    const safePriceInUSD = Number(priceInUSD);
    const validPrice = isNaN(safePriceInUSD) ? 0 : safePriceInUSD;
    const rate = exchangeRates[currency] || 1;
    const convertedPrice = validPrice * rate;
    
    // Always use ZAR symbol 'R' for ZAR currency
    if (currency === 'ZAR') {
      return `R${convertedPrice.toFixed(2)}`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, detectedCountry }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
