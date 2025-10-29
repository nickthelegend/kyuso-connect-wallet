import React from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
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

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center"
        >
          <Dialog.Title className="text-lg font-semibold mb-4">
            Sign in
          </Dialog.Title>
          
          <div className="space-y-3">
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => openPopup(p)}
                className="w-full p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
              >
                Continue with {p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          
          <button 
            onClick={onClose} 
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}