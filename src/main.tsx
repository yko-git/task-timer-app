import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// 常にMSWを起動（本番でもモック動作）
const { worker } = await import('./mocks/browser')
await worker.start({
  onUnhandledRequest: 'bypass',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
