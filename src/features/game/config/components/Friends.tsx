import useUser from '@/features/auth/hooks/useUser';
import { useFriendsAlbums } from '@/features/friends/hooks/useFriends';
import { Star } from 'lucide-react';
import { Link } from 'react-router';
import useGuessStore from '../../guess/stores/useGuessStore';
import useCompare from '../../guess/hooks/useCompare';
import useScoringStore from '../../scoring/stores/useScoringStore';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

const MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

const Friends = ({ isPending }: { isPending: boolean }) => {
    const { data: user } = useUser();
    const { currentAlbum } = useCompare();
    const { friendsGuessed: friends, isPending: isFriendsPending } = useFriendsAlbums(
        currentAlbum.albumId
    );
    const { isGuessed } = useGuessStore();
    const { isNewBestScore, setIsNewBestScore } = useScoringStore();

    useEffect(() => {
        setIsNewBestScore(false);
    }, [setIsNewBestScore, currentAlbum]);

    const friendsGuessed = friends
        ?.filter((f) => f.bestScore >= 0)
        .sort((a, b) => b.bestScore - a.bestScore);

    const isEmpty =
        friendsGuessed?.length === 0 ||
        friendsGuessed?.every((f) => f.bestScore === undefined || f.bestScore === null);

    return (
        <article className="flex flex-col h-full max-h-99 bg-(--card-light) lg:border-2 lg:border-border rounded-xl lg:shadow-[3px_3px_0_var(--border)] overflow-hidden">
            <h2 className="shrink-0 py-3 px-5 text-xl font-black font-heading tracking-tight text-navy bg-(--card-light) border-b-2 border-border">
                Also guessed
            </h2>

            <ul className="flex flex-col overflow-y-auto flex-1">
                {isEmpty ? (
                    <li className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
                        <span className="text-4xl">🎵</span>
                        <p className="text-sm font-bold text-navy">
                            No friends guessed this album yet
                        </p>
                    </li>
                ) : (
                    friendsGuessed?.map((friend, i) => {
                        if (friend.bestScore === undefined || friend.bestScore === null)
                            return null;
                        const isMe = friend.id === user?.id;
                        return (
                            <Link
                                key={i}
                                to={`/profile/${friend.profile.username}`}
                                className="last-of-type:border-b-0"
                            >
                                <li
                                    className={`relative flex items-center gap-3 px-4 py-3 border-b border-border transition-colors hover:bg-muted/40 ${
                                        isMe ? 'bg-secondary/40' : ''
                                    }`}
                                >
                                    <span className="w-5 text-center shrink-0 text-base">
                                        {MEDAL[i] ?? (
                                            <span className="text-xs font-black text-muted-foreground number">
                                                {i + 1}
                                            </span>
                                        )}
                                    </span>

                                    <img
                                        src={friend.profile.avatar_url}
                                        alt={friend.profile.username}
                                        className="size-11 rounded-full object-cover border-2 border-border shrink-0"
                                    />

                                    <span className="flex-1 text-sm font-bold text-navy truncate">
                                        {friend.profile.displayUsername}
                                        {isMe && (
                                            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-terra bg-terra/10 px-1.5 py-0.5 rounded-sm">
                                                you
                                            </span>
                                        )}
                                    </span>

                                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                                        <span
                                            className={`flex items-center gap-1 text-sm font-black text-terra-dark number ${!isGuessed || isPending ? 'blur-sm' : 'blur-none'} transition-all`}
                                        >
                                            <Star
                                                size={12}
                                                fill="var(--terra)"
                                                stroke="var(--terra)"
                                            />
                                            {!isPending && !isFriendsPending ? (
                                                friend.bestScore
                                            ) : (
                                                <Skeleton width={25} height={14} />
                                            )}
                                        </span>
                                        {!isFriendsPending &&
                                            !isPending &&
                                            isMe &&
                                            isNewBestScore && (
                                                <span className="text-[10px] font-bold text-sage-dark">
                                                    New best!
                                                </span>
                                            )}
                                    </div>
                                </li>
                            </Link>
                        );
                    })
                )}
            </ul>
        </article>
    );
};

export default Friends;
