import { create } from 'zustand';

interface IAuthState {
    isAuthenticated: boolean;
    isLoggingOut: boolean;
    isModalOpen: boolean;
    isInitializing: boolean;
    setInitialized: () => void;
    setIsLoggingOut: (isLoggingOut: boolean) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsModalOpen: (isModalOpen: boolean) => void;
}

const useAuthStore = create<IAuthState>()((set) => ({
    isAuthenticated: false,
    isLoggingOut: false,
    isModalOpen: false,
    isInitializing: true,

    setIsLoggingOut: (isLoggingOut) =>
        set(() => ({
            isLoggingOut,
        })),

    setIsAuthenticated: (isAuthenticated) =>
        set(() => ({
            isAuthenticated,
        })),

    setIsModalOpen: (isModalOpen) =>
        set(() => ({
            isModalOpen,
        })),

    setInitialized: () => set({
        isInitializing: false
    })
}));

export default useAuthStore;
