import useAuthStore from '@/features/auth/stores/useAuthStore';
import axios, { AxiosError } from 'axios';
import queryClient from './queryClient';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.defaults.withCredentials = true;

let refreshPromise: Promise<unknown> | null = null;
let sessionsExpired = false;

const NO_LOGIN_REDIRECT_PATHS = ['/auth/login', '/auth/register', '/daily-album', '/', '/leaderboards'];

const isDailyAlbumRoute = () =>
    window.location.pathname.startsWith('/daily-album');

const getMaxRefreshAttempts = () => (isDailyAlbumRoute() ? 3 : 1);

const handleDeadSession = () => {
    if (sessionsExpired) return;
    sessionsExpired = true;

    useAuthStore.getState().setIsAuthenticated(false);
    queryClient.clear();

    const shouldStayOnCurrentPage = NO_LOGIN_REDIRECT_PATHS.some((path) =>
        window.location.pathname.startsWith(path)
    );

    if (!shouldStayOnCurrentPage) {
        window.location.href = `${window.location.origin}/auth/login`;
    }
};

export const resetSessionGuard = () => {
    sessionsExpired = false;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!(error instanceof AxiosError)) {
            return Promise.reject(error);
        }

        const { isLoggingOut } = useAuthStore.getState();
        if (isLoggingOut) {
            return Promise.reject(error);
        }

        if (!error.config) {
            return Promise.reject(error);
        }

        if (error.response?.data?.code === 'RESYNC_TOO_SOON') {
            return error.response;
        }

        const config = error.config as typeof error.config & { _refreshCount?: number };
        const status = error.response?.status ?? error.status;
        const message = error.response?.data?.message;

        const isRefreshCall = Boolean(config.url?.includes('/refresh'));
        const isTokenError =
            status === 401 &&
            (message === 'Invalid or expired token' || message === 'Invalid token format');

        if (isRefreshCall && status === 401) {
            // Em /daily-album, evita matar a sessão logo no primeiro 401 do /refresh
            if (!isDailyAlbumRoute()) {
                handleDeadSession();
            }
            return Promise.reject(error);
        }

        const maxAttempts = getMaxRefreshAttempts();
        const currentAttempt = config._refreshCount ?? 0;

        if (!isTokenError || isRefreshCall || currentAttempt >= maxAttempts) {
            if (currentAttempt >= maxAttempts && !isDailyAlbumRoute()) {
                handleDeadSession();
            }
            return Promise.reject(error);
        }

        if (sessionsExpired && !isDailyAlbumRoute()) {
            return Promise.reject(error);
        }

        config._refreshCount = currentAttempt + 1;

        try {
            // Cria uma nova promise de refresh a cada tentativa (útil quando há múltiplas tentativas em /daily-album)
            refreshPromise = axiosInstance.post('/refresh').finally(() => {
                refreshPromise = null;
            });

            await refreshPromise;
            return axiosInstance(config);
        } catch (err) {
            if (!isDailyAlbumRoute()) {
                handleDeadSession();
            }
            return Promise.reject(err);
        }
    }
);

export default axiosInstance;