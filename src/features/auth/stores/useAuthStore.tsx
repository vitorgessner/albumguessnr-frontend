import { create } from "zustand";
import type { IUserWithProfile } from "../../../shared/types/user";

interface IAuthState {
    user: IUserWithProfile | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    isEditing: boolean;

    setUser: (user: IUserWithProfile) => void;
    logout: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsEditing: (isEditing: boolean) => void;
}

const useAuthStore = create<IAuthState>()((set) => ({
    user: undefined,
    isAuthenticated: false,
    isLoading: true,
    isEditing: false,

    setUser: (user) => set(() => ({
        user,
        isAuthenticated: true,
    })),
    logout: () => set(() => ({ user: undefined, isAuthenticated: false })),
    setIsLoading: (isLoading) => set(() => ({
        isLoading,
    })),

    setIsEditing: (isEditing) => set(() => ({
        isEditing,
    }))
}))

export default useAuthStore;