"use client";

import { useAuth } from "./AuthProvider";
import { useState, useEffect } from "react";

export function Header() {
  const { session } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserIdAndWallet(session.accessToken);
    }
  }, [session]);

  const fetchUserIdAndWallet = async (oauthToken: string) => {
    try {
      // First call /create to get the user ID that the backend generates
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oauthToken })
      });
      const createData = await createResponse.json();
      
      if (createData.uid) {
        // Now fetch wallet address using the same user ID
        const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/get/${createData.uid}`);
        const walletData = await walletResponse.json();
        if (walletData.walletAddress) {
          setWalletAddress(walletData.walletAddress);
        }
      }
    } catch (error) {
      console.error("Failed to fetch wallet address:", error);
    }
  };

  if (!session) return null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">
          Kyuso OAuth
        </div>
        <div className="text-sm text-gray-600">
          {walletAddress ? (
            <span className="bg-gray-100 px-3 py-1 rounded-full font-mono">
              {walletAddress}
            </span>
          ) : (
            <span>Loading wallet...</span>
          )}
        </div>
      </div>
    </header>
  );
}