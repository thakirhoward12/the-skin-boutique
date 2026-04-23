import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { products as localProducts } from '../data/products';
import { type Product } from '../types';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Default to local products so the app doesn't break before migration
const ProductContext = createContext<ProductContextType>({ 
  products: localProducts, 
  isLoading: false,
  searchQuery: '',
  setSearchQuery: () => {}
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const jsonProducts = await response.json();
          setProducts(prev => {
            // Merge logic: prefer Firestore (loaded later) over JSON
            // But for now, just seed the state with JSON
            return jsonProducts;
          });
        }
      } catch (error) {
        console.warn("Failed to fetch products.json, waiting for Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();

    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            const rawPrice = Number(data.price);
            prods.push({
              ...data,
              price: isNaN(rawPrice) ? 0 : rawPrice,
              options: data.options ? data.options.map((opt: any) => ({
                ...opt,
                price: isNaN(Number(opt.price)) ? 0 : Number(opt.price)
              })) : undefined,
            } as Product);
          });
          setProducts(prods);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Firestore fetch error:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error setting up Firestore listener:", e);
      setIsLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading, searchQuery, setSearchQuery }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
