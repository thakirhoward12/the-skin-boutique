import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
const StoreFront = React.lazy(() => import('./pages/StoreFront'));

// Lazy load complex components
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AffiliateDashboard = React.lazy(() => import('./components/AffiliateDashboard'));
const AffiliateDashboardPage = () => (
  <div className="pt-24 min-h-screen bg-ivory-50">
    <React.Suspense fallback={<PageLoader />}>
      <AffiliateDashboard />
    </React.Suspense>
  </div>
);

// Loading screen for code-splitting
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-ivory-50">
    <div className="w-8 h-8 border-4 border-ink-100 border-t-pastel-pink-dark rounded-full animate-spin" />
  </div>
);

import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import CustomCursor from './components/CustomCursor';
import CookieBanner from './components/CookieBanner';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
          <UserProvider>
            <CurrencyProvider>
              <CartProvider>
                <CustomCursor />
                <CookieBanner />
                <BrowserRouter>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <React.Suspense fallback={<PageLoader />}>
                          <StoreFront />
                        </React.Suspense>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <React.Suspense fallback={<PageLoader />}>
                            <AdminDashboard />
                          </React.Suspense>
                        </AdminRoute>
                      } 
                    />
                    <Route path="/affiliate" element={<AffiliateDashboardPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </CartProvider>
            </CurrencyProvider>
          </UserProvider>
        </ProductProvider>
      </OrderProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
