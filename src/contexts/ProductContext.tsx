import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { products as localProducts, type Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
}

// Default to local products so the app doesn't break before migration
const ProductContext = createContext<ProductContextType>({ products: localProducts, isLoading: false });

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const prods: Product[] = [];
          snapshot.forEach(doc => {
            prods.push(doc.data() as Product);
          });
          setProducts(prods);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Firestore fetch error, using local products fallback:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error setting up Firestore listener:", e);
      setIsLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
