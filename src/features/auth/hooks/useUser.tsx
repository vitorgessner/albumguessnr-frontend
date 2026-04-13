import { useQuery } from "@tanstack/react-query";
import axios from "../../../shared/utils/axios";
import type { IMeResponse, IUser } from "../../../shared/types/user";
import { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { AxiosError } from "axios";

const useUser = () => {
    const { setIsAuthenticated } = useAuthStore();
    const { data: user, isPending, error, isSuccess } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const response: Promise<IUser | undefined | null> = axios.get<IMeResponse>('/me')
                .then(res => res.data.user)
                .catch((err) => {
                    if (err instanceof AxiosError && err.status === 401) return null;
                    throw err;
                })
            return response;
        }
    })

    useEffect(() => {
        if (isSuccess && user) {
            setIsAuthenticated(true);
        }
    }, [isSuccess, user, setIsAuthenticated])

    return { user, isPending, error, isSuccess }
}

export default useUser;