import { useQuery } from '@tanstack/react-query';
import axios from '../../../shared/utils/axios';
import type { IMeResponse, IUser } from '../../../shared/types/user';
import { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { AxiosError } from 'axios';

const useUser = () => {
    const { setIsAuthenticated } = useAuthStore();
    const { data, isPending, error, isSuccess, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const response: Promise<IUser | undefined | null> = axios
                .get<IMeResponse>('/me')
                .then((res) => res.data.user)
                .catch((err) => {
                    console.log(err);
                    if (err instanceof AxiosError && err.status === 401) return null;
                    throw err;
                });
            return response;
        },
        retry: false,
    });

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
