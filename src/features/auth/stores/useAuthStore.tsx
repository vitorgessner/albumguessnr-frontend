import { create } from "zustand";
import type { IUserWithProfileAndLastfmIntegration } from "../../../shared/types/user";

interface IAuthState {
    user: IUserWithProfileAndLastfmIntegration | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingOut: boolean;

    setUser: (user: IUserWithProfileAndLastfmIntegration) => void;
    logout: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsLoggingOut: (isLoggingOut: boolean) => void;
}

const useAuthStore = create<IAuthState>()((set) => ({
    user: undefined,
    isAuthenticated: false,
    isLoading: true,
    isLoggingOut: false,

    setUser: (user) => set(() => ({
        user,
        isAuthenticated: true,
    })),
    logout: () => set(() => ({ user: undefined, isAuthenticated: false })),
    setIsLoading: (isLoading) => set(() => ({
        isLoading,
    })),

    setIsLoggingOut: (isLoggingOut) => set(() => ({
        isLoggingOut,
    }))
}))

export default useAuthStore;