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
      // Create transaction using algosdk (you'll need to install algosdk: npm install algosdk)
      const algosdk = (await import('algosdk')).default;
      
      // Get network params
      const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
      const params = await algodClient.getTransactionParams().do();
      
      // Create payment transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: walletAddress,
        receiver: "JQ4DXV6ZXEQJRPRRFQDLR5WWD7WUPAELJNKP6FVSAQ4ZJNRHGBYJCKDHOY", // mock receiver
        amount: 1_000_000, // 1 ALGO in microAlgos
        note: new Uint8Array(Buffer.from("Test payment from Kyuso OAuth")),
        suggestedParams: params,
      });
      
      // Encode transaction for backend
      const txnEncoded = Buffer.from(JSON.stringify({ txn: txn.get_obj_for_encoding() })).toString('base64');
      
      // Send to /sign endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          txn: txnEncoded,
          oauthToken: session.accessToken
        })
      });
      
      const result = await response.json();
      console.log('Transaction result:', result);
      
      if (result.txId) {
        alert(`Transaction sent! TxID: ${result.txId}`);
      } else {
        alert(`Error: ${result.error || 'Unknown error'}`);
      }
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
            <s