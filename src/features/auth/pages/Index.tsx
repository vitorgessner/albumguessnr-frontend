import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import useAuthStore from "../stores/useAuthStore";
import useUser from "../hooks/useUser";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Index = () => {
    const { isPending } = useUser();
    const { setIsLoggingOut } = useAuthStore();

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    if (isPending) return <div className="loading">Loading...</div>

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
            <LoginForm />
            <RegisterForm />
            <ToastContainer />
        </div>
    )
}

export default Index;