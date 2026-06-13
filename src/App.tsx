import { Link } from 'react-router';
import { ToggleLeft, Gamepad2, Trophy, Users, Radio, ArrowRight } from 'lucide-react';
import useUser from './features/auth/hooks/useUser';
import LeaderboardContent from './features/leaderboards/components/LeaderboardContent';
import { useRecentPlayers } from './features/game/guess/hooks/useRecentPlayers';
import { GuessRow } from './features/game/guess/components/GuessRow';
import SkeletonRow from './features/leaderboards/components/SkeletonRow';

const App = () => {
    const { data: user } = useUser();
    const { data: recentPlayers, isPending } = useRecentPlayers();

    return !user ? (
        <div className="min-h-dvh bg-background text-navy font-sans selection:bg-amber/30 selection:text-navy">
            <header className="max-w-5xl mx-auto px-6 pt-12 pb-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="font-heading font-black text-5xl md:text-7xl tracking-tight leading-none text-navy">
                        Album
                        <span className="font-heading tracking-tighter text-primary">Guessnr</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                        Do you really know your most-played albums? Test your musical memory
                        guessing titles, artists, tracks and more in record time
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-4 font-heading font-black text-lg text-white bg-primary border-3 border-terra-dark rounded-xl shadow-[4px_4px_0_var(--terra-dark)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--terra-dark)] transition-all opacity-50 text-nowrap">
                            Play Daily Album (soon) <Gamepad2 className="w-5 h-5" />
                        </button>
                        <Link
                            to="/leaderboards"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-heading font-black text-lg text-navy bg-card border-3 border-border rounded-xl shadow-[4px_4px_0_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--border)] transition-all text-nowrap"
                        >
                            See Leaderboards <Trophy className="w-5 h-5 text-amber-dark" />
                        </Link>
                    </div>
                </div>

                <div className="relative w-full max-w-sm aspect-square md:w-96 shrink-0 order-first md:order-last">
                    <div className="absolute inset-0 bg-secondary border-3 border-amber-dark rounded-2xl rotate-3 shadow-[6px_6px_0_var(--amber-dark)]" />

                    <div className="absolute inset-0 bg-card border-3 border-border rounded-2xl -rotate-2 p-4 flex flex-col justify-between shadow-[6px_6px_0_var(--border)] group hover:rotate-0 transition-transform duration-300">
                        <div className="w-full aspect-square bg-sidebar-border rounded-xl border-2 border-border overflow-hidden relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-terra/40 to-amber/30 backdrop-blur-md" />
                            <span className="text-6xl z-10 filter drop-shadow-[3px_3px_0_var(--border)]">
                                ❓
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-1">
                            <div className="text-left">
                                <div className="h-4 w-32 bg-navy/20 rounded mb-1.5" />
                                <div className="h-3 w-20 bg-navy/10 rounded" />
                            </div>
                            <span className="font-black text-sm border-2 border-border bg-(--card-light) px-2.5 py-0.5 rounded-full text-navy shadow-[2px_2px_0_var(--border)]">
                                00:15
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="border-t-3 border-border bg-sidebar-border/30 py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
                        <h2 className="font-heading font-black text-3xl md:text-4xl text-navy tracking-tight">
                            How the game works?
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium">
                            Sync your Last.fm account and dispute with your friends using your real
                            listening data.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-card border-2 border-border p-5 rounded-xl shadow-[4px_4px_0_var(--border)] space-y-3 text-left">
                            <div className="w-10 h-10 bg-primary/10 border-2 border-terra-dark text-terra-dark rounded-lg flex items-center justify-center font-black">
                                <Radio className="w-5 h-5" />
                            </div>
                            <h3 className="font-heading font-black text-lg text-navy">
                                Last.fm Integration
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We get albums from your library to make a fun and personalized
                                experience with your musical taste.
                            </p>
                        </div>

                        <div className="bg-card border-2 border-border p-5 rounded-xl shadow-[4px_4px_0_var(--border)] space-y-3 text-left">
                            <div className="w-10 h-10 bg-secondary/10 border-2 border-amber-dark text-amber-dark rounded-lg flex items-center justify-center font-black">
                                <ToggleLeft className="w-5 h-5" />
                            </div>
                            <h3 className="font-heading font-black text-lg text-navy">
                                Custom Modes
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Switch between response fields. Try to guess beyond the album title:
                                artist, year of release, genres/tags and even tracks.
                            </p>
                        </div>

                        <div className="bg-card border-2 border-border p-5 rounded-xl shadow-[4px_4px_0_var(--border)] space-y-3 text-left sm:col-span-2 lg:col-span-1">
                            <div className="w-10 h-10 bg-sage/20 border-2 border-sage-dark text-sage-dark rounded-lg flex items-center justify-center font-black">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-heading font-black text-lg text-navy">
                                Dispute with Friends
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Find out friends that guessed the same albums and fight for the top
                                of the leaderboards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t-3 border-border bg-card py-12 px-6 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <p className="font-heading font-black text-xl text-navy">
                        Ready to test your musical knowledge?
                    </p>
                    <Link
                        to="/auth/register"
                        className="inline-flex items-center gap-2 px-6 py-3 font-heading font-black text-sm text-white bg-sage-dark border-2 border-navy rounded-lg shadow-[3px_3px_0_var(--navy)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--navy)] transition-all"
                    >
                        Sign up and Play <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-xs text-muted-foreground pt-4">
                        &copy; {new Date().getFullYear()} AlbumGuessnr. Made with love for music
                        lovers.
                    </p>
                </div>
            </footer>
        </div>
    ) : (
        <div className="flex flex-col lg:flex-row md:gap-6 xl:gap-12 2xl:gap-18 justify-center items-center lg:items-start">
            <div className="grow flex-1 w-full max-w-md sm:max-w-lg">
                <div className="pt-6 pb-2">
                    <h1 className="font-heading font-black text-2xl text-center text-navy tracking-tight">
                        Daily top ten
                    </h1>
                </div>
                <div className="text-base">
                    <LeaderboardContent
                        friends={false}
                        period={'daily'}
                        category={undefined}
                        accuracy={false}
                        limit={true}
                    />
                </div>
            </div>
            <div className="pt-6 pb-4 flex-1 grow w-full max-w-md sm:max-w-lg">
                <h1 className="font-heading font-black text-2xl text-center text-navy tracking-tight">
                    Recent played
                </h1>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div
                        className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-border text-sm last:border-0 transition-colors`}
                    >
                        <div className="flex items-center gap-3">
                            <p>Avatar</p>
                            <p>Username</p>
                        </div>
                        <div className="flex items-center gap-5">
                            <p>Score</p>
                            <p>Date</p>
                        </div>
                    </div>
                    {
                        isPending && <div className="bg-card border border-border rounded-xl overflow-hidden">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </div>
                    }
                    {recentPlayers?.map((rp, i) => (
                        <GuessRow player={rp} isMe={user.id === rp.userId} idx={i} key={rp.id} />
                    ))}
                </div>
            </div>
            <Trophy
                size={180}
                color="#f2cc8f"
                className="hidden 2xl:block absolute left-15 top-90 opacity-40"
            />
            <Gamepad2
                size={180}
                color="#81b29a"
                className="hidden 2xl:block absolute right-15 top-90 opacity-25"
            />
        </div>
    );
};

export default App;
