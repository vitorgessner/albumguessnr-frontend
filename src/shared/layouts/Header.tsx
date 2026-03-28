import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "../utils/axios";
import useAuthStore from '../../features/auth/stores/useAuthStore';
import useMe from "../../features/auth/hooks/useMe";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const fetchUser = useMe();

    const navigate = useNavigate();
    const path = useLocation();

    useEffect(() => {
        const fetch = async () => {
            await fetchUser()
        }

        fetch();
    }, [fetchUser])

    const handleClick = async () => {
        console.log('clicou', user?.email);
        logout();
        try {
            await axios.post('/logout');
            navigate('/auth', { state: {}});
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <header className="bg-(--primary-color) p-3 fixed w-full flex justify-center">
                <h1 className="uppercase text-(--text) text-xl text-center font-semibold">AlbumGuessnr</h1>
                {!isAuthenticated && !(path.pathname === '/auth') && <Link to={'/auth'} className="absolute right-5 underline">Log in or create an account</Link>}
                {isAuthenticated && <button className="absolute right-5 cursor-pointer"
                    onClick={handleClick}>Logout</button>}
            </header>
            <Outlet />
        </>
    )
}

export default Header;