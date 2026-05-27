import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from '../utils/axios';
import useAuthStore from '../../features/auth/stores/useAuthStore';
import { Pencil, Calendar, ShoppingBasket, LogOut, Menu } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import useUser from '../../features/auth/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';

const Header = () => {
    const { data: user, isPending } = useUser();
    const { isAuthenticated, setIsLoggingOut, setIsAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const { isModalOpen, setIsModalOpen } = useAuthStore();

    const navigate = useNavigate();
    const path = useLocation();

    useEffect(() => {
        if (path.state) {
            if (path.state?.message) {
                toast.error(path.state.message);
            }
        }
    }, [path.state]);

    useEffect(() => {
        if (isModalOpen) {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    }, [queryClient, isModalOpen])

    const handleLogout = async () => {
        setIsModalOpen(false);
        setIsLoggingOut(true);
        try {
            await axios.delete('/logout');
            queryClient.clear();
            setIsAuthenticated(false);
            navigate('/auth/login', { state: { intentional: true } });
        } catch (err) {
            console.log(err);
            navigate(path.pathname, { state: { message: 'Logout failed' } });
        }
    };

    return (
        <>
            <header className="sticky top-0 flex items-center z-10 p-3 w-full bg-(--card-light)">
                <div className="flex justify-left lg:justify-center items-center grow pl-4 lg:pl-0">
                    <Link to={'/'}>
                        <h1 className="uppercase text-(--text) text-xl text-center font-semibold">
                            AlbumGuessnr
                        </h1>
                    </Link>
                    {!isPending &&
                        !isAuthenticated &&
                        !(
                            path.pathname === '/auth/login' || path.pathname === '/auth/register'
                        ) && (
                            <>
                                <Menu
                                    size={28}
                                    className="sm:hidden absolute right-5 rounded-sm p-1 bg-(--secondary-color)"
                                />
                                <Link to="/auth/login" className="hidden sm:block absolute right-5">
                                    Login
                                </Link>
                            </>
                        )}
                </div>
                <div></div>
                {!isPending && (
                    <div className="absolute right-5 flex items-center justify-right gap-5">
                        {isAuthenticated && <Link to={'/guess'}>Guess</Link>}
                        {isAuthenticated && (
                            <button className="cursor-pointer">
                                <img
                                    src={user?.profile.avatar_url}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onClick={() => setIsModalOpen(!isModalOpen)}
                                />
                            </button>
                        )}
                    </div>
                )}
                {!isPending && isModalOpen && (
                    <aside className="bg-(--primary-color) border-2 border-border rounded-lg fixed flex flex-col right-4 top-15 justify-center gap-3 w-55">
                        <div className="flex px-3 pt-3 gap-3">
                            <Link to={`/profile/${user?.profile.username}`}>
                                <img
                                    src={user?.profile.avatar_url}
                                    alt=""
                                    className="min-w-12 w-12 min-h-12 h-12 rounded-full object-cover"
                                />
                            </Link>
                            <div className="flex flex-col">
                                <span>{user?.profile.username}</span>
                                <span>{user?.userStats.totalScore} points</span>
                            </div>
                        </div>
                        <button className="bg-(--card-light) rounded-md py-1 border border-terra text-center mx-auto px-8 shadow-terra-ambar">
                            Benefits pro
                        </button>
                        <div className="bg-(--card-light) rounded-b-lg flex justify-around py-2 w-full">
                            <button
                                onClick={() => {
                                    navigate(`/profile/${user?.profile.username}/edit`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Pencil size={30} />
                            </button>
                            <button>
                                <Calendar size={30} />
                            </button>
                            <button>
                                <ShoppingBasket size={30} />
                            </button>
                            <button onClick={handleLogout}>
                                <LogOut size={30} />
                            </button>
                        </div>
                    </aside>
                )}
                {isPending && <Skeleton width={50} height={25} className="absolute right-2" />}
            </header>
            <ToastContainer />
            <main className="main-height">
                <Outlet />
            </main>
        </>
    );
};

export default Header;
