"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Session = { accessToken?: string | null; user?: any } | null;
type AuthContextType = {
  session: Session;
  setSession: (session: Session) => void;
  createWallet: (oauthToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  const createWallet = async (oauthToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oauthToken })
      });
      const result = await response.json();
      console.log('Wallet created:', result);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, setSession, createWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};