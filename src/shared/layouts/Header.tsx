import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { clearCookie, getCookie } from "../utils/cookie";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            <header className="bg-(--primary-color) p-3 fixed w-full flex justify-center">
                <h1 className="uppercase text-(--text) text-xl text-center font-semibold">AlbumGuessnr</h1>
                {!(location.pathname === '/auth') && !getCookie('token') && <Link to={'/auth'} className="absolute right-5 underline">Log in or create an account</Link>}
                {getCookie('token') && <button className="absolute right-5"
                    onClick={() => {
                        clearCookie('token');
                        navigate('/auth');
                    }}>Logoff</button>}
            </header>
            <Outlet />
        </>
    )
}

export default Header;