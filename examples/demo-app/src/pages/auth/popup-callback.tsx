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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
        <p className="text-gray-600">This window will close automatically</p>
      </div>
    </div>
  );
}