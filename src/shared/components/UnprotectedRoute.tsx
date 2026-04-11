import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../features/auth/stores/useAuthStore";

const UnprotectedRoute = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to={'/'} state={{ message: 'Already logged in' }} />;
    }

    return <Outlet />
}

export default UnprotectedRoute;