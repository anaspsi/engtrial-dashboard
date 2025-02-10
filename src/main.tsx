import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='engtrial-dashboard/insight'>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
