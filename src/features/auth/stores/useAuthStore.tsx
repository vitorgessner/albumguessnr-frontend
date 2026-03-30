import { create } from "zustand";
import type { IUserWithProfile } from "../../../shared/types/user";

interface IAuthState {
    user: IUserWithProfile | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingOut: boolean;

    setUser: (user: IUserWithProfile) => void;
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