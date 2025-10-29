import React from "react";
import { useAuth } from "./useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
  providers?: ("google" | "github")[];
};

export function AuthModal({ open, onClose, providers = ["google", "github"] }: Props) {
  const { setSession } = useAuth();

  function openPopup(provider: string) {
    const popup = window.open(
      `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/auth/popup-callback")}`,
      "oauth",
      "width=500,height=700"
    );
    
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "OAUTH_SESSION") return;
      setSession(e.data.session);
      window.removeEventListener("message", onMessage);
      if (popup) popup.close();
      onClose();
    }
    window.addEventListener("message", onMessage);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <h2 className="text-lg font-semibold mb-4">Sign in</h2>
        
        {providers.map((p) => (
          <button
            key={p}
            onClick={() => openPopup(p)}
            className="w-full mb-3 p-2 rounded-lg border hover:bg-gray-50"
          >
            Continue with {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
        
        <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
}