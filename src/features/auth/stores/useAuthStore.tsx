import { create } from "zustand";

interface IAuthState {
    isAuthenticated: boolean;
    isLoggingOut: boolean;
    isModalOpen: boolean;

    setIsLoggingOut: (isLoggingOut: boolean) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsModalOpen: (isModalOpen: boolean) => void;
}

const useAuthStore = create<IAuthState>()((set) => ({
    isAuthenticated: false,
    isLoggingOut: false,
    isModalOpen: false,

    setIsLoggingOut: (isLoggingOut) => set(() => ({
        isLoggingOut,
    })),

    setIsAuthenticated: (isAuthenticated) => set(() => ({
        isAuthenticated,
    })),

    setIsModalOpen: (isModalOpen) => set(() => ({
        isModalOpen,
    }))
}))

export default useAuthStore;