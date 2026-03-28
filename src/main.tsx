import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
import Index from './features/auth/pages/Index.tsx';
import Profile from './features/auth/pages/Profile.tsx';
import Header from './shared/layouts/Header.tsx';
import NotFoundPage from './shared/pages/NotFoundPage.tsx';
import ProtectedRoute from './shared/components/ProtectedRoute.tsx';
import UnprotectedRoute from './shared/components/UnprotectedRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<App />} />
          <Route element={<UnprotectedRoute />}>
            <Route path='/auth' element={<Index />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/:username/profile/edit' element={<Profile />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
