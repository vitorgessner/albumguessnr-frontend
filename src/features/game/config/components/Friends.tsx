import useUser from '@/features/auth/hooks/useUser';
import { useFriendsAlbums } from '@/features/friends/hooks/useFriends';
import { Star } from 'lucide-react';
import { Link } from 'react-router';
import useGuessStore from '../../guess/stores/useGuessStore';
import useCompare from '../../guess/hooks/useCompare';
import useScoringStore from '../../scoring/stores/useScoringStore';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

const Friends = ({isPending}: {isPending: boolean}) => {
    const { data: user } = useUser();
    const { currentAlbum } = useCompare();
    const { friendsGuessed: friends, isPending: isFriendsPending } = useFriendsAlbums(currentAlbum.albumId);
    const { isGuessed } = useGuessStore();
    const { isNewBestScore, setIsNewBestScore } = useScoringStore();

    useEffect(() => {
        setIsNewBestScore(false);
    }, [setIsNewBestScore, currentAlbum])

    const friendsGuessed = friends?.filter((f) => f.bestScore >= 0).sort((a, b) => b.bestScore - a.bestScore);

    return (
        <article className="h-full max-h-99 text-center border-2 border-border overflow-scroll rounded-lg bg-(--card-light)">
            <h2 className="text-2xl font-bold py-2">Also guessed the album</h2>
            <ul className="flex flex-col w-79">
                {friendsGuessed?.length === 0 || friendsGuessed?.every(f => f.bestScore === undefined || f.bestScore === null) && (
                    <p className="pb-3 max-w-60 mx-auto text-wrap ">
                        None of your friends guessed the album
                    </p>
                )}
                {friendsGuessed?.map((friend, i) => {
                    if (friend.bestScore === undefined || friend.bestScore === null) return;
                    return (
                        <Link
                            key={i}
                            to={`/profile/${friend.profile.username}`}
                            className="last-of-type:border-b-2"
                        >
                            <li
                                className={`relative flex items-center justify-between p-2 border-b-0 gap-5 border-x-0 border-2 ${friend.id === user?.id && 'bg-(--amber-50)'}`}
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
                                        <h3 className="text-xl pr-4">{friend.profile.username}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xl">
                                    <Star />{' '}
                                    <span className={`${!isGuessed ? 'blur-xs' : 'blur-none'}`}>
                                        {!isPending && !isFriendsPending ? friend.bestScore : <Skeleton height={20} width={20}/>}
                                    </span>
                                </div>
                                {!isFriendsPending && friend.id === user?.id && isNewBestScore && <span className='absolute bottom-0 right-1 text-sm text-(--sage-dark)'>New Best Score!</span>}
                            </li>
                        </Link>
                    );
                })}
            </ul>
        </article>
    );
};

export default Friends;
