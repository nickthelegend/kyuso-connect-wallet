"use client";

import { useAuth } from "./AuthProvider";
import { useState, useEffect } from "react";

export function Header() {
  const { session, logout } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserIdAndWallet(session.accessToken);
    }
  }, [session]);

  const fetchUserIdAndWallet = async (oauthToken: string) => {
    try {
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oauthToken })
      });
      const createData = await createResponse.json();
      
      if (createData.uid) {
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

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const testTransaction = async () => {
    if (!session?.accessToken || !walletAddress) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/test-txn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          oauthToken: session.accessToken,
          senderAddr: walletAddress
        })
      });
      const result = await response.json();
      console.log('Transaction result:', result);
      alert(result.success ? `Transaction sent! TxID: ${result.txId}` : `Error: ${result.error}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Check console for details.');
    }
  };

  if (!session) return null;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">
          Kyuso OAuth
        </div>
        <div className="relative">
          {walletAddress ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-100 px-3 py-1 rounded-full font-mono text-sm hover:bg-gray-200 transition-colors"
            >
              {truncateAddress(walletAddress)}
            </button>
          ) : (
            <span className="text-sm text-gray-600">Loading wallet...</span>
          )}
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    testTransaction();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Test Transaction
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}