import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, isLoggingOut } = useAuthStore();

    if (isLoading) {
        return <span className="text-2xl text-(--loading-text)">Loading user</span>
    }

    if (!isAuthenticated && !isLoggingOut) {
        return <Navigate to={'/auth'} state={{ message: 'Not authenticated', intentional: false }} />;
    }

    return <Outlet />
}

export default ProtectedRoute;