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
            if (!error.config) return null;
            if (
                error.status === 401 &&
                error.response?.data.message === 'Invalid or expired token' &&
                error.config?.url !== `${import.meta.env.VITE_API_URL}/refresh`
            ) {
                try {
                    if (!refreshPromise) refreshPromise = axiosInstance.post('/refresh');
                    await refreshPromise;
                    refreshPromise = null;
                    return axiosInstance(error.config);
                } catch (err) {
                    const { setIsAuthenticated } = useAuthStore.getState();
                    if (err instanceof AxiosError) {
                        refreshPromise = null;
                        if (err.status === 401) {
                            queryClient.clear();
                            setIsAuthenticated(false);
                            return (window.location.href = `${window.location.origin}/auth`);
                        }
                        return err.response?.data.message;
                    }
                    console.log(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
