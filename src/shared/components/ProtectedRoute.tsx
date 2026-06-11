import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";
import useUser from "@/features/auth/hooks/useUser";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoggingOut, isInitializing } = useAuthStore();
    const { isPending } = useUser();

    if (isInitializing) return null;


    if (!isAuthenticated && !isLoggingOut && !isPending) {
        return <Navigate to={'/auth/login'} state={{ message: 'Not authenticated', intentional: false }} />;
    }

    return <Outlet />
}

export default ProtectedRoute;