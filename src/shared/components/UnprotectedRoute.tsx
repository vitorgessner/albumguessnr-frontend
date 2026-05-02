import { Outlet, Navigate, useLocation } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const UnprotectedRoute = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (isAuthenticated && !location.pathname.startsWith('/verify/')) {
        return <Navigate to={'/'} state={{ message: 'Already logged in' }} />;
    }

    return <Outlet />
}

export default UnprotectedRoute;