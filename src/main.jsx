import React from 'react'
import ReactDOM from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.jsx'
import './index.css'
import './firebase' // Initialize Firebase

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {import.meta.env.VITE_PUBLIC_POSTHOG_KEY ? (
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: '2025-05-24',
          capture_exceptions: true,
          debug: import.meta.env.MODE === 'development',
        }}
      >
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
