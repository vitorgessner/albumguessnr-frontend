import useFriends from "@/features/friends/hooks/useFriends";
import { Link } from "react-router";
import useProfile from "../hooks/useProfile";
import useUser from "../hooks/useUser";
import { Star } from "lucide-react";

const FriendsLeaderboard = () => {
    const { data: user } = useUser();
    const { data: profile } = useProfile();
    const { friends } = useFriends(profile?.username)

    return (
        <article className="h-full max-h-99 text-center border-2 border-border overflow-scroll rounded-lg bg-(--card-light)">
            <h2 className="text-2xl font-bold py-2">Friends' Leaderboard</h2>
            <ul className="flex flex-col w-79">
                {friends?.map((friend, i) => {
                    return (
                        <Link
                            key={i}
                            to={`/profile/${friend.receivedRequests.profile.username}`}
                            className="last-of-type:border-b-2"
                        >
                            <li
                                className={`flex items-center justify-between p-2 border-b-0 gap-5 border-x-0 border-2 ${friend.receivedRequestsId === user?.id && 'bg-(--amber-50)'}`}
                            >
                                <div className="flex items-center w-full">
                                    <span className="pl-2 text-3xl mr-3 text-left number">
                                        {i + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={friend.receivedRequests.profile.avatar_url}
                                            className="text-3xl size-14 rounded-full"
                                        />
                                        <h3 className="text-xl pr-4">
                                            {friend.receivedRequests.profile.username}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xl">
                                    <Star /> <span>400</span>
                                </div>
                            </li>
                        </Link>
                    );
                })}
            </ul>
        </article>
    );
};

export default FriendsLeaderboard;
