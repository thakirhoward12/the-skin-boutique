import React, { useState } from 'react';
import { ChevronDown, Package, CreditCard, RefreshCw, Droplets, Shield, Users, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  icon: React.ReactNode;
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 7–14 business days. All orders are fulfilled through our automated logistics network and shipped directly from verified international warehouses. You\'ll receive a tracking link via email once your order dispatches.'
      },
      {
        question: 'Where do you ship to?',
        answer: 'We ship worldwide to all countries supported by our global fulfilment network. Shipping rates and estimated delivery times are calculated at checkout based on your location.'
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order ships, we\'ll email you a tracking number. You can also log in to your account and check your order status any time under "My Orders."'
      },
      {
        question: 'What happens if my order arrives damaged?',
        answer: 'Contact us within 48 hours of delivery with a photo of the damage. For courier/transit damage, we offer a 75% refund. For factory defects (wrong product, manufacturing fault), we provide a full 100% refund or replacement. We handle the supplier query chain on your behalf.'
      },
      {
        question: 'Is there free shipping?',
        answer: 'Yes! Orders over $35 USD (approximately R650 ZAR) qualify for free standard shipping. You can see your progress toward the free shipping threshold right inside your cart. It\'s a great reason to stock up on your favourite products.'
      }
    ]
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Payments & Pricing',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) processed securely through Yoco. We also support our built-in wallet system for faster repeat checkouts.'
      },
      {
        question: 'Are your prices in South African Rand?',
        answer: 'Our site auto-detects your location and shows prices in your local currency (ZAR, USD, EUR, GBP, and more). You can also manually switch currencies using the selector on the site.'
      },
      {
        question: 'Is it safe to enter my card details?',
        answer: 'Absolutely. We never see or store your card information. All transactions are processed through Yoco\'s PCI-DSS compliant payment gateway with bank-grade encryption. Our site is SSL-secured end to end.'
      }
    ]
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns on unopened, unused products within 14 days of delivery. Items must be in their original, sealed packaging with all labels intact. We cover return shipping costs — simply ship the product back to us and we\'ll process your refund once received and inspected.'
      },
      {
        question: 'How does the refund work for damaged goods?',
        answer: 'It depends on the type of damage. Courier or transit damage qualifies for a 75% refund. Factory defects (manufacturing faults, wrong items) qualify for a 100% refund or a free replacement. In all cases, contact us within 48 hours with photos as proof.'
      },
      {
        question: 'How long do refunds take?',
        answer: 'Once we receive and inspect the returned item, refunds are processed within 5–7 business days back to your original payment method.'
      },
      {
        question: 'What if I received the wrong product?',
        answer: 'We\'ll make it right. Contact support with your order number and a photo of what you received. Factory errors qualify for a full refund or free replacement — we\'ll handle the supplier query on your behalf.'
      }
    ]
  },
  {
    icon: <Droplets className="w-5 h-5" />,
    title: 'Products & Ingredients',
    items: [
      {
        question: 'Are all your products authentic?',
        answer: '100%. Every product is sourced directly from authorised Korean and Japanese distributors. We do not carry grey-market or counterfeit goods. Each product listing includes the full manufacturer ingredient list and country of origin.'
      },
      {
        question: 'How do I know which products are right for my skin?',
        answer: 'Every product page includes compatible skin types and concerns. You can also use our AI Product Scanner — point your camera at any skincare product you currently use and get instant ingredient analysis and personalised recommendations.'
      },
      {
        question: 'What does the ingredient tooltip feature do?',
        answer: 'When you tap on a product\'s ingredient list, recognised active ingredients are highlighted with a floating popup explaining exactly what that ingredient does for your skin. We currently cover 50+ commonly used K-Beauty actives like Niacinamide, Centella Asiatica, Hyaluronic Acid, and more.'
      },
      {
        question: 'Are your products cruelty-free?',
        answer: 'The vast majority of our catalogue is cruelty-free and many are also vegan. Each product page lists its certifications (cruelty-free, vegan, paraben-free, etc.) under "Ingredient Highlights."'
      },
      {
        question: 'I\'m new to K-Beauty. Where do I start?',
        answer: 'Start with the essentials: a gentle cleanser, a hydrating toner, a serum targeting your main concern, a moisturiser, and SPF. Browse our "Best Sellers" for the most popular starter products, or use the search bar to filter by your skin concern. Our Skin Quiz can also help guide you.'
      },
      {
        question: 'Do you offer bundles or routine sets?',
        answer: 'We\'re curating routine-based bundles (like a "Glass Skin Starter Kit" and an "Acne Fighter Bundle") at discounted set prices. In the meantime, our Skin Quiz can recommend a personalised routine — and buying 2+ products gets you closer to our free shipping threshold!'
      }
    ]
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Account & Privacy',
    items: [
      {
        question: 'Do I need an account to place an order?',
        answer: 'No. You can check out as a guest. However, creating an account lets you track orders, save favourites, earn affiliate rewards, and check out faster next time.'
      },
      {
        question: 'How do you handle my personal data?',
        answer: 'We only collect what\'s needed to fulfil your order (name, email, shipping address). We never sell your data to third parties. Payment processing is handled entirely by Yoco — we never see your card number. Full details are in our Privacy Policy, accessible from the Footer.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'On the login screen, tap "Forgot Password." You\'ll receive a reset link via email. The link expires after 30 minutes for security.'
      }
    ]
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Affiliate Programme',
    items: [
      {
        question: 'How does the affiliate programme work?',
        answer: 'Sign up for free, share your unique referral link, and earn rewards on every purchase made through your link. We offer a tiered structure — Bronze, Silver, and Gold — with increasing rewards as you bring in more referrals.'
      },
      {
        question: 'How do I get paid as an affiliate?',
        answer: 'You choose your reward type: skincare credits (discounts applied to your own product purchases) or cash at R25 per successful referral. Earnings are tracked in real-time on your Affiliate Dashboard.'
      },
      {
        question: 'Can I use my own referral link on my first purchase?',
        answer: 'No. Self-referrals are flagged by our fraud detection system and will result in voided credits. The programme is designed for genuine word-of-mouth sharing.'
      }
    ]
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: 'Trust & Support',
    items: [
      {
        question: 'Is The Skin Boutique a legitimate store?',
        answer: 'Yes. We are a registered online retailer specialising in authentic Korean and Japanese beauty products. Our store is hosted on Google Cloud infrastructure with SSL encryption, secure payment processing, and a transparent returns policy.'
      },
      {
        question: 'Where are you based?',
        answer: 'We are based in South Africa and serve customers globally through our international fulfilment network.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach us through the Contact form in the site Footer. We aim to respond within 24 hours on business days.'
      }
    ]
  }
];

function AccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-200/60 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 px-1 text-left group transition-colors hover:bg-gray-50/50 rounded-lg"
      >
        <span className={`text-sm sm:text-base font-medium pr-4 transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-800 group-hover:text-gray-900'}`}>
          {item.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm text-gray-600 leading-relaxed px-1">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 px-6 pt-6 pb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-500">
          {category.icon}
        </div>
        <h3 className="font-space text-lg font-bold text-gray-900">{category.title}</h3>
      </div>
      <div className="px-5 pb-4">
        {category.items.map((item, idx) => (
          <AccordionItem
            key={idx}
            item={item}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-[#F9F6F0] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wider uppercase mb-4">
            Got Questions?
          </span>
          <h2 className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to know about shopping with The Skin Boutique. Can't find your answer? Reach out through our contact form.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqData.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
