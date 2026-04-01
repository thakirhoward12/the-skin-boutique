import React, { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

const IMAGE_URLS = [
  "https://lh3.googleusercontent.com/pw/AP1GczPeHNFhgVg4nMQQ3s6AiOeOMoWlwurFyh9DC94MSF0vKBDBl2g4fnRtwEgsHN2XAZu2zMXxp34v2vzDOHZO-0fyg2YlUvvUrCtwO_E8fPE5F5BEUBI",
  "https://lh3.googleusercontent.com/pw/AP1GczMLG8J5Y7wVoz4JL1_fy9O0cMMgrb_1vaL2wA9nyxubHOOwMOAmuTluJhAV6VOn9d9KjJrm6VOKOIezQAUe4gwfVW-_ucYFlK4mKDecIC1AFTk_4zs",
  "https://lh3.googleusercontent.com/pw/AP1GczN98zc2wOBolzvaUWDMQWlkDH76WNO3eqe2mXVxyygGb4q1PDsE9nGmrYO6owTUsuGulNgLHsDM-wRSKuMVB6FzZ8Gms-pSDxD2P1RKuaATX66BXjY",
  "https://lh3.googleusercontent.com/pw/AP1GczMhNVoMrOxN11BN5oegKfcBnone_NKIZrx5kW0idf1sgSsLEUBscrt77aQ4yCp0EEhJkeHNQaaxc-6ViN-0MJ1YYqOvKMe2_5yKpFkL0bsgIiMIqEA",
  "https://lh3.googleusercontent.com/pw/AP1GczP3uasBt4xEGiGHrbabUrozIHZBQPwyy-4L6k2FyH15PLmN4AOqcHD5rtvJ3U0aEKnfidX4pbA252DS_8pFJ_Dw9cpGDPMFAoJV5g10NM0D4YH3EYQ",
  "https://lh3.googleusercontent.com/pw/AP1GczN_49-BmKxmrcnYTDQc4JlpoPR31pF_GGFk3lH9sAxLmDMDXXjdntJMcjFKGg01DWRQKredxyoISUOx-PS4IAbw_FHM_TWwKe8vFe3DucTo7umzNiE",
  "https://lh3.googleusercontent.com/pw/AP1GczPs5G-bVyVPoJ4T0CMokHFOGhuMPt5XGYc2b5S3ij_p27VDYaVEgABh2CBr3s3ciHfchmYy7kACYt-jfXJJpI_evbYr7QL8Il9_evOPKXjB2OA4Fg8",
  "https://lh3.googleusercontent.com/pw/AP1GczPWfE6gL5lQaB2OI60pAFCf8GE9Pp1S98KKlsNQP2yYsC1DWssbh6yezbl_REDP2jvjKCdiT8s45-paI3vbvA0v7M0QRTpBDxS6ZW8lRILiAKmwUYE"
];

export default function ProductScanner() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'saving' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scanProducts = async () => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) return;

    setStatus('scanning');
    try {
      const analyzeProductImage = httpsCallable(functions, 'analyzeProductImage');
      const response = await analyzeProductImage({ imageUrls: IMAGE_URLS });
      
      const data = response.data as any;
      const products = data.products || [];

      setResults(products);
      
      setStatus('saving');
      const saveResponse = await fetch('/api/update-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });

      if (saveResponse.ok) {
        setStatus('done');
        // Clear the flag so it doesn't run again
        localStorage.setItem('scanner_done', 'true');
      } else {
        throw new Error('Failed to save products');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) return;

    // Remove direct API checks since we migrated securely to the backend

    fetch('/api/update-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ name: "Scanner Ping", brand: "System", category: "Log", price: 0, description: "Scanner mounted", ingredients: [] }])
    });

    const isDone = localStorage.getItem('scanner_done');
    if (!isDone && status === 'idle') {
      scanProducts();
    }
  }, []);

  if (status === 'idle' || status === 'scanning' || status === 'saving') {
    // Only show the loading UI if we actually started scanning
    if (status !== 'idle') {
      return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-indigo-100 z-50 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">
              {status === 'scanning' ? 'Scanning album for new products...' : 'Saving identified products...'}
            </p>
          </div>
        </div>
      );
    }
  }

  // If there's an error (like missing API key), just fail silently and don't render anything
  if (status === 'error') {
    return null; 
  }

  if (status === 'done') {
    return (
      <div className="fixed bottom-4 right-4 bg-emerald-50 p-4 rounded-lg shadow-xl border border-emerald-100 z-50 max-w-sm">
        <p className="text-sm font-medium text-emerald-700">Successfully added {results.length} new products!</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs text-emerald-600 hover:underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}
