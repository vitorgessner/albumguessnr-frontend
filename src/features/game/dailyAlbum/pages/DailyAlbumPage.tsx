import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStatistics } from '../hooks/useUserStatistics';
import useUser from '@/features/auth/hooks/useUser';
import axios from '@/shared/utils/axios';
import { OverallStatistics } from '../components/OverallStatistics';
import type { GuessRow } from '../types/GuessRow';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { Legend } from '../components/Legend';
import { GuessRows } from '../components/GuessRows';
import { GuessRowsSkeleton } from '../components/skeletons/GuessRowsSkeleton';
import { ShareCard } from '../components/ShareCard';
import { ResultBanner } from '../components/ResultBanner';
import { AxiosError } from 'axios';
import { findCorrectDailyAlbum } from '../utils/findCorrectDailyAlbum';

export const DailyAlbumPageContent = ({
    dailyAlbumNumber,
    totalGuessesCount,
}: {
    dailyAlbumNumber: number;
    totalGuessesCount: number;
}) => {
    useEffect(() => {
        document.title = 'Daily Album';
    }, []);

    const { data: user } = useUser();

    const divRef = useRef<HTMLDivElement>(null);

    const { userDailyAlbumStatistics, isPending } = useUserStatistics(user?.id);

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
                const rows = await Promise.all(
                    candidateAlbumsIds.map(async (candidate) => {
                        const response = await axios.get(`/daily/row/${candidate}`)
                        return response.data.row
                    }
                    )
                );

                setGuessRows(rows);
            }
            setIsRowsLoading(false);
        };
        reconstructUserTries();
    }, [isAlreadyFinished, userDailyAlbumStatistics]);

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
        <div className="pb-20 px-4 py-6 selection:bg-amber/80">
            <div ref={divRef} className="max-w-4xl mx-auto flex flex-col gap-5">
                <Header totalGuessesCount={totalGuessesCount} />

                {!isFinished && (
                    <SearchBar
                        guessRows={guessRows}
                        isFinished={isFinished}
                        setGuessRows={setGuessRows}
                        setIsFinished={setIsFinished}
                        divRef={divRef}
                    />
                )}

                {isRowsLoading && <GuessRowsSkeleton guessRows={3} />}
                {!isRowsLoading && <GuessRows guessRows={guessRows} />}

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
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-5 resultBannerDiv">
                        {isFinished && guessRows.length > 0 && <ResultBanner
                            tries={tryCount}
                            album={findCorrectDailyAlbum(guessRows)}
                            nthPlayer={nthPlayerToGuess ?? null}
                        />}
                        {isFinished && guessRows.length > 0 && <ShareCard dailyAlbumNumber={dailyAlbumNumber} guessRows={guessRows} />}
                    </div>
                )}
                <OverallStatistics />
            </div>
        </div>
    );
};

export const DailyAlbumPage = () => {
    useEffect(() => {
        document.title = 'Daily Album';
    }, []);

    const { data, isPending, error } = useQuery<{
        dailyAlbumNumber: number;
        dailyAlbumTotalGuessesCount: number;
    }>({
        queryKey: ['daily-stats'],
        queryFn: async () => {
            const response = await axios.get('/daily/stats');
            return response.data;
        },
    });

    if (isPending) return <div className="loading">Loading daily album...</div>;
    if (error instanceof AxiosError) return <div className="loading text-(--error-text)">{error.response?.data.message}</div>;
    if (error) return <div className="loading text-(--error-text)">{error.message}</div>;

    const { dailyAlbumNumber, dailyAlbumTotalGuessesCount } = data;
    return (
        <DailyAlbumPageContent
            dailyAlbumNumber={dailyAlbumNumber}
            totalGuessesCount={dailyAlbumTotalGuessesCount}
        />
    );
};
