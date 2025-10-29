export { AuthProvider } from "./AuthProvider";
export { AuthModal } from "./AuthModal";
export { useAuth } from "./useAuth";
export type Session = {
    accessToken?: string | null;
    user?: {
        name?: string;
        email?: string;
        image?: string;
        provider?: string;
    };
} | null;
export type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    providers?: ("google" | "github")[];
};
export type AuthContextType = {
    session: Session;
    setSession: (session: Session) => void;
};
//# sourceMappingURL=index.d.ts.map