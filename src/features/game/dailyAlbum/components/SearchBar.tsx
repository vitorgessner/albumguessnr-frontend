import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { AlbumCandidate } from '../types/AlbumCandidate';
import axios from '@/shared/utils/axios';
import { buildGuessRow } from '../utils/buildGuessRow';
import type { DailyAlbum } from '../types/DailyAlbum';
import type { GuessRow } from '../types/GuessRow';
import { useQueryClient } from '@tanstack/react-query';
import useUser from '@/features/auth/hooks/useUser';

type SearchBarProps = {
    guessRows: GuessRow[];
    setGuessRows: React.Dispatch<React.SetStateAction<GuessRow[]>>;
    isFinished: boolean;
    setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
    dailyAlbum: DailyAlbum;
};

export const SearchBar = ({
    guessRows,
    setGuessRows,
    isFinished,
    setIsFinished,
    dailyAlbum,
}: SearchBarProps) => {
    const { data: user } = useUser();
    const [query, setQuery] = useState('');
    const [candidates, setCandidates] = useState<AlbumCandidate[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const queryClient = useQueryClient();

    const handleSearch = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) {
            setCandidates([]);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await axios.post('/daily/find', { title: value });
                setCandidates(res.data.possibleAlbums ?? []);
            } catch {
                setCandidates([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
    };

    const handleSelect = async (candidate: AlbumCandidate) => {
        setQuery('');
        setCandidates([]);

        const alreadyGuessed = guessRows.some((row) => row.album.id === candidate.id);
        if (alreadyGuessed || isFinished) return;

        const row = buildGuessRow(candidate, dailyAlbum);
        const newRows = [row, ...guessRows];
        setGuessRows(newRows);

        try {
            await axios.post(`/daily/album/try`, { guessedAlbumId: candidate.id });
        } catch {
            /* silencioso */
        }

        const correct = candidate.id === dailyAlbum.albumId;
        if (correct) {
            setIsFinished(true);

            const data = {
                tries: newRows.length,
                isFinished: true,
            };
            await axios.put(`/daily/album/overall/statistics`, data);

            queryClient.invalidateQueries({ queryKey: ['daily', user?.profile.username]})
            queryClient.invalidateQueries({ queryKey: ['overall', user?.profile.username]})
            queryClient.invalidateQueries({ queryKey: ['daily']})
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 bg-(--card-light) border-2 border-border rounded-xl px-3 py-2 shadow-[3px_3px_0_var(--border)] focus-within:border-terra transition-colors">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSelect(candidates[0])
                        }
                    }}
                    placeholder="Search album..."
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-navy placeholder:text-muted-foreground placeholder:font-normal border-none"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setCandidates([]);
                        }}
                    >
                        <X size={14} className="text-muted-foreground hover:text-navy" />
                    </button>
                )}
            </div>

            {(candidates.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)] overflow-hidden max-h-64 overflow-y-auto hover:border-sage active:border-sage selection:border-sage focus:border-sage focus-within:border-sage">
                    {isSearching ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                            Searching...
                        </div>
                    ) : (
                        candidates.map((c) => {
                            const alreadyGuessed = guessRows.some((row) => row.album.id === c.id);
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => !alreadyGuessed && handleSelect(c)}
                                    disabled={alreadyGuessed}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 text-left transition-colors ${
                                        alreadyGuessed
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'hover:bg-muted/40'
                                    }`}
                                >
                                    <img
                                        src={c.cover_url}
                                        alt={c.normalizedName}
                                        className="size-10 rounded-lg border border-border object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-navy truncate">
                                            {c.normalizedName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {c.normalizedArtist}
                                        </p>
                                    </div>
                                    {alreadyGuessed && (
                                        <span className="ml-auto text-[10px] font-bold text-muted-foreground shrink-0">
                                            Tried
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
