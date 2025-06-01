import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; color: red;">
      <h2>Error Loading App</h2>
      <p>Check the browser console for details.</p>
      <pre>${error}</pre>
    </div>
  `
}
