import React from 'react';
import { X } from 'lucide-react';

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export default function LegalDocsModal({ isOpen, onClose, initialTab = 'privacy' }: LegalDocsModalProps) {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'terms'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:p-6 pointer-events-auto">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[#F9F6F0] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-gray-200 bg-white">
          <div className="flex gap-6 border-b-2 border-transparent">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`text-lg font-space font-bold pb-2 transition-colors ${activeTab === 'privacy' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`text-lg font-space font-bold pb-2 transition-colors ${activeTab === 'terms' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Terms of Service
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-white flex-1">
          <div className="prose prose-indigo max-w-none prose-headings:font-space">
            {activeTab === 'privacy' ? (
              <PrivacyPolicyContent />
            ) : (
              <TermsOfServiceContent />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">1. Information We Collect</h3>
        <p>We collect information that you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support. This may include your name, email address, shipping address, and payment information (handled entirely by our secure gateway, Yoco).</p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">2. How We Use Your Information</h3>
        <p>We use the information we collect to operate our business, including:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Fulfilling and managing your orders via Shopify and our suppliers automatically.</li>
          <li>Communicating with you about products, services, promotions, and updates.</li>
          <li>Protecting against fraudulent transactions and maintaining site security.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">3. Cookies and Tracking Technologies</h3>
        <p>We use cookies to personalize content, analyze our traffic, and improve the user experience. You can manage your cookie preferences through our banner or your browser's settings.</p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">4. Data Sharing</h3>
        <p>We do not categorically sell your personal information. We only share data with designated third parties essential to fulfilling our service (e.g., Yoco for payments, Firebase for database hosting, our suppliers for order fulfillment).</p>
      </section>
    </div>
  );
}

function TermsOfServiceContent() {
  return (
    <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">1. Agreement to Terms</h3>
        <p>By accessing or using The Skin Boutique website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">2. User Accounts</h3>
        <p>When creating an account, you must provide accurate and complete information. You are entirely responsible for maintaining the security of your account credentials.</p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">3. Product Availability and Errors</h3>
        <p>We continuously update product offerings. We reserve the right to change or update information and to correct errors, inaccuracies, or omissions at any time without prior notice.</p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">4. Returns and Refunds</h3>
        <p>Our return policy is governed by our standard operating guidelines. If you receive a defective or incorrect item, please contact our support desk immediately. Standard refunds are processed within 7-14 business days subject to policy conditions.</p>
      </section>
      
      <section>
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">5. Affiliate Program</h3>
        <p>Participation in our Affiliate or Referral Program is subject to abuse-monitoring. We reserve the right to void referral credits if fraudulent activity, spam, or Terms of Service violations are detected.</p>
      </section>
    </div>
  );
}
