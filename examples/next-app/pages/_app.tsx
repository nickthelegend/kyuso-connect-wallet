import "../styles/globals.css";
import { AuthProvider } from "ui-auth-modal";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}