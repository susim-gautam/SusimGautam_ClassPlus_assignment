import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider } from './context/AppProvider'
import App from './App.tsx'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

const app = (
  <AppProvider>
    <App />
  </AppProvider>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
      ) : (
        app
      )}
    </BrowserRouter>
  </StrictMode>
)
