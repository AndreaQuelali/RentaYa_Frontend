import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppMode = 'user' | 'owner';

type ModeContextType = {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  toggle: () => void;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('user');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('app_mode');
        if (saved === 'user' || saved === 'owner') setMode(saved);
      } catch (e) {
        // ignore storage errors
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('app_mode', mode);
      } catch (e) {
        // ignore
      }
    })();
  }, [mode]);

  const value = useMemo(
    () => ({ mode, setMode, toggle: () => setMode((m) => (m === 'user' ? 'owner' : 'user')) }),
    [mode]
  );

  if (!hydrated) return null;

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
