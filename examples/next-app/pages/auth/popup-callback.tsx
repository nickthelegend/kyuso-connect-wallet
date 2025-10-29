import { useEffect } from "react";

export default function PopupCallback() {
  useEffect(() => {
    async function sendSession() {
      try {
        const resp = await fetch("/api/auth/session");
        const session = await resp.json();
        if (window.opener) {
          window.opener.postMessage({ type: "OAUTH_SESSION", session }, window.location.origin);
        }
      } catch (err) {
        if (window.opener) {
          window.opener.postMessage({ type: "OAUTH_SESSION", session: null, error: "no-session" }, window.location.origin);
        }
      }
    }
    sendSession();
  }, []);

  return <div className="p-6">Signing in... you can close this window if it doesn't close automatically.</div>;
}