import React, { createContext, useContext, useState } from "react";

type Session = {
  accessToken?: string | null;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    provider?: string;
  };
} | null;

type AuthContextType = {
  session: Session;
  setSession: (session: Session) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);