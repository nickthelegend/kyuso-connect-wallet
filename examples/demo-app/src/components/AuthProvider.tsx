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
    // Wallet creation is now handled in Header component to get the user ID
    console.log('Wallet creation will be handled by Header component');
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