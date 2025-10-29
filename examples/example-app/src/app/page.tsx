"use client";

import { useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../components/AuthProvider";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();

  async function sendToBackend() {
    if (!session?.accessToken) return alert("No token");
    
    const body = {
      txn: "<base64-unsigned-txn>",
      oauthToken: session.accessToken
    };
    
    try {
      const resp = await fetch("/api/proxy-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await resp.json();
      console.log("Backend signed result:", result);
      alert("Check console for result");
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending to backend");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          OAuth Modal Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button 
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Open Auth Modal
          </button>
          
          <AuthModal open={open} onClose={() => setOpen(false)} />
        </div>

        {session && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Session Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
            
            <button 
              onClick={sendToBackend}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send to Backend /sign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}