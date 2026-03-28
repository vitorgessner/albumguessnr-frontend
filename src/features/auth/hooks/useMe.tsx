import { useCallback } from "react";
import axios from '../../../shared/utils/axios';
import useAuthStore from "../stores/useAuthStore";
import type { IMeResponse, IUserWithProfile } from "../../../shared/types/user";

const useMe = () => {
    const { setUser, setIsLoading } = useAuthStore();
    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get<IMeResponse>('/me');
            if (!response.data.user) {
                return null;
            }
    
            const user: IUserWithProfile = response.data.user;
            setUser(user);
    
            return user;
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [setUser, setIsLoading])

    return fetchUser;
}

export default useMe;