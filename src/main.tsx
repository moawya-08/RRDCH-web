import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import App from './App'
import { convex } from './lib/convex'
import { authClient } from './lib/auth-client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <App />
    </ConvexBetterAuthProvider>
  </React.StrictMode>,
)
