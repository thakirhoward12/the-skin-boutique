import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('tsb_cookie_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tsb_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Only strictly necessary cookies will be run.
    localStorage.setItem('tsb_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-indigo-500/10 border border-indigo-50 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transform translate-y-0 transition-transform duration-500 ease-out">
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-space font-bold text-gray-900 mb-1">We respect your privacy</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                We use cookies and equivalent technologies to collect and analyze information on site performance and usage, and to provide targeted advertisements. By clicking "Accept", you agree to the placement of these cookies.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
            >
              Accept All 
            </button>
          </div>

          <button 
            onClick={handleDecline}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
