import { StarIcon } from 'lucide-react';
import useUser from '../hooks/useUser';
import useProfile from '../hooks/useProfile';
import ProfileSkeleton from '../components/ProfileSkeleton';
import RequestButton from '@/features/friends/components/RequestButton';
import FriendsLeaderboard from '../components/FriendsLeaderboard';

const Profile = () => {
    const { data: authenticatedUser } = useUser();
    const { data: user, isPending: isUserPending, error: userError } = useProfile();

    if (userError)
        return (
            <div className="text-3xl flex justify-center items-center h-dvh text-(--error-text)">
                {userError.message}
            </div>
        );

    if (isUserPending) return <ProfileSkeleton />;

    const userProfile =
        user?.username === authenticatedUser?.profile.username ? authenticatedUser : user?.user;
    const profile =
        user?.username === authenticatedUser?.profile.username ? authenticatedUser?.profile : user;
    if (!profile || !userProfile) return null;

    const date = new Date(userProfile.createdAt);
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const creationDate = `${date.getDate()}/${month}/${date.getFullYear()}`;

    return (
        <main className="min-h-dvh h-full py-4 pb-16 lg:w-fit lg:mx-auto lg:h-full lg:min-h-dvh">
            <div className="flex flex-col lg:flex-row justify-center gap-8">
                <section className="grow h-full z-1 order-1 lg:order-2 text-center">
                    <article className="w-fit mx-auto p-3 px-7 bg-(--card-light) border-2 border-border rounded-lg">
                        <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="mx-auto rounded-full size-37.5 object-cover object-center"
                        />
                        <h1 className="text-3xl font-bold">{profile.username}</h1>
                        <h2 className="text-xs mb-2 opacity-70">
                            {userProfile.lastfmIntegration.lastfmUsername}
                            <span className="text-xs"> on lastfm</span>
                        </h2>
                        <p className="relative w-65 h-21 pt-5 px-3 pb-1 text-left bg-sidebar-border border-2 border-border rounded-lg opacity-80 hover:max-h-none multi-line-ellipsis">
                            <span className="absolute text-sm left-1 top-0">Bio:</span>{' '}
                            {profile.bio.length > 71 && (
                                <span className="absolute right-1 top-0 text-xs">
                                    Hover to read more
                                </span>
                            )}
                            <span>{profile.bio}</span>
                        </p>
                        <RequestButton />
                        <p className="flex justify-center items-center mt-2 text-xl opacity-80">
                            <StarIcon
                                fill="#d47358"
                                stroke="#d47358"
                                className="drop-terra-ambar"
                            />{' '}
                            478 pontos
                        </p>
                        <p className="opacity-80">Guessed 400 albums</p>
                        <p className="opacity-80">Joined {creationDate}</p>
                    </article>
                </section>
                <section className="order-2 lg:order-1 mx-auto lg:mx-0">
                    <article className="max-h-99 px-2 pb-1 text-center bg-(--card-light) border-2 border-border overflow-scroll rounded-lg">
                        <h2 className="sticky top-0 py-2 text-2xl font-bold bg-(--card-light)">
                            Achievements
                        </h2>
                        <ul className="flex flex-wrap w-75">
                            {Array.from({ length: 100 }).map((_, i) => {
                                return (
                                    <li key={i} className="text-3xl py-1 achievements">
                                        😭
                                    </li>
                                );
                            })}
                        </ul>
                    </article>
                </section>
                <section className="order-3 mx-auto lg:mx-0">
                    <FriendsLeaderboard />
                </section>
            </div>
            {/* <h2 className="m-4 text-2xl text-center font-bold">Favorite albums</h2>
            <article className="order-4 flex flex-row flex-wrap mx-8 justify-center items-center gap-3 h-fit">
                {Array.from({ length: 4 }).map(() => {
                    return (
                        <div
                            className={`flex size-39 lg:size-55 overflow-hidden rounded-sm border-2 border-border`}
                        >
                            <img
                                src="../../src/assets/the now now and never.jpg"
                                className=""
                                alt=""
                            />
                        </div>
                    );
                })}
            </article> */}
        </main>
    );
};

export default Profile;
