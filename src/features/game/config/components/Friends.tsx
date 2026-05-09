import useUser from "@/features/auth/hooks/useUser";
import { useFriendsAlbums } from "@/features/friends/hooks/useFriends";
import { Star } from "lucide-react";
import { Link } from "react-router";
import useGuessStore from "../../guess/stores/useGuessStore";
import useCompare from "../../guess/hooks/useCompare";

const Friends = () => {
    const { data: user } = useUser();
    const { currentAlbum } = useCompare();
    const { friendsGuessed } = useFriendsAlbums(currentAlbum.albumId)
    const { isGuessed } = useGuessStore();

    return (
        <article className="h-full max-h-99 text-center border-2 border-border overflow-scroll rounded-lg bg-(--card-light)">
            <h2 className="text-2xl font-bold py-2">Also guessed the album</h2>
            <ul className="flex flex-col w-79">
                {friendsGuessed?.length === 0 && <p className="pb-3 max-w-60 mx-auto text-wrap ">None of your friends guessed the album</p>}
                {friendsGuessed?.map((friend, i) => {
                    return (
                        isGuessed ? <Link
                            key={i}
                            to={`/profile/${friend.profile.username}`}
                            className="last-of-type:border-b-2"
                        >
                            <li
                                className={`flex items-center justify-between p-2 border-b-0 gap-5 border-x-0 border-2 ${friend.id === user?.id && 'bg-(--amber-50)'}`}
                            >
                                <div className="flex items-center w-full">
                                    <span className="pl-2 text-3xl mr-3 text-left number">
                                        {i + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={friend.profile.avatar_url}
                                            className="text-3xl size-14 rounded-full"
                                        />
                                        <h3 className="text-xl pr-4">
                                            {friend.profile.username}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xl">
                                    <Star /> <span>400</span>
                                </div>
                            </li>
                        </Link> :
                        <article
                        key={i}
                        className="last-of-type:border-b-2"
                    >
                        <li
                            className={`flex items-center justify-between p-2 border-b-0 gap-5 border-x-0 border-2 ${friend.id === user?.id && 'bg-(--amber-50)'}`}
                        >
                            <div className="flex items-center w-full">
                                <span className="pl-2 text-3xl mr-3 text-left number">
                                    {i + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={friend.profile.avatar_url}
                                        className="text-3xl size-14 rounded-full"
                                    />
                                    <h3 className="text-xl pr-4">
                                        {friend.profile.username}
                                    </h3>
                                </div>
                            </div>
                        </li>
                    </article>
                    );
                })}
            </ul>
        </article>
    );
}

export default Friends