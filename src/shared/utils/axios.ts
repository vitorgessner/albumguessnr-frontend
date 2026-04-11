import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error instanceof AxiosError) {
        if (!error.config) return null;
        if (error.status === 401 && error.response?.data.message === "Expired token" && error.config?.url !== `${import.meta.env.VITE_API_URL}/refresh`) {
            try {
                await axiosInstance.post('/refresh');
                return axiosInstance(error.config);
            } catch (err) {
                if (err instanceof AxiosError) {
                    if (err.status === 401) return window.location.href = `${window.location.origin}/auth`;
                    return err.response?.data.message;
                }
                console.log(err);
            }
        }
    }
    return Promise.reject(error);
})

export default axiosInstance;