import { useQuery } from "@tanstack/react-query";
import axios from "../../../shared/utils/axios";
import type { IMeResponse, IUser } from "../../../shared/types/user";
import { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";

const useUser = () => {
    const { setIsAuthenticated } = useAuthStore();
    const { data: user, isPending, error, isSuccess } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const response: Promise<IUser | undefined> = axios.get<IMeResponse>('/me').then(res => res.data.user)
            return response;
        }
    })

    useEffect(() => {
        if (isSuccess) {
            setIsAuthenticated(true);
        }
    }, [isSuccess, setIsAuthenticated])

    return { user, isPending, error, isSuccess }
}

export default useUser;