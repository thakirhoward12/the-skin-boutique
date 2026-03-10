import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'ZAR' | 'JPY' | 'RUB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: string | number) => string;
}

const exchangeRates: Record<Currency, number> = {
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

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = (priceInUSD: string | number) => {
    let numericPrice = 0;
    if (typeof priceInUSD === 'string') {
      numericPrice = parseFloat(priceInUSD.replace(/[^0-9.]/g, ''));
    } else {
      numericPrice = priceInUSD;
    }

    const convertedPrice = numericPrice * exchangeRates[currency];
    return `${currencySymbols[currency]}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
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
