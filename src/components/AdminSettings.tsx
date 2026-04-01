import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Palette,
  Database,
  Shield,
  Mail,
  Globe,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Trash2,
  Key,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

// ── Section Card ──────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-ink-100 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-ink-50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-ink-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          <p className="text-xs text-ink-500 font-light">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ── Copyable Row ──────────────────────────────────────────────────
function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-ink-500 uppercase tracking-wider font-medium mb-1">{label}</p>
        <p className="text-sm text-ink-900 font-mono truncate">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="ml-4 p-2 rounded-lg hover:bg-ink-50 text-ink-400 hover:text-ink-900 transition-colors shrink-0"
        title="Copy"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function AdminSettings() {
  const { user } = useAuth();
  const [isClearing, setIsClearing] = useState(false);
  const [clearStatus, setClearStatus] = useState<string | null>(null);

  const handleClearAllProducts = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL products from Firebase. Are you absolutely sure?')) return;
    if (!window.confirm('This action CANNOT be undone. Type "yes" is not available here, but click OK one more time to confirm.')) return;

    setIsClearing(true);
    setClearStatus('Deleting all products…');
    try {
      const snap = await getDocs(collection(db, 'products'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      setClearStatus(`✓ Deleted ${snap.size} products`);
    } catch (err) {
      console.error(err);
      setClearStatus('✗ Failed to clear products');
    } finally {
      setIsClearing(false);
      setTimeout(() => setClearStatus(null), 5000);
    }
  };

  const themes = [
    { name: 'Default', className: 'theme-default', colors: ['#F9F6F0', '#D4C5B9'] },
    { name: "Valentine's", className: 'theme-valentines', colors: ['#FFF1F2', '#FB7185'] },
    { name: "Women's Day", className: 'theme-womens-day', colors: ['#FAF5FF', '#C084FC'] },
    { name: 'Pride', className: 'theme-pride', colors: ['#FFFFF0', '#FBBF24'] },
    { name: 'Christmas', className: 'theme-christmas', colors: ['#F0FDF4', '#4ADE80'] },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-serif text-ink-900">Settings</h2>
        <p className="text-ink-500 mt-1">Store configuration, theme, and Firebase details.</p>
      </motion.div>

      {/* Store Profile */}
      <Section icon={Store} title="Store Profile" description="Basic information about your store" delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">Store Name</label>
            <input
              type="text"
              defaultValue="The Skin Boutique"
              readOnly
              className="w-full px-4 py-3 bg-ink-50 border border-ink-100 rounded-xl text-sm text-ink-900 font-medium focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">Admin Email</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border border-ink-100 rounded-xl">
              <Mail className="w-4 h-4 text-ink-400 shrink-0" />
              <span className="text-sm text-ink-900 truncate">{user?.email || '—'}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">Currency</label>
            <input
              type="text"
              defaultValue="ZAR (R)"
              readOnly
              className="w-full px-4 py-3 bg-ink-50 border border-ink-100 rounded-xl text-sm text-ink-900 font-medium focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">Region</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border border-ink-100 rounded-xl">
              <Globe className="w-4 h-4 text-ink-400 shrink-0" />
              <span className="text-sm text-ink-900">South Africa</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Theme Palette */}
      <Section icon={Palette} title="Theme Palette" description="Seasonal theme colors that auto-activate on special dates" delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {themes.map(t => (
            <div key={t.name} className="text-center group">
              <div className="flex h-16 rounded-xl overflow-hidden border border-ink-100 mb-2 group-hover:shadow-md transition-shadow">
                <div className="flex-1" style={{ backgroundColor: t.colors[0] }} />
                <div className="flex-1" style={{ backgroundColor: t.colors[1] }} />
              </div>
              <p className="text-xs text-ink-700 font-medium">{t.name}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-400 font-light mt-4">
          Themes activate automatically based on the calendar. See <code className="bg-ink-50 px-1.5 py-0.5 rounded text-[11px]">src/utils/theme.ts</code> to customize date ranges.
        </p>
      </Section>

      {/* Firebase Configuration */}
      <Section icon={Database} title="Firebase Configuration" description="Your project's Firebase connection details" delay={0.15}>
        <div className="space-y-0">
          <CopyRow label="Project ID" value="gen-lang-client-0717528220" />
          <CopyRow label="Auth Domain" value="gen-lang-client-0717528220.firebaseapp.com" />
          <CopyRow label="Storage Bucket" value="gen-lang-client-0717528220.firebasestorage.app" />
          <CopyRow label="App ID" value="1:335167175305:web:4f7c4f0a3f4419af9be458" />
          <CopyRow label="Measurement ID" value="G-51B1M2M70P" />
        </div>
        <div className="mt-4 flex gap-3">
          <a
            href="https://console.firebase.google.com/project/gen-lang-client-0717528220"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-ink-500 hover:text-ink-900 transition-colors border border-ink-100 px-4 py-2 rounded-lg hover:bg-ink-50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Firebase Console
          </a>
          <a
            href="https://console.firebase.google.com/project/gen-lang-client-0717528220/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-ink-500 hover:text-ink-900 transition-colors border border-ink-100 px-4 py-2 rounded-lg hover:bg-ink-50"
          >
            <Database className="w-3.5 h-3.5" />
            Firestore
          </a>
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security" description="Authentication and access control" delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-ink-50 rounded-xl">
            <Key className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-ink-900 font-medium">Admin Access</p>
              <p className="text-xs text-ink-500 font-light mt-1">
                Only <span className="font-medium text-ink-700">theskinboutique.dev@gmail.com</span> has admin privileges.
                This is hardcoded in <code className="bg-white px-1.5 py-0.5 rounded text-[11px]">AuthContext.tsx</code>.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-ink-50 rounded-xl">
            <Shield className="w-4 h-4 text-ink-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-ink-900 font-medium">Auth Methods</p>
              <p className="text-xs text-ink-500 font-light mt-1">
                Email/Password and Google Sign-In are enabled.
                Manage providers in the <a href="https://console.firebase.google.com/project/gen-lang-client-0717528220/authentication" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-700 transition-colors">Firebase Auth console</a>.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section icon={AlertTriangle} title="Danger Zone" description="Irreversible destructive actions" delay={0.25}>
        <div className="border border-red-200 rounded-xl p-5 bg-red-50/30">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-ink-900 font-medium">Clear All Products</p>
              <p className="text-xs text-ink-500 font-light mt-1 mb-4">
                Permanently delete every product from Firebase. You can re-import them later using Mass Import.
              </p>
              <button
                onClick={handleClearAllProducts}
                disabled={isClearing}
                className="inline-flex items-center gap-2 bg-red-500 text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Clearing…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete All Products
                  </>
                )}
              </button>
              {clearStatus && (
                <p className={`mt-3 text-xs font-medium ${clearStatus.startsWith('✗') ? 'text-red-600' : 'text-green-600'}`}>
                  {clearStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
