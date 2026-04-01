import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-12 h-12 border-4 border-ink-200 border-t-ink-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to home
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    // User is logged in but not an admin
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 p-6 text-center">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-serif text-ink-900 mb-4">Access Denied</h1>
        <p className="text-ink-500 max-w-md mb-8">
          You do not have the required permissions to view the admin dashboard. 
          Please log in with an administrator account.
        </p>
        <a 
          href="/" 
          className="bg-ink-900 text-white px-8 py-3 rounded-xl hover:bg-ink-800 transition-colors"
        >
          Return to Store
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
