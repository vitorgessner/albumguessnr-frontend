import { Outlet, Navigate, useLocation } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";
import useUser from "@/features/auth/hooks/useUser";

const UnprotectedRoute = () => {
    const { isAuthenticated, isInitializing } = useAuthStore();
    const location = useLocation();
    const { data } = useUser();

    if (isInitializing) return null;

    if (!data?.isGuest && isAuthenticated && !location.pathname.startsWith('/verify/')) {
        return <Navigate to={'/'} state={{ message: 'Already logged in' }} />;
    }

    return <Outlet />
}

export default UnprotectedRoute;