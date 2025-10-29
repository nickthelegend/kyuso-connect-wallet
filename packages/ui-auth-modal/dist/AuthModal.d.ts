type Props = {
    open: boolean;
    onClose: () => void;
    providers?: ("google" | "github")[];
};
export declare function AuthModal({ open, onClose, providers }: Props): import("react/jsx-runtime").JSX.Element;
export {};
