/**
 * Payment Service
 * Handles multi-gateway initialization and transaction processing.
 * Yoco: Uses the Checkout API (server-side session) + popup window
 * PayPal: Uses client-side SDK with popup
 * Wallet: In-app wallet balance (handled in CheckoutModal)
 */

export type PaymentMethod = 'yoco' | 'paypal' | 'wallet';

interface PaymentOptions {
  email: string;
  amount: number; // In baseline currency (USD)
  amountInCents: number; // For Yoco (ZAR cents)
  customerName?: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: any) => void;
}

const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      if (existingScript.getAttribute('data-loaded') === 'true') {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error(`Failed to load script: ${url}`)));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
};

const getMode = () => import.meta.env.VITE_PAYMENT_MODE || 'sandbox';

// Firebase Cloud Function URL for Yoco checkout
const YOCO_CHECKOUT_FUNCTION_URL = 
  'https://africa-south1-gen-lang-client-0717528220.cloudfunctions.net/createYocoCheckout';

export const PaymentService = {
  /**
   * Create a Yoco checkout session and return the redirect URL for embedding.
   * Instead of redirecting, we'll embed this in an iframe.
   */
  async createYocoSession(options: {
    amountInCents: number;
    email: string;
    customerName?: string;
  }): Promise<{ id: string; redirectUrl: string }> {
    const response = await fetch(YOCO_CHECKOUT_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountInCents: options.amountInCents,
        currency: 'ZAR',
        metadata: {
          customerEmail: options.email,
          customerName: options.customerName || ''
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data.error) || 'Failed to create checkout session');
    }

    return { id: data.id, redirectUrl: data.redirectUrl };
  },

  async initPayPal(): Promise<any> {
    const isLive = getMode() === 'live';
    const clientId = isLive 
      ? import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE 
      : import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;
    
    if (!clientId) throw new Error(`PayPal Client ID (${getMode()}) missing`);
    
    await loadScript(`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`);
    return (window as any).paypal;
  },

  async renderPayPalButtons(containerId: string, options: PaymentOptions) {
    try {
      const paypal = await this.initPayPal();
      
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';

      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: options.amount.toFixed(2)
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            options.onSuccess(details.id);
          });
        },
        onCancel: () => {
          options.onCancel();
        },
        onError: (err: any) => {
          options.onError(err);
        }
      }).render(`#${containerId}`);
    } catch (error) {
      options.onError(error);
    }
  }
};
