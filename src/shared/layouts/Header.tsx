import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from '../utils/axios';
import useAuthStore from '../../features/auth/stores/useAuthStore';
import { Pencil, LogOut, Trophy, Gamepad, Calendar } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import useUser from '../../features/auth/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import * as CookieConsent from 'vanilla-cookieconsent';

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

    const loadAnalyticsScript = () => {
        if (CookieConsent.acceptedCategory('analytics') && import.meta.env.PROD) {
            if (
                document.querySelector(
                    `script[src="https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GTAG_ID}"]`
                )
            ) {
                console.log('Analytics script already working');
                return;
            }

            console.log('accepted analytics cookie');
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GTAG_ID}`;
            script.async = true;

            document.head.appendChild(script);
            script.onload = () => {
                console.log('loaded analytics script');
            };
            script.onerror = () => {
                throw new Error('Failed to load analytics script');
            };

            const script2 = document.createElement('script');
            script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${import.meta.env.VITE_GTAG_ID}', { send_page_view: false } );
        `;

            document.head.appendChild(script2);

            script2.onerror = () => {
                throw new Error('Failed to load analytics script2');
            };

            console.log('loaded analytics script 2');
        }
    };

    useEffect(() => {
        CookieConsent.run({
            categories: {
                necessary: {
                    enabled: true,
                    readOnly: true,
                },
                analytics: {},
            },
            language: {
                default: 'en',
                translations: {
                    en: {
                        consentModal: {
                            title: 'We use cookies 🍪',
                            description: `We're a university graduating project! We use essential cookies to keep the site running smoothly, and optional analytics cookies to understand how people use AlbumGuessnr — this data directly helps our academic project. Tracking will only be enabled with your explicit consent.`,
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            showPreferencesBtn: 'Manage individual preferences',
                        },
                        preferencesModal: {
                            title: 'Manage cookie preferences',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            savePreferencesBtn: 'Accept current selection',
                            closeIconLabel: 'Close modal',
                            sections: [
                                {
                                    title: 'Tracking technologies and your consent',
                                    description:
                                        'Cookies are small files that websites place on your device to remember preferences and understand how the site is used. You can change your mind about these at any time.',
                                },
                                {
                                    title: 'Strictly Necessary cookies',
                                    description:
                                        "These cookies are essential for the site to work properly — for example, keeping you logged in. They can't be disabled.",
                                    linkedCategory: 'necessary',
                                },
                                {
                                    title: 'Performance and Analytics',
                                    description:
                                        "AlbumGuessnr is part of an academic research project, and these cookies help us understand how people actually use the app — like which screens get the most attention and whether people come back to play again. All data is anonymized and can't be used to identify you. It's a big help for our research, but totally optional!",
                                    linkedCategory: 'analytics',
                                },
                            ],
                        },
                    },
                },
            },
            disablePageInteraction: true,
            onConsent: () => {
                loadAnalyticsScript();
            },
            onChange: function ({ changedCategories }) {
                if (!changedCategories.includes('analytics')) {
                    return;
                }

                loadAnalyticsScript();

                if (!CookieConsent.acceptedCategory('analytics')) {
                    CookieConsent.eraseCookies(['_gid', /^_ga/]);
                    location.reload();
                }
            },
        });
    }, []);

    const avatar_url = user && user.profile ? user.profile.avatar_url : 'https://niipndjhivstawptgjsp.supabase.co/storage/v1/object/public/profilePictures/uploads/default.svg';

    return (
        <div className="h-dvh flex flex-col overflow-hidden">
            <header className="sticky top-0 flex items-center z-1000 p-3 w-full bg-(--card-light)">
                {!isPending && (
                    <div className="absolute left-5 flex items-center justify-right gap-5 text-navy tracking-tight font-heading font-semibold">
                        {isAuthenticated && (
                            <div className="flex items-center gap-5">
                                <Link
                                    to={'/dailyAlbum'}
                                    className="hidden xl:flex items-center text-sm sm:text-base gap-2 border-2 py-0.25 px-2 rounded-lg light-sage-component"
                                >
                                    Daily album <Calendar size={30} className="mt-0.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
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
                {/* <div></div> */}
                {!isPending && (
                    <div className="absolute right-5 flex items-center justify-right gap-5 text-navy tracking-tight font-heading font-semibold">
                        {isAuthenticated && (
                            <div className="flex items-center gap-5">
                                <button
                                    className="hidden md:flex items-center gap-2 border-2 py-1 px-2 rounded-lg amber-component"
                                    onClick={() => {
                                        navigate(`/leaderboards`);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Leaderboards <Trophy size={25} />
                                </button>
                                <Link
                                    to={'/guess'}
                                    className="flex items-center text-sm sm:text-base gap-2 border-2 py-0.25 px-2 rounded-lg white-component"
                                >
                                    Guess now <Gamepad size={30} className="mt-0.5" />
                                </Link>
                                <Link
                                    to={'/dailyAlbum'}
                                    className="hidden sm:flex xl:hidden items-center text-sm sm:text-base gap-2 border-2 py-0.25 px-2 rounded-lg light-sage-component"
                                >
                                    Daily album <Calendar size={30} className="mt-0.5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hidden lg:flex items-center gap-2 border-2 py-1 px-2 rounded-lg terra-component"
                                >
                                    Logout <LogOut size={25} />
                                </button>
                                <button className="cursor-pointer">
                                    <img
                                        src={avatar_url}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onClick={() => !user?.isGuest ? setIsModalOpen(!isModalOpen) : navigate('auth/login')}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!isPending && isModalOpen && !user?.isGuest && (
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
                                <span>{user?.profile.displayUsername}</span>
                                <span>{user?.userStats.totalScore} points</span>
                            </div>
                        </div>
                        <div className="bg-(--card-light) rounded-b-lg flex w-full">
                            <button
                                className="hidden md:flex md:justify-center grow gap-2 lg:py-2 rounded-b-lg items-center hover:bg-white"
                                onClick={() => {
                                    navigate(`/profile/${user?.profile.username}/edit`);
                                    setIsModalOpen(false);
                                }}
                            >
                                Edit profile <Pencil size={30} />
                            </button>
                            <button
                                className="flex justify-center h-full py-2 rounded-bl-lg md:hidden w-full gap-2 items-center hover:bg-white"
                                onClick={() => {
                                    navigate(`/profile/${user?.profile.username}/edit`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Pencil size={30} />
                            </button>
                            <button
                                className="flex justify-center h-full py-2 w-full md:hidden hover:bg-amber"
                                onClick={() => {
                                    navigate(`/leaderboards`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Trophy size={30} />
                            </button>
                            <button
                                className="flex justify-center h-full py-2 w-full sm:hidden hover:bg-(--sage-light)"
                                onClick={() => {
                                    navigate(`/dailyAlbum`);
                                    setIsModalOpen(false);
                                }}
                            >
                                <Calendar size={30} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex justify-center w-full sm:w-fit sm:px-3 h-full py-2 rounded-br-lg lg:hidden hover:bg-(--terra-light)"
                            >
                                <LogOut size={30} />
                            </button>
                        </div>
                    </aside>
                )}
                {isPending && <Skeleton width={50} height={25} className="absolute right-2" />}
            </header>
            {user && (
                <p className="sticky top-13 z-8 text-xs text-center text-navy w-full bg-(--secondary-color)">
                    This is a beta version, keep in mind that scores might reset in the near future
                    for official releases.
                </p>
            )}
            <ToastContainer />
            <main className="flex-1 grow overflow-y-auto">
                <Outlet />
            </main>
            <button
                type="button"
                data-cc="show-preferencesModal"
                className="absolute z-1000000 left-5 bottom-5 w-13 h-13 text-3xl rounded-full amber-component"
            >
                🍪
            </button>
            <p className="sticky bottom-0 z-10000 bg-transparent pl-4 font-bold tracking-tight font-heading text-xs text-navy-light">
                v0.2.0
            </p>
        </div>
    );
};

export default Header;
