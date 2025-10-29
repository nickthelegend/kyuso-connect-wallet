"use client";

import { useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../components/AuthProvider";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { session } = useAuth();

  async function testBackend() {
    if (!session?.accessToken) return alert("No access token available");
    
    try {
      // Get wallet address first
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oauthToken: session.accessToken })
      });
      const createData = await createResponse.json();
      
      if (!createData.uid) return alert("Failed to get user ID");
      
      const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SIGN_URL || 'http://127.0.0.1:3000'}/get/${createData.uid}`);
      const walletData = await walletResponse.json();
      
      if (!walletData.walletAddress) return alert("Failed to get wallet address");
      
      // Create transaction using algosdk
      const algosdk = (await import('algosdk')).default;
      const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
      
      // 1️⃣ Get transaction params from network
      const params = await algodClient.getTransactionParams().do();

      // 2️⃣ Create a simple Payment transaction (1 Algo)
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: walletData.walletAddress,
        receiver: "JQ4DXV6ZXEQJRPRRFQDLR5WWD7WUPAELJNKP6FVSAQ4ZJNRHGBYJCKDHOY", // mock receiver
        amount: 1_000_000, // microAlgos (1 Algo)
        note: new Uint8Array(Buffer.from("Vault Payment Test")),
        suggestedParams: params,
      });

      // 3️⃣ Get bytes to sign (canonical)
      const bytesToSign = txn.bytesToSign();
      
      // 4️⃣ Send to proxy-sign which forwards to backend /sign-txn
      const response = await fetch("/api/proxy-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAddr: walletData.walletAddress,
          receiverAddr: "JQ4DXV6ZXEQJRPRRFQDLR5WWD7WUPAELJNKP6FVSAQ4ZJNRHGBYJCKDHOY",
          amount: 1_000_000,
          oauthToken: session.accessToken
        })
      });
      const result = await response.json();
      console.log("Backend result:", result);
      
      if (result.success && result.txId) {
        alert(`Transaction sent! TxID: ${result.txId}`);
      } else {
        alert(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred. Check console for details");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            OAuth Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Modern authentication flow with Google and GitHub OAuth providers
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            {!session ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h2>
                <p className="text-gray-600 mb-8">Sign in to get started with the demo</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-8">
                  <img
                    src={session.user?.image || "https://via.placeholder.com/64"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Hello, {session.user?.name || "User"}!
                    </h2>
                    <p className="text-gray-600">{session.user?.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Session Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{session.user?.provider || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Token:</span>
                      <span className="font-medium">{session.accessToken ? "✅ Available" : "❌ Missing"}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={testBackend}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Test Backend Integration
                </button>
              </div>
            )}
          </div>
        </div>

        <AuthModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
        />
      </div>
    </div>
  );
}