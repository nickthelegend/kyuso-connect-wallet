"use client";

import { useAuth } from "./AuthProvider";
import { useState, useEffect } from "react";

export function Header() {
  const { session } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    if (session?.user?.email) {
      // Use email as user ID since OAuth providers use email as unique identifier
      const userId = btoa(session.user.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
      fetchWalletAddress(userId);
    }
  }, [session]);

  const fetchWalletAddress = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/get/${userId}`);
      const data = await response.json();
      if (data.walletAddress) {
        setWalletAddress(data.walletAddress);
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