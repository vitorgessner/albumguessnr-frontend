import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Index from './features/auth/pages/Index.tsx';
import Header from './shared/layouts/Header.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<App />} />
          <Route path='/auth' element={<Index />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
