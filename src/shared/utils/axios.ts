import useAuthStore from '@/features/auth/stores/useAuthStore';
import axios, { AxiosError } from 'axios';
import queryClient from './queryClient';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.defaults.withCredentials = true;

let refreshPromise: Promise<any> | null = null;

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error instanceof AxiosError) {
            const { isLoggingOut } = useAuthStore.getState();
            if (isLoggingOut) return Promise.reject(error);
            if (!error.config) return Promise.reject(error);
            if (
                error.status === 401 &&
                (error.response?.data.message === 'Invalid or expired token' || error.response?.data.message === 'Invalid token format') &&
                error.config?.url !== `/refresh`
            ) {
                try {
                    if (!refreshPromise) refreshPromise = axiosInstance.post('/refresh');
                    await refreshPromise;
                    refreshPromise = null;
                    return axiosInstance(error.config);
                } catch (err) {
                    const { setIsAuthenticated } = useAuthStore.getState();
                    refreshPromise = null;
                    if (err instanceof AxiosError) {
                        if (err.status === 401) {
                            if (error.response.data.message === 'Invalid or expired token') {
                                setIsAuthenticated(false);
                                queryClient.clear();
                                return (window.location.href = `${window.location.origin}/auth/login`);
                            }
                        }
                        return Promise.reject(err);
                    }
                    console.log(err);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
