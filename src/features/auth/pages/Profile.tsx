import { useState } from 'react';
import { StarIcon, CalendarDays, Music2, Disc3, ChartNoAxesColumn, Target } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import ProfileSkeleton from '../components/ProfileSkeleton';
import RequestButton from '@/features/friends/components/RequestButton';
import FriendsLeaderboard from '../components/FriendsLeaderboard';
import Stats from '@/features/stats/components/Stats';

type CenterTab = 'achievements' | 'stats';

const Profile = () => {
    const [centerTab, setCenterTab] = useState<CenterTab>('stats');
    const { data: profile, isPending: isUserPending, error: userError } = useProfile();

    if (userError)
        return (
            <div className="text-3xl flex justify-center items-center h-dvh text-(--error-text)">
                {userError.message}
            </div>
        );

    if (isUserPending) return <ProfileSkeleton activeTab={centerTab} />;

    if (!profile) return null;

    const date = new Date(profile.user.createdAt);
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const creationDate = `${date.getDate()}/${month}/${date.getFullYear()}`;

    return (
        <main
            className="px-4 pt-4 grow flex-1"
        >
            <div className="max-w-5xl mx-auto flex flex-col profile-grid gap-4">
                <section className="order-1 lg:order-2 min-w-0 w-full h-full">
                    <article className="w-full min-w-82 max-w-82 h-full mx-auto flex flex-col gap-4 p-5 text-center bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)]">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className="rounded-full size-24 object-cover object-center border-2 border-border"
                            />
                            <div className="min-w-0 w-full">
                                <h1 className="text-2xl font-black font-heading tracking-tight text-navy leading-tight truncate">
                                    {profile.username}
                                </h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    <span className="font-bold text-terra-dark">
                                        {profile.user.lastfmIntegration.lastfmUsername}
                                    </span>{' '}
                                    on Last.fm
                                </p>
                            </div>
                        </div>

                        <div className="relative bg-sidebar-border border-2 border-border rounded-lg px-3 pt-5 pb-2 text-sm text-left min-w-0">
                            <span className="absolute text-xs font-bold text-muted-foreground left-2 top-1">
                                Bio
                            </span>
                            <p className="multi-line-ellipsis leading-snug text-navy opacity-80 wrap-break-word">
                                {profile.bio || <span className="italic opacity-50">No bio.</span>}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="flex flex-col items-center gap-0.5 bg-secondary/40 border border-border rounded-lg py-2 px-1 min-w-0">
                                <StarIcon
                                    size={14}
                                    fill="var(--terra)"
                                    stroke="var(--terra)"
                                    className="drop-terra-ambar shrink-0"
                                />
                                <span className="text-sm font-black number text-navy">
                                    {profile.user.userStats.totalScore}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                    total points
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 bg-secondary/40 border border-border rounded-lg py-2 px-1 min-w-0">
                                <Music2 size={14} className="text-terra shrink-0" />
                                <span className="text-sm font-black number text-navy">
                                    {profile.user.userStats.guessedAlbums}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                    guesses
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 bg-secondary/40 border border-border rounded-lg py-2 px-1 min-w-0">
                                <Disc3 size={14} className="text-terra shrink-0" />
                                <span className="text-sm font-black number text-navy">
                                    {profile.user.userStats.guessedDistinctAlbums}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                    distinct albums
                                </span>
                            </div>
                        </div>

                        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays size={12} className="shrink-0" />
                            Member since {creationDate}
                        </p>

                        <RequestButton />
                    </article>
                </section>

                <section className="w-full max-w-82 mx-auto order-2 lg:order-1 min-w-0 h-full min-h-103">
                    <article className="max-h-103 flex flex-col bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)] overflow-hidden h-full min-h-full">
                        <div className="shrink-0 flex border-b-2 border-border">
                            <button
                                disabled={true}
                                title="Available soon"
                                onClick={() => setCenterTab('achievements')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 text-sm font-black font-heading tracking-tight transition-colors disabled:opacity-70 disabled:bg-white disabled:cursor-not-allowed ${
                                    centerTab === 'achievements'
                                        ? 'text-navy border-b-2 border-terra -mb-[2px] bg-(--card-light)'
                                        : 'text-muted-foreground hover:text-navy'
                                }`}
                            >
                                <Target size={14} />
                                Achievements
                            </button>
                            <button
                                onClick={() => setCenterTab('stats')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 text-sm font-black font-heading tracking-tight transition-colors ${
                                    centerTab === 'stats'
                                        ? 'text-navy border-b-2 border-terra -mb-[2px] bg-(--card-light)'
                                        : 'text-muted-foreground hover:text-navy'
                                }`}
                            >
                                <ChartNoAxesColumn size={14} />
                                Stats
                            </button>
                        </div>

                        {centerTab === 'achievements' && (
                            <div className="overflow-y-auto">
                                <ul className="grid grid-cols-6 p-3 gap-1">
                                    {Array.from({ length: 100 }).map((_, i) => (
                                        <li key={i} className="text-2xl py-1.5 text-center">
                                            😭
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {centerTab === 'stats' && <Stats stats={profile.user.userStats} />}
                    </article>
                </section>

                <section className={`w-full max-w-82 mx-auto order-3 min-w-0 min-h-100 max-h-117 h-full`}>
                    <FriendsLeaderboard />
                </section>
            </div>
        </main>
    );
};

export default Profile;
