import { useEffect } from "react";

export default function PopupCallback() {
  useEffect(() => {
    async function sendSession() {
      try {
        const resp = await fetch("/api/auth/session");
        const session = await resp.json();
        
        if (window.opener) {
          window.opener.postMessage(
            { type: "OAUTH_SESSION", session }, 
            window.location.origin
          );
        }
      } catch (err) {
        if (window.opener) {
          window.opener.postMessage(
            { type: "OAUTH_SESSION", session: null, error: "no-session" }, 
            window.location.origin
          );
        }
      }
    }
    
    sendSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing in...</p>
      </div>
    </div>
  );
}