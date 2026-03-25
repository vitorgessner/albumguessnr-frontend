import { Outlet } from "react-router";

const Header = () => {
    return (
        <>
            <header className="bg-(--primary-color) p-3 fixed w-full">
                <h1 className="uppercase text-(--text) text-xl text-center font-semibold">AlbumGuessnr</h1>
            </header>
            <Outlet />
        </>
    )
}

export default Header;