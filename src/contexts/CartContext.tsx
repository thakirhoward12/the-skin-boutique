import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  FREE_SHIPPING_THRESHOLD,
  calculateShipping,
  freeShippingRemaining,
  freeShippingProgress,
  getCartLeadTime,
  getLeadTimeLabel,
} from '../lib/pricingEngine';

export interface CartItem {
  id: string | number; // Product ID
  title: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
  supplierId?: 'teemdrop' | 'abw' | 'local';
  bundleId?: string;      // If part of a bundle purchase
  sourceUrl?: string;     // Source store URL for purchase ledger
  sourcePrice?: number;   // Cost at source for margin tracking
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  cartCount: number;
  cartTotal: number;
  shippingCost: number;
  orderTotal: number;
  freeShippingThreshold: number;
  freeShippingRemainingAmount: number;
  freeShippingProgressPercent: number;
  isFreeShipping: boolean;
  cartLeadTime: { min: number; max: number; label: string };
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCheckoutOpen(true);
    closeCart();
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    openCart();
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // ── Derived values from pricing engine ──
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const shippingCost = calculateShipping(cartTotal);
  const orderTotal = cartTotal + shippingCost;
  const freeShippingRemainingAmount = freeShippingRemaining(cartTotal);
  const freeShippingProgressPercent = freeShippingProgress(cartTotal);
  const isFreeShipping = freeShippingRemainingAmount <= 0;

  const cartLeadTime = useMemo(() => {
    const supplierIds = cartItems.map(item => item.supplierId);
    return getCartLeadTime(supplierIds);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        isCheckoutOpen,
        cartCount,
        cartTotal,
        shippingCost,
        orderTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemainingAmount,
        freeShippingProgressPercent,
        isFreeShipping,
        cartLeadTime,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
