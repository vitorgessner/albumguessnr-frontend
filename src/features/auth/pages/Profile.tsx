import { useEffect, useState } from "react";
import useMe from "../hooks/useMe";
import useAuthStore from "../stores/useAuthStore"
import { Star } from "lucide-react";

const Profile = () => {
    const { user } = useAuthStore();
    const fetchUser = useMe();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUser()
            .then(() => {
                setIsLoading(false);
            })
    }, [fetchUser, setIsLoading, user]);

    if (isLoading) return <div className="text-3xl flex justify-center items-center h-dvh">Loading...</div>

    if (!user) return null;

    const date = new Date(user.createdAt);
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const creationDate = `${date.getDate()}/${month}/${date.getFullYear()}`

    return (
        <main className="flex flex-col lg:flex-row justify-center gap-8 h-full lg:h-dvh pt-16 text-center">
            <section className="text-center order-1 lg:order-2">
                <img src={user.profile.avatar_url} alt={user.profile.username} className="mx-auto rounded-full w-37.5 h-37.5 object-cover object-center" />
                <h1 className="text-3xl font-bold">{user.profile.username}</h1>
                <p className="flex justify-center items-center opacity-80 text-xl"><Star className="opacity-80" fill="text-(--primary-color)" stroke="text-(--primary-color)" /> 478 pontos</p>
                <p className="opacity-80">Entrou em {creationDate}</p>
                <p className="opacity-80">
                    Adivinhou 400 álbuns
                </p>
                <p className="mx-auto opacity-80 text-left p-2 bg-(--primary-color) border-2 border-(--text) w-67.5 h-30 mt-2">{user.profile.bio}</p>
            </section>
            <section className="order-2 lg:order-1 max-w-76 mx-auto lg:mx-0">
                <article className="bg-(--primary-color) border-2 border-(--text) text-center max-h-96.75 overflow-scroll px-2 py-1">
                    <h2 className="text-2xl font-bold">Achievenments</h2>
                    <ul className="flex flex-wrap w-62.5">
                        {Array.from({ length: 100 }).map(() => {
                            return <li className="text-3xl achievements py-1">😭</li>
                        })}
                    </ul>
                </article>
            </section>
            <section className="mx-auto order-3 max-w-76 lg:mx-0">
                <article className="text-center bg-(--primary-color) border-2 border-(--text) max-h-96.75 overflow-scroll px-2 py-1">
                    <h2 className="text-2xl font-bold">Friends' Ranking</h2>
                    <ul className="flex flex-col w-62.5 gap-2">
                        {Array.from({ length: 16 }).map(() => {
                            return <li className="p-1 flex items-center justify-between border-2"><div className="flex items-center gap-2"><span className="text-3xl">😎</span> <h3>FriendName</h3></div><div className="flex items-center gap-1"><Star /> <span>400</span></div></li>
                        })}
                    </ul>
                </article>
            </section>
        </main>
    )
}

export default Profile;