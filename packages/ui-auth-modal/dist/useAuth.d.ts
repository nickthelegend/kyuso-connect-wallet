export declare const useAuth: () => {
    session: {
        accessToken?: string | null;
        user?: {
            name?: string;
            email?: string;
            image?: string;
            provider?: string;
        };
    } | null;
    setSession: (session: {
        accessToken?: string | null;
        user?: {
            name?: string;
            email?: string;
            image?: string;
            provider?: string;
        };
    } | null) => void;
};
//# sourceMappingURL=useAuth.d.ts.map