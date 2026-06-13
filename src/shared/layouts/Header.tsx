import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from '../utils/axios';
import useAuthStore from '../../features/auth/stores/useAuthStore';
import { Pencil, LogOut, Trophy, Gamepad } from 'lucide-react';
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
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    }, [queryClient, isModalOpen]);

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
        <div className="min-h-dvh flex flex-col">
            <header className="sticky top-0 flex items-center z-1000 p-3 w-full bg-(--card-light)">
                <div className="flex justify-left xl:justify-center items-center grow pl-4 lg:pl-0">
                    <Link to={'/'}>
                        <h1 className="uppercase text-(--text) text-xl text-center font-black font-heading tracking-tight">
                            AlbumGuessnr
                        </h1>
                    </Link>
                    {!isPending &&
                        !isAuthenticated &&
                        !(
                            path.pathname === '/auth/login' || path.pathname === '/auth/register'
                        ) && (
                            <>
                                <Link to="/auth/register" className="absolute right-5">
                                    Sign up
                                </Link>
                            </>
                        )}
                </div>
                <div></div>
                {!isPending && (
                    <div className="absolute right-5 flex items-center justify-right gap-5 text-navy tracking-tight font-heading font-semibold">
                        {/* {isAuthenticated && <Link to={'/guess'}>Guess</Link>} */}
                        {isAuthenticated && (
                            <div className="flex items-center gap-5">
                                <button
                                    className="hidden sm:flex items-center gap-2 border-2 py-1 px-2 rounded-lg amber-component"
                                    onClick={() => {
                                        navigate(`/leaderboards`);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Leaderboards <Trophy size={25}/>
                                </button>
                                <Link to={'/guess'} className='flex items-center text-sm sm:text-base gap-2 border-2 py-0.25 px-2 rounded-lg white-component'>
                                    Play now <Gamepad size={30} className='mt-0.5' />
                                </Link>
                                <button onClick={handleLogout} className="hidden md:flex items-center gap-2 border-2 py-1 px-2 rounded-lg terra-component">
                                    Logout <LogOut size={25} />
                                </button>
                                <button className="cursor-pointer">
                                    <img
                                        src={user?.profile.avatar_url}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onClick={() => setIsModalOpen(!isModalOpen)}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!isPending && isModalOpen && (
                    <aside className="bg-(--primary-color) border-2 border-border rounded-lg fixed flex flex-col right-4 top-15 justify-center gap-3 w-55 text-navy font-heading font-semibold">
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
                        <div className="bg-(--card-light) rounded-b-lg flex w-full">
                            <button
                            className='hidden sm:flex sm:justify-center grow gap-2 md:py-2 rounded-b-lg items-center hover:bg-white'
                                onClick={() => {
                                    navigate(`/profile/${user?.profile.username}/edit`);
                                    setIsModalOpen(false);
                                }}
                            >
                                Edit profile <Pencil size={30} />
                            </button>
                            <button
                            className='flex justify-center h-full py-2 rounded-bl-lg sm:hidden w-full gap-2 items-center hover:bg-white'
                                onClick={() => {
                                    navigate(`/profile/${user?.profile.username}/edit`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Pencil size={30} />
                            </button>
                            <button
                                className='flex justify-center h-full py-2 w-full sm:hidden hover:bg-amber'
                                onClick={() => {
                                    navigate(`/leaderboards`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Trophy size={30} />
                            </button>
                            <button onClick={handleLogout} className='flex justify-center w-full sm:w-fit sm:px-3 h-full py-2 rounded-br-lg md:hidden hover:bg-terra'>
                                <LogOut size={30} />
                            </button>
                        </div>
                    </aside>
                )}
                {isPending && <Skeleton width={50} height={25} className="absolute right-2" />}
            </header>
            {user && <p className='sticky top-13 z-8 text-xs text-center text-navy w-full bg-(--secondary-color)'>This is a beta version, keep in mind that scores might reset in the near future for official releases.</p>}
            <ToastContainer />
            <main className="flex-1">
                <Outlet />
            </main>
            <p className='sticky bottom-0 z-10000 bg-transparent pl-4 font-bold tracking-tight font-heading text-xs text-navy-light'>v0.1.2</p>
        </div>
    );
};

export default Header;
