import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'ZAR' | 'JPY' | 'RUB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInZAR: number) => string;
  detectedCountry: string | null;
  exchangeRate: number; // Current rate for active currency
  zarRate: number;      // Deprecated technically, but kept for compat
  isLiveRate: boolean;  // Whether we're using live or fallback rates
  lastRateUpdate: string | null;
}

// Fallback rates — used if live fetch fails (Base: ZAR)
const FALLBACK_RATES: Record<Currency, number> = {
  ZAR: 1,
  USD: 0.053, // ~1/18.95
  EUR: 0.049,
  GBP: 0.042,
  CAD: 0.071,
  AUD: 0.080,
  JPY: 7.93,
  RUB: 4.88,
};

// Export for backward compatibility — will be updated with live rates
export let exchangeRates: Record<Currency, number> = { ...FALLBACK_RATES };

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
const RATES_CACHE_KEY = 'tsb_exchange_rates';
const RATES_TIMESTAMP_KEY = 'tsb_rates_timestamp';
const RATE_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/**
 * Fetch live exchange rates from the free exchangerate-api.
 * Falls back to cached rates, then to hardcoded fallbacks.
 */
async function fetchLiveRates(): Promise<{ rates: Record<Currency, number>; isLive: boolean; timestamp: string }> {
  // Check cache first
  try {
    const cachedRates = localStorage.getItem(RATES_CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
    
    if (cachedRates && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp, 10);
      if (age < RATE_CACHE_DURATION) {
        const parsed = JSON.parse(cachedRates);
        return { rates: parsed, isLive: true, timestamp: new Date(parseInt(cachedTimestamp, 10)).toISOString() };
      }
    }
  } catch {
    // Cache read failed, continue to fetch
  }

  // Fetch live rates (Base: ZAR)
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR', {
      signal: AbortSignal.timeout(5000),
    });
    
    if (!res.ok) throw new Error(`Rate API returned ${res.status}`);
    
    const data = await res.json();
    const liveRates: Record<Currency, number> = {
      ZAR: 1,
      USD: data.rates?.USD ?? FALLBACK_RATES.USD,
      EUR: data.rates?.EUR ?? FALLBACK_RATES.EUR,
      GBP: data.rates?.GBP ?? FALLBACK_RATES.GBP,
      CAD: data.rates?.CAD ?? FALLBACK_RATES.CAD,
      AUD: data.rates?.AUD ?? FALLBACK_RATES.AUD,
      JPY: data.rates?.JPY ?? FALLBACK_RATES.JPY,
      RUB: data.rates?.RUB ?? FALLBACK_RATES.RUB,
    };
    
    // Cache the result
    const now = Date.now();
    try {
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(liveRates));
      localStorage.setItem(RATES_TIMESTAMP_KEY, now.toString());
    } catch {
      // localStorage full or unavailable — non-critical
    }
    
    return { rates: liveRates, isLive: true, timestamp: new Date(now).toISOString() };
  } catch {
    // API failed — use fallback
    return { rates: FALLBACK_RATES, isLive: false, timestamp: null as any };
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, otherwise default to ZAR
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in FALLBACK_RATES) return saved as Currency;
    return 'ZAR';
  });

  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);
  const [isLiveRate, setIsLiveRate] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<string | null>(null);

  const [detectedCountry, setDetectedCountry] = useState<string | null>(
    () => localStorage.getItem(COUNTRY_KEY)
  );

  // Fetch live exchange rates on mount
  useEffect(() => {
    fetchLiveRates().then(({ rates: liveRates, isLive, timestamp }) => {
      setRates(liveRates);
      setIsLiveRate(isLive);
      setLastRateUpdate(timestamp);
      // Update the module-level export for backward compatibility
      exchangeRates = liveRates;
    });
  }, []);

  // Persist currency choice
  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

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

  const formatPrice = useCallback((priceInZAR: number) => {
    // Guard against NaN, undefined, null, or string values
    const safePriceInZAR = Number(priceInZAR);
    const validPrice = isNaN(safePriceInZAR) ? 0 : safePriceInZAR;
    
    // In ZAR mode, we just show the base price
    if (currency === 'ZAR') {
      return `R${validPrice.toFixed(2)}`;
    }

    const rate = rates[currency] || 1;
    const convertedPrice = validPrice * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(convertedPrice);
  }, [currency, rates]);

  const exchangeRate = rates[currency] || 1;
  const zarRate = 1; // Base is now ZAR

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice, 
      detectedCountry, 
      exchangeRate, 
      zarRate,
      isLiveRate,
      lastRateUpdate,
    }}>
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
