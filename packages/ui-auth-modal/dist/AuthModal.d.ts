type Props = {
    isOpen: boolean;
    onClose: () => void;
    providers?: ("google" | "github")[];
};
export declare function AuthModal({ isOpen, onClose, providers }: Props): import("react/jsx-runtime").JSX.Element;
export {};
