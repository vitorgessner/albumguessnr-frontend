import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <span className="text-2xl text-(--loading-text)">Loading user</span>
    }

    if (!isAuthenticated) {
        return <Navigate to={'/auth'} state={{ message: 'Not authenticated' }} />;
    }

    return <Outlet />
}

export default ProtectedRoute;