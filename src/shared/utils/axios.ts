import useAuthStore from '@/features/auth/stores/useAuthStore';
import axios, { AxiosError } from 'axios';
import queryClient from './queryClient';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.defaults.withCredentials = true;

let refreshPromise: Promise<unknown> | null = null;
let sessionsExpired = false;

const AUTH_PAGES = ['/auth/login', '/auth/register'];
const GUEST_ROUTES = ['/daily-album', '/', '/leaderboards'];

const isGuestRoute = () =>
    GUEST_ROUTES.some((route) => window.location.pathname.startsWith(route));

const handleDeadSession = () => {
    if (isGuestRoute()) return;
    if (sessionsExpired) return;
    sessionsExpired = true;

    useAuthStore.getState().setIsAuthenticated(false);
    queryClient.clear();

    const isOnPublicPage = AUTH_PAGES.some((page) =>
        window.location.pathname.startsWith(page)
    );
    if (!isOnPublicPage) {
        window.location.href = `${window.location.origin}/auth/login`;
    }
};

export const resetSessionGuard = () => {
    sessionsExpired = false;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!(error instanceof AxiosError)) return Promise.reject(error);

        const { isLoggingOut } = useAuthStore.getState();
        if (isLoggingOut) return Promise.reject(error);
        if (!error.config) return Promise.reject(error);

        if (error.response?.data?.code === 'RESYNC_TOO_SOON') {
            return error.response;
        }

        const config = error.config as typeof error.config & { _retry?: boolean };
        const status = error.response?.status ?? error.status;
        const message = error.response?.data?.message;

        const isRefreshCall = Boolean(config.url?.includes('/refresh'));
        const isTokenError =
            status === 401 &&
            (message === 'Invalid or expired token' || message === 'Invalid token format');

        if (isRefreshCall && status === 401) {
            handleDeadSession();
            return Promise.reject(error);
        }

        if (!isTokenError || isRefreshCall || config._retry || sessionsExpired) {
            return Promise.reject(error);
        }

        config._retry = true;

        try {
            refreshPromise ??= axiosInstance
                .post('/refresh')
                .finally(() => {
                    refreshPromise = null;
                });
            await refreshPromise;
            return axiosInstance(config);
        } catch (err) {
            handleDeadSession();
            return Promise.reject(err);
        }
    }
);

export default axiosInstance;