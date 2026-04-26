import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoggingOut } = useAuthStore();

    if (!isAuthenticated && !isLoggingOut) {
        return <Navigate to={'/auth'} state={{ message: 'Not authenticated', intentional: false }} />;
    }

    return <Outlet />
}

export default ProtectedRoute;