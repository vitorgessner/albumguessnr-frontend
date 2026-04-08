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
import EditProfile from './features/auth/pages/EditProfile.tsx';
import Guess from './features/game/guess/pages/Guess.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<App />} />D
          <Route element={<UnprotectedRoute />}>
            <Route path='/auth' element={<Index />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/profile/:username' element={<Profile />} />
            <Route path='/profile/:username/edit' element={<EditProfile />}/>
            <Route path='/guess' element={< Guess/>}/>
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
