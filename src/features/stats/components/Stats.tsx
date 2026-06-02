import StatCard from './StatCard';
import StatBar from './StatBar';
import { BookA, CalendarDays, Disc3, Music, User } from 'lucide-react';
import type { IStats } from '../types/IStats';

const Stats = ({stats}: {stats: IStats}) => {
    return (
        <div className="overflow-y-auto flex-1">
            {!stats ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                    No stats available.
                </div>
            ) : (
                <div className="p-4 flex flex-col gap-5">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                            Guesses
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <StatCard
                                label="Albums"
                                value={stats.guessedAlbums}
                                icon={<Disc3 size={14} />}
                            />
                            <StatCard
                                label="Artists"
                                value={stats.guessedArtists}
                                icon={<User size={14} />}
                            />
                            <StatCard
                                label="Genres"
                                value={stats.guessedGenres}
                                icon={<BookA size={14} />}
                            />
                            <StatCard
                                label="Tracks"
                                value={stats.guessedTracks}
                                icon={<Music size={14} />}
                            />
                            <StatCard
                                label="Years"
                                value={stats.guessedYears}
                                icon={<CalendarDays size={14} />}
                            />
                            <StatCard
                                label="Distinct albums"
                                value={stats.guessedDistinctAlbums}
                                icon={<Disc3 size={14} />}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                            Correct guesses
                        </p>
                        <div className="flex flex-col gap-3">
                            <StatBar
                                label="Albums"
                                value={stats.rightGuessedAlbums}
                                max={stats.guessedAlbums}
                                color="bg-terra"
                            />
                            <StatBar
                                label="Artists"
                                value={stats.rightGuessedArtist}
                                max={stats.guessedArtists}
                                color="bg-sage"
                            />
                            <StatBar
                                label="Genres"
                                value={stats.rightGuessedGenres}
                                max={stats.guessedGenres}
                                color="bg-amber"
                            />
                            <StatBar
                                label="Tracks"
                                value={stats.rightGuessedTracks}
                                max={stats.guessedTracks}
                                color="bg-navy-light"
                            />
                            <StatBar
                                label="Years"
                                value={stats.rightGuessedYears}
                                max={stats.guessedYears}
                                color="bg-terra-light"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stats;
