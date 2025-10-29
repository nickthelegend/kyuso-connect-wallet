# @kyuso/oauth-modal

Beautiful OAuth modal component with popup flow for Next.js applications. Supports Google and GitHub authentication with NextAuth.js.

## Features

- ✅ **Perfect Modal Centering** - Uses react-modal for flawless positioning
- ✅ **Smooth Animations** - Framer Motion transitions
- ✅ **Beautiful Design** - Modern gradients and professional styling
- ✅ **Provider Icons** - Google and GitHub branded buttons
- ✅ **TypeScript Support** - Full type safety
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Popup Flow** - No page redirects, seamless UX

## Installation

```bash
npm install @kyuso/oauth-modal react-modal framer-motion
```

## Peer Dependencies

Make sure you have these installed:

```bash
npm install react react-dom react-modal framer-motion
npm install @types/react-modal # if using TypeScript
```

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from "@kyuso/oauth-modal";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### 2. Use the AuthModal component

```tsx
import { useState } from "react";
import { AuthModal, useAuth } from "@kyuso/oauth-modal";

export default function LoginPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { session } = useAuth();

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>
        Sign In
      </button>
      
      <AuthModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
      
      {session && (
        <div>Welcome, {session.user?.name}!</div>
      )}
    </div>
  );
}
```

### 3. Add CSS for modal animations (optional)

```css
.ReactModal__Overlay {
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.ReactModal__Overlay--after-open {
  opacity: 1;
}

.ReactModal__Overlay--before-close {
  opacity: 0;
}
```

### 4. Create popup callback page

Create `pages/auth/popup-callback.tsx`:

```tsx
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
    <div>Signing you in...</div>
  );
}
```

## API Reference

### AuthProvider

Provides authentication context to child components.

```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### AuthModal

The main modal component for OAuth authentication.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Called when modal should close |
| `providers` | `("google" \| "github")[]` | `["google", "github"]` | OAuth providers to show |

```tsx
<AuthModal 
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  providers={["google", "github"]}
/>
```

### useAuth

Hook to access authentication state.

```tsx
const { session, setSession } = useAuth();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `session` | `Session \| null` | Current user session |
| `setSession` | `(session: Session \| null) => void` | Update session state |

#### Session Type

```tsx
type Session = {
  accessToken?: string | null;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    provider?: string;
  };
} | null;
```

## NextAuth.js Setup

This component works with NextAuth.js. Configure your providers:

```tsx
// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
});
```

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind is configured in your project, or override the styles as needed.

## License

MIT © Kyuso