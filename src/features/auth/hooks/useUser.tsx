import { useQuery } from '@tanstack/react-query';
import axios from '../../../shared/utils/axios';
import type { IUser } from '../../../shared/types/user';
import { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { AxiosError } from 'axios';

const useUser = () => {
    const { setIsAuthenticated, setInitialized } = useAuthStore();
    const { data, isPending, error, isSuccess, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const res = await axios.get('/me');
                return (res.data.user ?? null) as IUser | null;
            } catch (err) {
                if (err instanceof AxiosError && (err.response?.status === 401 || err.status === 401)) {
                    return null;
                }
                throw err;
            }
        },
        retry: false,
    });

    useEffect(() => {
        if (isSuccess || isError) {
          setInitialized();
        }
      }, [isSuccess, isError, setInitialized]);

    useEffect(() => {
        if (isSuccess && data) {
            return setIsAuthenticated(true);
        }

        if (isSuccess && !data) {
            return setIsAuthenticated(false);
        }
    }, [isSuccess, data, setIsAuthenticated]);

    return { data, isPending, error, isSuccess, isLoading };
};

export default useUser;
