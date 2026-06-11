import { Outlet, Navigate, useLocation } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const UnprotectedRoute = () => {
    const { isAuthenticated, isInitializing } = useAuthStore();
    const location = useLocation();

    if (isInitializing) return null;

    if (isAuthenticated && !location.pathname.startsWith('/verify/')) {
        return <Navigate to={'/'} state={{ message: 'Already logged in' }} />;
    }

    return <Outlet />
}

export default UnprotectedRoute;