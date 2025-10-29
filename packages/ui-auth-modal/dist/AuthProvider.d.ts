import React from "react";
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
export declare function AuthProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useAuthContext: () => AuthContextType | null;
export {};
//# sourceMappingURL=AuthProvider.d.ts.map