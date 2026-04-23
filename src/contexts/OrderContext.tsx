import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { generatePurchaseLedger } from '../lib/purchaseLedger';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
  supplierId?: 'teemdrop' | 'abw' | 'local';
  sourceUrl?: string;
  sourcePrice?: number;
  bundleId?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string; // Firestore doc ID
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  customerEmail: string;
  customerName?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentReference?: string;
  shopifySyncStatus?: 'success' | 'failed';
  shopifySyncError?: string;
  shopifyOrderId?: string | number;
  shopifySyncTimestamp?: Timestamp | Date;
  purchaseLedgerStatus?: 'pending' | 'generated' | 'fulfilled';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'shopifySyncStatus' | 'shopifySyncError' | 'shopifyOrderId' | 'shopifySyncTimestamp'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate a short human-readable order number
function generateOrderNumber(): string {
  const prefix = 'TSB';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Deep scrub any undefined values to prevent Firestore crashes
function scrubUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(scrubUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, scrubUndefined(v)])
    );
  }
  return obj;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    try {
      // Only listen to orders if we are an admin or in admin-related components
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'thakirah.parker@gmail.com';
      
      unsubscribe = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), 
        (snapshot) => {
          const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Order[];
          setOrders(data);
          setIsLoading(false);
        }, 
        (error) => {
          console.log('Order listener access restricted (intended behavior for guests)');
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to initialize order listener:', error);
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const now = Timestamp.now();
    const scrubbed = scrubUndefined({
      ...orderData,
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
    });
    
    const docRef = await addDoc(collection(db, 'orders'), scrubbed);
    const orderId = docRef.id;

    // Auto-generate purchase ledger if the order is paid
    if (orderData.status === 'paid') {
      try {
        await generatePurchaseLedger({
          id: orderId,
          orderNumber: scrubbed.orderNumber,
          items: orderData.items,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          shippingAddress: orderData.shippingAddress,
        });
        // Mark ledger as generated
        await updateDoc(doc(db, 'orders', orderId), {
          purchaseLedgerStatus: 'generated',
        });
      } catch (error) {
        console.error('Failed to generate purchase ledger:', error);
        // Non-blocking — order still succeeds
      }
    }

    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: Timestamp.now(),
    });
  };

  return (
    <OrderContext.Provider value={{ orders, isLoading, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
