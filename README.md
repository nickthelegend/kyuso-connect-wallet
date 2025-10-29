# OAuth Modal System with Vault Signing

Complete OAuth modal system with reusable UI package, popup flow, and backend integration.

## Structure

```
/repo
  /packages
    /ui-auth-modal          # Reusable UI package
  /examples  
    /next-app              # Next.js example with NextAuth
  /backend                 # Express server with Vault signing
```

## Quick Setup

### 1. Install Dependencies

```bash
# UI Package
cd packages/ui-auth-modal
npm install

# Next.js App
cd examples/next-app
npm install

# Backend
cd backend
npm install
```

### 2. Environment Setup

Copy `examples/next-app/.env.local.example` to `.env.local` and fill in your OAuth credentials:

```bash
cd examples/next-app
cp .env.local.example .env.local
```

### 3. Run Services

```bash
# Terminal 1: Backend (port 3000)
cd backend
npm start

# Terminal 2: Next.js (port 3001)  
cd examples/next-app
npm run dev
```

### 4. Test Flow

1. Open http://localhost:3001
2. Click "Open Auth Modal"
3. Sign in with Google/GitHub
4. Click "Send to backend /sign" to test Vault integration

## How It Works

1. **AuthModal** opens OAuth provider in popup
2. **Popup callback** receives session and postMessages to parent
3. **Parent** receives session with access token
4. **Backend proxy** forwards token to signing service
5. **Vault** signs transaction using stored keys

## Key Files

- `packages/ui-auth-modal/src/AuthModal.tsx` - Modal component
- `examples/next-app/pages/auth/popup-callback.tsx` - OAuth callback
- `examples/next-app/pages/api/proxy-sign.ts` - Backend proxy
- `backend/server.js` - Vault signing service

## Customization

- Add more OAuth providers in NextAuth config
- Style the modal with Tailwind classes
- Extend AuthProvider with additional session data
- Add token validation in backend