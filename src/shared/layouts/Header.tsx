import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "../utils/axios";
import useAuthStore from '../../features/auth/stores/useAuthStore';
import { Pencil, Calendar, ShoppingBasket, LogOut } from 'lucide-react';
import { toast, ToastContainer } from "react-toastify";
import useUser from "../../features/auth/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
    const { user } = useUser();
    const { isAuthenticated, setIsLoggingOut, setIsAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const { isModalOpen, setIsModalOpen } = useAuthStore();

    const navigate = useNavigate();
    const path = useLocation();

    useEffect(() => {
        if (path.state){
            if (path.state?.message) {
                toast.error(path.state.message);
            }
        }
    }, [path.state])

    const handleLogout = async () => {
        setIsModalOpen(false);
        setIsLoggingOut(true);
        try {
            await axios.post('/logout');
            queryClient.clear();
            setIsAuthenticated(false);
            navigate('/auth', { state: { intentional: true } });
        } catch (err) {
            console.log(err);
            navigate(path.pathname, { state: { message: 'Logout failed' } });
        }
    }

    return (
        <>
            <header className="bg-(--primary-color) p-3 fixed w-full flex items-center z-10">
                <div className="flex justify-center grow">
                    <Link to={'/'}><h1 className="uppercase text-(--text) text-xl text-center font-semibold">AlbumGuessnr</h1></Link>
                    {!isAuthenticated && !(path.pathname === '/auth') && <Link to={'/auth'} className="absolute right-5 underline">Log in or create an account</Link>}
                </div>
                <div className="absolute right-5 flex items-center justify-right gap-5">
                    {isAuthenticated && <Link to={'/guess'}>Guess</Link>}
                    {isAuthenticated && <button className="cursor-pointer"><img src={user?.profile.avatar_url} className="w-10 h-10 rounded-full object-cover" onClick={() => setIsModalOpen(!isModalOpen)} /></button>}
                </div>
                {isModalOpen && <aside className="bg-(--primary-color) fixed flex flex-col right-4 top-15 justify-center gap-3 w-55">
                    <div className="flex px-3 pt-3 gap-3">
                        <Link to={`/profile/${user?.profile.username}`}><img src={user?.profile.avatar_url} alt="" className="min-w-12 w-12 min-h-12 h-12 rounded-full object-cover" /></Link>
                        <div className="flex flex-col">
                            <span>{user?.profile.username}</span>
                            <span>478 pontos</span>
                        </div>
                    </div>
                    <button className="bg-(--secondary-color) py-1 border-2 text-center mx-auto px-8">Benefícios pro</button>
                    <div className="bg-(--secondary-color) flex justify-around py-2 w-full">
                        <button onClick={() => {
                            navigate(`/profile/${user?.profile.username}/edit`);
                            setIsModalOpen(false);
                        }}><Pencil size={30} /></button>
                        <button><Calendar size={30} /></button>
                        <button><ShoppingBasket size={30} /></button>
                        <button onClick={handleLogout}><LogOut size={30} /></button>
                    </div>
                </aside>}
            </header>
            <ToastContainer />
            <Outlet/>
        </>
    )
}

export default Header;