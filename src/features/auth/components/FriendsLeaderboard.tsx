import useFriends from '@/features/friends/hooks/useFriends';
import { Link } from 'react-router';
import useProfile from '../hooks/useProfile';
import useUser from '../hooks/useUser';
import { Star } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

const FriendsLeaderboard = () => {
    const { data: user } = useUser();
    const { data: profile } = useProfile();
    const { friends, isPending } = useFriends(profile?.username);

    friends?.sort((a,b) => b.receivedRequests.totalScore - a.receivedRequests.totalScore)

    const MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

    return (
        <article className="h-full flex flex-col bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)] overflow-hidden">
            <h2 className="shrink-0 py-3 px-5 text-xl font-black font-heading tracking-tight text-navy bg-(--card-light) border-b-2 border-border">
                Friends
            </h2>

            <ul className="flex flex-col overflow-y-auto flex-1 h-full overflow-hidden">
                {isPending ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 pl-5 px-4 py-3 border-b border-border last:border-0"
                        >
                            <Skeleton width={20} height={16} />
                            <Skeleton circle width={44} height={44} />
                            <div className="flex-1">
                                <Skeleton width={110} height={14} />
                            </div>
                            <Skeleton width={44} height={14} />
                        </li>
                    ))
                ) : !friends || friends.length < 1 ? (
                    <li className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4 h-full">
                        <span className="text-4xl">👥</span>
                        <p className="text-sm font-bold text-navy">No friends yet</p>
                        <p className="text-xs text-muted-foreground">
                            Add friends to see the leaderboards
                        </p>
                    </li>
                ) : (
                    friends.map((friend, i) => {
                        const isMe = friend.receivedRequestsId === user?.id;
                        const friendProfile = friend.receivedRequests.profile;
                        return (
                            <Link
                                key={i}
                                to={`/profile/${friendProfile.username}`}
                                className="last-of-type:border-b-0"
                            >
                                <li
                                    className={`flex items-center gap-3 px-4 py-3 border-b border-border transition-colors hover:bg-muted/40 ${
                                        isMe ? 'bg-secondary/40' : ''
                                    }`}
                                >
                                    <span className="w-5 text-center shrink-0">
                                        {MEDAL[i] ?? (
                                            <span className="text-xs font-black text-muted-foreground number">
                                                {i + 1}
                                            </span>
                                        )}
                                    </span>

                                    <img
                                        src={friendProfile.avatar_url}
                                        alt={friendProfile.username}
                                        className="size-11 rounded-full object-cover border-2 border-border shrink-0"
                                    />

                                    <span className="flex-1 text-sm font-bold text-navy truncate">
                                        {friendProfile.username}
                                        {isMe && (
                                            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-terra bg-terra/10 px-1.5 py-0.5 rounded-sm">
                                                you
                                            </span>
                                        )}
                                    </span>

                                    <span className="flex items-center gap-1 text-sm font-black text-terra-dark number shrink-0">
                                        <Star size={12} fill="var(--terra)" stroke="var(--terra)" />
                                        {friend.receivedRequests.totalScore}
                                    </span>
                                </li>
                            </Link>
                        );
                    })
                )}
            </ul>
        </article>
    );
};

export default FriendsLeaderboard;
