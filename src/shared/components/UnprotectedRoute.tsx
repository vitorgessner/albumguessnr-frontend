import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const UnprotectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <span className="text-2xl text-(--loading-text)">Loading user</span>
    }

    if (isAuthenticated) {
        return <Navigate to={'/'} state={{ message: 'ALready logged in' }} />;
    }

    return <Outlet />
}

export default UnprotectedRoute;