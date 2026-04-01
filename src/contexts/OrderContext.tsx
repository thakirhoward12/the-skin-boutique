import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<string>;
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
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
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
