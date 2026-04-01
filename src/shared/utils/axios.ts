import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.defaults.withCredentials = true;

axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error instanceof AxiosError){
        if (!error.config) return null;
        if (error.status === 401 && error.response?.data.message === "Expired token" && error.config?.url !== 'http://localhost:3000/refresh') {
            await axios.post('/refresh');
            try {
                return axios(error.config);
            } catch (err) {
                console.log(err);
                window.location.href = `${window.location.origin}/auth`;
            }
        }
    }
})

export default axiosInstance;