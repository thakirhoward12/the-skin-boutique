import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, Share2, Wallet, Users, ArrowUpRight, Gift, ChevronRight, 
  ExternalLink, Trophy, Star, ShieldCheck, Download, Image as ImageIcon,
  CheckCircle2, Edit3, Save, X
} from 'lucide-react';
import { useUser, AffiliateTier } from '../contexts/UserContext';
import { useCurrency, exchangeRates } from '../contexts/CurrencyContext';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AffiliateDashboard() {
  const { profile } = useUser();
  const { formatPrice } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newCode, setNewCode] = useState(profile?.affiliateCode || '');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    // Fetch top affiliates for leaderboard
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('referralCount', 'desc'), limit(5));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaderboard(leads);
    });

    return () => unsubscribe();
  }, []);

  const referralLink = `${window.location.origin}?ref=${profile?.affiliateCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateCode = async () => {
    if (!profile || !profile.email || newCode === profile.affiliateCode) {
      setIsEditingCode(false);
      return;
    }

    setSaveLoading(true);
    try {
      // Check if code is already taken
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('affiliateCode', '==', newCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('This code is already taken. Please try another one.');
        setSaveLoading(false);
        return;
      }

      // Find user document using email or better yet, if we had uid in profile. 
      // Assuming we have uid in current user if we can get it or use Auth.
      // For now, let's assume we can get it from storage or Auth.
      // Better to use the UID from Auth.
      const user = (await import('firebase/auth')).getAuth().currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          affiliateCode: newCode
        });
        setIsEditingCode(false);
      }
    } catch (error) {
      console.error('Failed to update code:', error);
      alert('Error updating code. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join The Skin Boutique!',
        text: 'Join The Skin Boutique and get amazing skincare!',
        url: referralLink,
      });
    } else {
      copyToClipboard();
    }
  };

  if (!profile) return null;

  // Tier progress calculation
  const getTierInfo = (tier: AffiliateTier) => {
    switch (tier) {
      case 'Gold': return { color: 'text-amber-500', bg: 'bg-amber-50', icon: Trophy, reward: 'R100', next: null };
      case 'Silver': return { color: 'text-pastel-blue-200', bg: 'bg-pastel-blue-100/20', icon: ShieldCheck, reward: 'R75', next: 50 };
      default: return { color: 'text-pastel-pink-dark', bg: 'bg-pastel-pink/20', icon: Star, reward: 'R50', next: 10 };
    }
  };

  const tierInfo = getTierInfo(profile.tier || 'Bronze');
  const nextTarget = tierInfo.next;
  const progressPercent = nextTarget ? Math.min(((profile.referralCount || 0) / nextTarget) * 100, 100) : 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 mb-20">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-ink-100 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-emerald-50 rounded-2xl`}>
              <Wallet className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
              Available
            </span>
          </div>
          <div>
            <p className="text-sm text-ink-500 mb-1">Wallet Balance</p>
            <h3 className="text-3xl font-serif font-bold text-ink-900">
              {formatPrice((profile.walletBalance || 0) / exchangeRates.ZAR)}
            </h3>
            <p className="text-[10px] text-ink-400 mt-2">≈ R{(profile.walletBalance || 0).toFixed(2)}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-ink-100 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${tierInfo.bg} rounded-2xl`}>
              <Users className={`w-6 h-6 ${tierInfo.color}`} />
            </div>
            <span className={`text-[10px] font-bold ${tierInfo.color} ${tierInfo.bg} px-2 py-1 rounded-full uppercase tracking-wider`}>
              {profile.tier} Tier
            </span>
          </div>
          <div>
            <p className="text-sm text-ink-500 mb-1">Total Referrals</p>
            <h3 className="text-3xl font-serif font-bold text-ink-900">
              {profile.referralCount || 0}
            </h3>
            <p className="text-[10px] text-ink-400 mt-2">Personal network growth</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-ink-100 md:col-span-2"
        >
          <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-pastel-pink/10 rounded-2xl">
                  <tierInfo.icon className={`w-6 h-6 ${tierInfo.color}`} />
                </div>
                <div>
                   <h4 className="font-serif font-bold text-ink-900">Tier Rewards</h4>
                   <p className="text-[10px] text-ink-400 uppercase tracking-widest">Earning {tierInfo.reward} per signup</p>
                </div>
             </div>
             {nextTarget && (
               <span className="text-[10px] font-bold text-ink-400 bg-ink-50 px-2 py-1 rounded-full text-right">
                  {nextTarget - profile.referralCount} more to Gold
               </span>
             )}
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-ink-50 rounded-full overflow-hidden border border-ink-100 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${profile.tier === 'Bronze' ? 'from-pastel-pink to-pastel-pink-dark' : 'from-pastel-blue-100 to-pastel-blue-200'}`}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-ink-400 uppercase tracking-tighter">
              <span>{profile.tier}</span>
              <span>{profile.tier === 'Bronze' ? 'Silver' : 'Gold'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Referral Link & Customization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-ink-900 text-white rounded-3xl p-8 overflow-hidden relative"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-semibold mb-2">Share & Earn Rewards</h2>
              <p className="text-ink-300 text-sm mb-8 max-w-md">
                Invite friends and give them <span className="text-pastel-pink font-bold">10% OFF</span> their first order. You'll get <span className="text-pastel-pink font-bold">{tierInfo.reward}</span> instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between group">
                  {isEditingCode ? (
                    <input 
                      autoFocus
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                      className="bg-transparent border-none focus:outline-none text-pastel-pink font-mono font-bold w-full uppercase"
                    />
                  ) : (
                    <code className="text-pastel-pink font-mono font-bold truncate max-w-[200px]">{profile.affiliateCode}</code>
                  )}
                  
                  <div className="flex items-center gap-1">
                    {profile.tier === 'Gold' && !isEditingCode && (
                       <button onClick={() => setIsEditingCode(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white">
                         <Edit3 className="w-4 h-4" />
                       </button>
                    )}
                    {isEditingCode ? (
                       <div className="flex items-center gap-1">
                          <button onClick={handleUpdateCode} className="p-2 text-emerald-400 hover:bg-white/10 rounded-xl">
                            {saveLoading ? <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent animate-spin rounded-full" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setIsEditingCode(false)} className="p-2 text-red-400 hover:bg-white/10 rounded-xl">
                            <X className="w-4 h-4" />
                          </button>
                       </div>
                    ) : (
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={shareReferral}
                  className="px-8 py-4 bg-pastel-pink-dark text-ink-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all transform hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4" />
                  Spread the Word
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-pink/10 blur-3xl -mr-32 -mt-32 rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pastel-blue-100/10 blur-2xl -ml-16 -mb-16 rounded-full" />
          </motion.div>

          {/* Media Kit Section */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-ink-400 uppercase tracking-widest flex items-center gap-2">
               <ImageIcon className="w-4 h-4" /> Ambassador Media Kit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Insta Story Glow', type: 'Image (9:16)', size: '2.4MB' },
                { title: 'Product Catalog', type: 'PDF Guide', size: '1.1MB' },
                { title: 'Brand Logos', type: 'ZIP Assets', size: '5.8MB' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl border border-ink-100 group hover:border-pastel-pink-dark transition-all cursor-pointer">
                  <div className="aspect-[4/5] bg-ink-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                     <ImageIcon className="w-8 h-8 text-ink-200 group-hover:scale-110 transition-transform" />
                     <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white flex items-center gap-1">
                           <Download className="w-3 h-3" /> Preview
                        </span>
                     </div>
                  </div>
                  <h5 className="text-sm font-bold text-ink-900 mb-1">{item.title}</h5>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-ink-400 font-medium uppercase">{item.type}</span>
                    <button className="text-pastel-pink-dark"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Leaderboard Card */}
          <div className="bg-white rounded-[2.5rem] border border-ink-100 p-8 space-y-8 sticky top-24">
             <div className="flex items-center justify-between">
                <h4 className="text-xl font-serif font-bold text-ink-900 flex items-center gap-2">
                   <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard
                </h4>
                <div className="p-2 bg-ink-50 rounded-xl">
                   <Star className="w-4 h-4 text-ink-400" />
                </div>
             </div>

             <div className="space-y-6">
                {leaderboard.length > 0 ? leaderboard.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-serif ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-ink-50 text-ink-400'}`}>
                        {idx + 1}
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-ink-900 flex items-center gap-2">
                           {item.displayName || item.email.split('@')[0]}
                           {idx === 0 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        </p>
                        <p className="text-[10px] text-ink-400 uppercase tracking-tighter">
                           Tier: {item.tier || 'Bronze'}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-serif font-bold text-ink-900">{item.referralCount}</p>
                        <p className="text-[8px] text-ink-400 uppercase tracking-widest">Leads</p>
                     </div>
                  </div>
                )) : (
                  <div className="py-20 text-center space-y-3">
                    <Trophy className="w-10 h-10 text-ink-100 mx-auto" />
                    <p className="text-xs text-ink-400">Loading current top ambassadors...</p>
                  </div>
                )}
             </div>

             <div className="pt-4 border-t border-ink-50">
                <button className="w-full py-4 bg-ink-50 rounded-2xl text-xs font-bold text-ink-600 hover:bg-pastel-blue-100/20 hover:text-pastel-blue-200 transition-colors flex items-center justify-center gap-2 group">
                   Full Rankings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

          {/* Recent Spending Info */}
          <div className="bg-pastel-pink/10 rounded-3xl p-6 border border-pastel-pink/20">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-xl">
                   <ExternalLink className="w-4 h-4 text-pastel-pink-dark" />
                </div>
                <h5 className="font-bold text-xs text-ink-900 uppercase tracking-widest text-left">Cashout Info</h5>
             </div>
             <p className="text-xs text-ink-700 leading-relaxed text-left">
                Earnings over <span className="font-bold underline">R500</span> can be cashed out to your verified PayPal address. Payouts are processed every Monday.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
