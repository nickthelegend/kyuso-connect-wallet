"use client";

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  providers?: ("google" | "github")[];
};

export function AuthModal({ open, onClose, providers = ["google", "github"] }: Props) {
  const { setSession } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openPopup(provider: string) {
    setLoading(provider);
    setError(null);
    
    const popup = window.open(
      `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent("/auth/popup-callback")}`,
      "oauth",
      "width=500,height=700"
    );
    
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "OAUTH_SESSION") return;
      
      if (e.data.session) {
        setSession(e.data.session);
        window.removeEventListener("message", onMessage);
        if (popup) popup.close();
        setLoading(null);
        onClose();
      } else {
        setError("Authentication failed. Please try again.");
        setLoading(null);
      }
    }
    
    window.addEventListener("message", onMessage);
    
    // Fallback timeout in case popup is blocked or fails
    setTimeout(() => {
      if (loading === provider) {
        setError("Popup was blocked or authentication timed out. Please allow popups and try again.");
        setLoading(null);
      }
    }, 10000);
  }

  const providerIcons = {
    google: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              
              className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <Dialog.Title className="text-lg font-semibold mb-6 text-gray-900">
                Sign in to Continue
              </Dialog.Title>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-3">
                {providers.map((p) => (
                  <button
                    key={p}
                    onClick={() => openPopup(p)}
                    disabled={loading !== null}
                    className={`w-full p-3 rounded-lg border font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                      loading === p
                        ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        : loading === null
                        ? 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                        : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading === p ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        {providerIcons[p as keyof typeof providerIcons]}
                        Continue with {p[0].toUpperCase() + p.slice(1)}
                      </>
                    )}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={onClose} 
                disabled={loading !== null}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}