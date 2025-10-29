"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signOut } from "next-auth/react";

type Session = { accessToken?: string | null; user?: any } | null;
type AuthContextType = {
  session: Session;
  setSession: (session: Session) => void;
  createWallet: (oauthToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('auth-session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const handleSetSession = (newSession: Session) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem('auth-session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('auth-session');
    }
  };

  const createWallet = async (oauthToken: string) => {
    console.log('Wallet creation will be handled by Header component');
  };

  const logout = () => {
    handleSetSession(null);
    signOut({ callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider value={{ session, setSession: handleSetSession, createWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};