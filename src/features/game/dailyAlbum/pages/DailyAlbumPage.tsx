import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStatistics } from '../hooks/useUserStatistics';
import useUser from '@/features/auth/hooks/useUser';
import axios from '@/shared/utils/axios';
import { OverallStatistics } from '../components/OverallStatistics';
import type { GuessRow } from '../types/GuessRow';
import type { DailyAlbum } from '../types/DailyAlbum';
import { ResultBanner } from '../components/ResultBanner';
import { LastfmHints } from '../components/LastfmHints';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { Legend } from '../components/Legend';
import { GuessRows } from '../components/GuessRows';
import { buildGuessRow } from '../utils/buildGuessRow';
import type { AlbumCandidate } from '../types/AlbumCandidate';
import { GuessRowsSkeleton } from '../components/skeletons/GuessRowsSkeleton';
import { ShareCard } from '../components/ShareCard';

export const DailyAlbumPageContent = ({
    dailyAlbum,
    dailyAlbumNumber,
    totalGuessesCount,
}: {
    dailyAlbum: DailyAlbum;
    dailyAlbumNumber: number;
    totalGuessesCount: number;
}) => {
    const { data: user } = useUser();

    const { userDailyAlbumStatistics, isPending } = useUserStatistics(
        user?.id,
        dailyAlbum.albumId
    );

    const [guessRows, setGuessRows] = useState<GuessRow[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isRowsLoading, setIsRowsLoading] = useState(true);

    const isAlreadyFinished = userDailyAlbumStatistics?.status === 'FINISHED';

    useEffect(() => {
        const checkIfFinished = () => {
            if (isAlreadyFinished) {
                setIsFinished(true);
            }
        };

        checkIfFinished();
    }, [isAlreadyFinished]);

    useEffect(() => {
        const reconstructUserTries = async () => {
            const candidateAlbumsIds = userDailyAlbumStatistics?.userTries.map(
                (tryobj) => tryobj.albumGuessId
            );

            if (candidateAlbumsIds) {
                const candidateAlbums = await Promise.all(
                    candidateAlbumsIds.map((candidate) =>
                        axios.get<{ album: AlbumCandidate }>(`/album/${candidate}`)
                    )
                );

                const rows = await Promise.all(
                    candidateAlbums.map((album) => {
                        return buildGuessRow(album.data.album, dailyAlbum);
                    })
                );

                setGuessRows(rows);
            }
            setIsRowsLoading(false);
        };
        reconstructUserTries();
    }, [isAlreadyFinished, userDailyAlbumStatistics, dailyAlbum]);

    if (isPending) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    const tryCount = guessRows.length || userDailyAlbumStatistics?.userTries.length || 0;
    const nthPlayerToGuess = userDailyAlbumStatistics?.nthPlayerToGuess;

    return (
        <main className="min-h-dvh pb-20 px-4 py-6 selection:bg-amber/80">
            <div className="max-w-4xl mx-auto flex flex-col gap-5">
                <Header totalGuessesCount={totalGuessesCount} />
                <LastfmHints dailyAlbum={dailyAlbum} />

                {!isFinished && (
                    <SearchBar
                        dailyAlbum={dailyAlbum}
                        guessRows={guessRows}
                        isFinished={isFinished}
                        setGuessRows={setGuessRows}
                        setIsFinished={setIsFinished}
                    />
                )}

                {isRowsLoading && <GuessRowsSkeleton guessRows={3}/>}
                {!isRowsLoading && <GuessRows guessRows={guessRows}/>}
                <Legend />

                {guessRows.length === 0 && !isFinished && (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <span className="text-5xl">🎵</span>
                        <p className="font-heading font-bold text-navy">Guess the daily album</p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Guess an album and see the tips to find the secret daily album.
                        </p>
                    </div>
                )}

                {isFinished && !isPending && !isRowsLoading && (
                    <div className='flex flex-col lg:flex-row items-center justify-center gap-5'>
                        <ResultBanner
                            tries={tryCount}
                            album={dailyAlbum}
                            nthPlayer={nthPlayerToGuess ?? null}
                        />
                        <ShareCard dailyAlbumNumber={dailyAlbumNumber} guessRows={guessRows}/>
                    </div>
                )}
                <OverallStatistics />
            </div>
        </main>
    );
};

export const DailyAlbumPage = () => {
    const { data, isPending, error } = useQuery<{
        dailyAlbum: DailyAlbum;
        dailyAlbumNumber: number;
        dailyAlbumUrl: string;
        dailyAlbumTotalGuessesCount: number;
    }>({
        queryKey: ['daily'],
        queryFn: async () => {
            const response = await axios.get('/daily/album');
            return response.data;
        },
    });

    if (isPending) return <div className="loading">Loading daily album...</div>;
    if (error) return <div className="loading text-(--error-text)">{error.message}</div>;

    const { dailyAlbum, dailyAlbumNumber, dailyAlbumTotalGuessesCount } = data;
    return (
        <DailyAlbumPageContent
            dailyAlbum={dailyAlbum}
            dailyAlbumNumber={dailyAlbumNumber}
            totalGuessesCount={dailyAlbumTotalGuessesCount}
        />
    );
};
