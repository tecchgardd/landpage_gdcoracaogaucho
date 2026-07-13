'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService, type SessionUser } from '@/services/authService';

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { const result = await authService.getSession(); setUser(result?.user ?? null); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading, refresh,
    signIn: async (email, password) => { const result = await authService.signIn(email, password); setUser(result?.user ?? null); },
    signUp: async (name, email, password, phone) => { const result = await authService.signUp(name, email, password, phone); setUser(result?.user ?? null); },
    signOut: async () => { await authService.signOut(); setUser(null); }
  }), [user, loading, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth precisa do AuthProvider');
  return value;
}
