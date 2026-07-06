export const LoginSpotify = () => {
    const loginSpotify = async () => {
        window.location.href = import.meta.env.VITE_API_URL + '/login'
    }
    return (
        <button onClick={loginSpotify} className="testes flex justify-center gap-2 font-heading tracking-tight w-full bg-[#1FB855] rounded-2xl p-3 px-5 text-black font-bold border-2 border-black"><img src="../src/assets/spotify-logo.png" className="w-6 h-6" />Spotify</button>
    )
}