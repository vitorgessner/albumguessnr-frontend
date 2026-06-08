import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import Profile from './features/auth/pages/Profile.tsx';
import Header from './shared/layouts/Header.tsx';
import NotFoundPage from './shared/pages/NotFoundPage.tsx';
import ProtectedRoute from './shared/components/ProtectedRoute.tsx';
import UnprotectedRoute from './shared/components/UnprotectedRoute.tsx';
import EditProfile from './features/auth/pages/EditProfile.tsx';
import Guess from './features/game/guess/pages/Guess.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import Forgot from './features/auth/pages/Forgot.tsx';
import PasswordChange from './features/auth/pages/PasswordChange.tsx';
import queryClient from './shared/utils/queryClient.ts';
import Login from './features/auth/pages/Login.tsx';
import Register from './features/auth/pages/Register.tsx';
import VerifyToken from './features/auth/components/VerifyToken.tsx';
import { SkeletonTheme } from 'react-loading-skeleton';
import Leaderboards from './features/leaderboards/pages/Leaderboards.tsx';
import Test from './features/auth/components/Test.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <SkeletonTheme baseColor="#DAC3BB" highlightColor="#ebd9d4">
                <BrowserRouter>
                    <Routes>
                        <Route element={<Header />}>
                            <Route path="/" element={<App />} />
                            <Route path="/leaderboards" element={<Leaderboards />} />
                            <Route element={<UnprotectedRoute />}>
                                <Route path="/auth/register" element={<Register />} />
                                <Route path="/auth/login" element={<Login />} />
                                <Route path="/auth/forgot" element={<Forgot />} />
                                <Route path="/test" element={<Test />} />
                                <Route
                                    path="/auth/:username/passwordChange"
                                    element={<PasswordChange />}
                                />
                                <Route path="/verify/:token" element={<VerifyToken />} />
                            </Route>
                            <Route path="/profile/:username" element={<Profile />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/profile/:username/edit" element={<EditProfile />} />
                                <Route path="/guess" element={<Guess />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </SkeletonTheme>
        </QueryClientProvider>
    </StrictMode>
);
