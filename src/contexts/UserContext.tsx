import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SkinProfile = {
  skinType: string;
  concern: string;
};

interface UserContextType {
  profile: SkinProfile | null;
  saveProfile: (type: string, concern: string) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SkinProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('skinProfile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse skin profile', e);
      }
    }
  }, []);

  const saveProfile = (skinType: string, concern: string) => {
    const newProfile = { skinType, concern };
    setProfile(newProfile);
    localStorage.setItem('skinProfile', JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('skinProfile');
  };

  return (
    <UserContext.Provider value={{ profile, saveProfile, clearProfile }}>
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
