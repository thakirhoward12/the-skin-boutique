import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export type AffiliateTier = 'Bronze' | 'Silver' | 'Gold';

type SkinProfile = {
  skinType: string;
  concern: string;
  walletBalance: number; // in Rands (ZAR)
  affiliateCode: string;
  referredBy?: string;
  displayName?: string;
  email?: string;
  tier: AffiliateTier;
  referralCount: number;
  hasUsedReferralDiscount: boolean;
};

interface UserContextType {
  profile: SkinProfile | null;
  isLoading: boolean;
  saveProfile: (type: string, concern: string) => Promise<void>;
  updateWallet: (amount: number) => Promise<void>;
  markDiscountUsed: () => Promise<void>;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Listen to the user's document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          skinType: data.skinType || '',
          concern: data.concern || '',
          walletBalance: data.walletBalance || 0,
          affiliateCode: data.affiliateCode || user.email?.split('@')[0] + Math.floor(Math.random() * 1000),
          email: data.email || user.email || '',
          displayName: data.displayName || user.displayName || '',
          tier: data.tier || 'Bronze',
          referralCount: data.referralCount || 0,
          hasUsedReferralDiscount: data.hasUsedReferralDiscount || false,
          referredBy: data.referredBy
        } as SkinProfile);
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile: SkinProfile = {
          skinType: '',
          concern: '',
          walletBalance: 0,
          affiliateCode: user.email?.split('@')[0] + Math.floor(Math.random() * 1000),
          email: user.email || '',
          displayName: user.displayName || '',
          tier: 'Bronze',
          referralCount: 0,
          hasUsedReferralDiscount: false
        };
        setDoc(userDocRef, initialProfile);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to user profile:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const saveProfile = async (skinType: string, concern: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { skinType, concern });
  };

  const updateWallet = async (amount: number) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { 
      walletBalance: increment(amount) 
    });
  };

  const markDiscountUsed = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { 
      hasUsedReferralDiscount: true 
    });
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return (
    <UserContext.Provider value={{ profile, isLoading, saveProfile, updateWallet, markDiscountUsed, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
