import { useState } from "react";
import { AuthModal, useAuth } from "ui-auth-modal";

export default function Index() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();

  async function sendToBackend() {
    if (!session?.accessToken) return alert("No token");
    const body = {
      txn: "<base64-unsigned-txn>",
      oauthToken: session.accessToken
    };
    const resp = await fetch("/api/proxy-sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const j = await resp.json();
    console.log("backend signed result", j);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl">Demo</h1>
      <button onClick={() => setOpen(true)} className="mt-4 p-2 rounded bg-indigo-600 text-white">
        Open Auth Modal
      </button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
      <pre className="mt-4">{JSON.stringify(session, null, 2)}</pre>
      <button onClick={sendToBackend} className="mt-4 p-2 border">
        Send to backend /sign
      </button>
    </div>
  );
}