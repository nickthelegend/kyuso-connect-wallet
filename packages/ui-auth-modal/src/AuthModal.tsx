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
      <div className="fixed inset-0 bg-black/40" aria-hidden />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center"
        >
          <h2 className="text-lg font-semibold mb-4">Sign in</h2>

          {providers.map((p) => (
            <button
              key={p}
              onClick={() => openPopup(p)}
              className="w-full mb-3 p-2 rounded-lg border"
            >
              Continue with {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}

          <button onClick={onClose} className="mt-2 text-sm text-gray-500">Cancel</button>
        </motion.div>
      </div>
    </Dialog>
  );
}