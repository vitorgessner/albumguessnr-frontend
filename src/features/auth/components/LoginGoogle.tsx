export const LoginGoogle = () => {
    const loginGoogle = async () => {
        window.location.href = import.meta.env.VITE_API_URL + '/login/google'
    }
    return (
        <button onClick={loginGoogle} className="flex gap-2 font-heading tracking-tight font-bold w-full justify-center text-navy bg-sidebar-border rounded-md p-2 px-3 border-2 white-component"><img src="../src/assets/google.png" className="w-6 h-6" />Continue with Google</button>
    )
}