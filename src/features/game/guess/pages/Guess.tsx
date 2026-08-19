import Form from '../../../auth/components/form/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import axios from '../../../../shared/utils/axios';
import type { GuessType, TrackType } from '../types/guessTypes';
import type { FetchResponse } from '../types/albumTypes';
import useGuessStore from '../stores/useGuessStore';
import useCompare from '../hooks/useCompare';
import shuffle from '../utils/shuffle';
import { useQuery } from '@tanstack/react-query';
import useUser from '../../../auth/hooks/useUser';
import type { IUser } from '../../../../shared/types/user';
import useTrackStore from '../stores/useTrackStore';
import useTimer from '../hooks/useTimer';
import ConfigComponent from '../../config/components/Config';
import Friends from '../../config/components/Friends';
import useGuess from '../hooks/useGuess';
import { toast, ToastContainer } from 'react-toastify';
import queryClient from '@/shared/utils/queryClient';
import { type IFriendsAlbums } from '@/features/friends/hooks/useFriends';
import AlbumCover from '../components/AlbumCover';
import BottomSheet from '../components/BottomSheet';
import BottomNav from '../components/BottomNav';
import TracklistSection from '../components/TracklistSection';
import { LogErrorModal } from '../../album/components/LogErrorModal';

export type Sheet = 'config' | 'friends' | 'tracklist' | null;

const Guess = () => {
    const { data: user, isPending, error } = useUser();

    if (isPending) return <div className="loading">Loading...</div>;
    if (error) return <div className="loading text-(--error-text)">{error.message}</div>;
    return <GuessSync user={user!} />;
};

const GuessSync = ({ user }: { user: IUser }) => {
    const { albums, setAlbums, resetIndex } = useGuessStore();

    // const {
    //     isPending,
    //     error,
    //     isSuccess: isSynced,
    // } = useQuery({
    //     queryKey: ['sync', user?.lastfmIntegration.lastfmUsername],
    //     queryFn: async () => axios.get('/game'),
    // });

    const {
        isLoading: isAlbumsLoading,
        // error: albumsErrors,
        isRefetching,
        dataUpdatedAt,
    } = useQuery({
        queryKey: ['albums', user.profile.displayUsername],
        queryFn: async () =>
            axios.get<FetchResponse>('/integration/albums').then((res) => {
                shuffle(res.data.albums);
                setAlbums(res.data.albums);
                return res.data.albums;
            }),
        // enabled: isSynced,
        refetchInterval: albums.length <= 0 ? 20000 : false,
        gcTime: 0,
        staleTime: 0,
    });

    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        resetIndex();
    }, [dataUpdatedAt, resetIndex]);

    // if (isPending) return <span className="loading">Fetching user albums...</span>;
    if (isAlbumsLoading) return <span className="loading">Loading albums...</span>;
    // if (error || albumsErrors)
    //     return <span className="loading text-(--error-text)">{error?.message}</span>;
    if (albums.length <= 0)
        return <div className="loading">Preparing your albums, this may take a few minutes...</div>;
    if (isRefetching) return <div className="loading">Loading more albums...</div>;

    return <GuessContent user={user} />;
};

const GuessContent = ({ user }: { user: IUser }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [activeSheet, setActiveSheet] = useState<Sheet>(null);

    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();
    const { resetField: resetTrack } = useForm<TrackType>();

    const { currentAlbum, guess, reset } = useCompare(resetField, setFocus);
    const formRef = useRef<HTMLFormElement>(null);
    const { startTimer, pauseTimer, clearTimer, seconds, minutes } = useTimer();
    const [index, setIndex] = useState<number | undefined>();

    const { correctAnswers, isGuessed, setIsGuessed, config } = useGuessStore();
    const { setIsFinished, isFinished } = useTrackStore();
    const { setGuess, setAnswers, answers, isPending } = useGuess(minutes * 60 + seconds);

    const { data: timesGuessed, isSuccess } = useQuery({
        queryKey: ['stats', currentAlbum?.albumId],
        queryFn: async () => {
            const res = await axios.get<{ timesGuessed: number }>(
                `/guess/${currentAlbum?.albumId}`
            );
            return res.data.timesGuessed ?? -1;
        },
    });

    const toggleSheet = (sheet: Sheet) => setActiveSheet((prev) => (prev === sheet ? null : sheet));

    const onGuess: SubmitHandler<GuessType> = async (data) => {
        if (!isGuessed) {
            setIsGuessed(true);
            setIsFinished(true);

            const guessObj: { album: string; artist?: string; genre?: string; year?: string } = {
                album: data.album,
            };
            if (config.artist && currentAlbum.album.artists.length > 0)
                guessObj.artist = data.artist ?? '';
            if (config.genre && currentAlbum.album.genres.length > 0)
                guessObj.genre = data.genre ?? '';
            if (config.year && currentAlbum.album.year) guessObj.year = data.year ?? '';

            const answers = guess(guessObj);
            setAnswers(answers);

            const response = await setGuess();

            toast.success(response.totalScore + ' points');
            setFocus('buttonSubmit');

            queryClient.setQueryData(
                ['friends', currentAlbum.albumId],
                (oldData: IFriendsAlbums[]) => {
                    if (response.isNewBestScore) {
                        return oldData.map((f) =>
                            f.id === user.id ? { ...f, bestScore: response.totalScore } : f
                        );
                    }
                    return oldData;
                }
            );
            return queryClient.invalidateQueries({ queryKey: ['friends', currentAlbum.albumId] });
        }

        reset();
        resetTrack('track');
        setIsImageLoaded(false);
        setActiveSheet(null);
    };

    useEffect(() => {
        setFocus('album');
    }, [setFocus, correctAnswers]);

    useEffect(() => {
        if (isFinished) {
            formRef.current?.requestSubmit();
            pauseTimer();
        }
    }, [isFinished, pauseTimer]);

    return (
        <>
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3 h-md:gap-5 py-1 h-md:py-2 lg:main-height">
                <div className="hidden lg:block">
                    <ConfigComponent />
                </div>

                <div className="flex flex-col items-center w-fit px-4 lg:px-0 order-1 lg:order-2">
                    <article className="flex justify-center w-full min-w-48 max-w-48 lg:h-sm:min-w-60 lg:h-sm:max-w-60">
                        <AlbumCover
                            key={currentAlbum.album.cover_url}
                            src={currentAlbum.album.cover_url}
                            isGuessed={isGuessed}
                            onLoadingChange={setIsImageLoaded}
                            startTimer={startTimer}
                            clearTimer={clearTimer}
                        />
                    </article>

                    <div
                        className={`flex w-full lg:min-w-48 lg:max-w-48 lg:h-sm:min-w-60 lg:h-sm:max-w-60 mt-0.5 h-sm:mt-2 items-center ${
                            timesGuessed && timesGuessed >= 1 ? 'justify-between' : 'justify-end'
                        }`}
                    >
                        {isSuccess && timesGuessed >= 1 && (
                            <p className="text-xs text-muted-foreground">
                                Guessed{' '}
                                <span className="font-bold text-navy">
                                    {timesGuessed === 1 ? '1 time' : `${timesGuessed} times`}
                                </span>
                            </p>
                        )}
                        <span className="border-2 border-border rounded-full bg-(--card-light) px-1.5 h-sm:px-3 py-0.5 h-sm:py-1 text-xs h-sm:text-sm font-black number text-navy h-sm:shadow-[2px_2px_0_var(--border)]">
                            {minutes < 10 ? '0' + minutes : minutes}:
                            {seconds < 10 ? '0' + seconds : seconds}
                        </span>
                    </div>

                    <section className="w-full lg:min-w-48 lg:max-w-48 lg:h-sm:min-w-60 lg:h-sm:max-w-60 text-xs h-sm:text-sm h-lg:text-base mt-0.5 h-sm:mt-2">
                        <Form
                            ref={formRef}
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit(onGuess)}
                        >
                            <div
                                className={`flex w-full flex-col gap-1 rounded-xl border-2 border-border bg-(--card-light) p-2.5 h-sm:px-3 shadow-[3px_3px_0_var(--border)] ${
                                    isGuessed && 'pb-1'
                                }`}
                            >
                                {config.album && (
                                    <Form.Label>
                                        <Form.Input
                                            placeholder="Album"
                                            disabled={
                                                !currentAlbum.album.normalizedName || isGuessed
                                            }
                                            className={`disabled:opacity-40 ${
                                                config.album &&
                                                currentAlbum.album.normalizedName &&
                                                (isGuessed
                                                    ? correctAnswers.album
                                                        ? 'border-success'
                                                        : 'border-error'
                                                    : 'border-border')
                                            }`}
                                            {...register('album')}
                                            autoComplete="off"
                                        />
                                    </Form.Label>
                                )}
                                {config.album && isGuessed && !correctAnswers.album && (
                                    <span
                                        className="min-w-0 overflow-x-hidden text-left truncate text-ellipsis text-terra-dark font-bold px-1"
                                        title={currentAlbum.album.normalizedName}
                                    >
                                        {currentAlbum.album.normalizedName}
                                    </span>
                                )}

                                {config.artist && (
                                    <Form.Label>
                                        <Form.Input
                                            placeholder="Artist"
                                            disabled={
                                                currentAlbum.album.artists.length <= 0 || isGuessed
                                            }
                                            className={`disabled:opacity-40 ${
                                                config.artist &&
                                                currentAlbum.album.artists &&
                                                (isGuessed
                                                    ? correctAnswers.artist
                                                        ? 'border-success'
                                                        : correctAnswers.artist === false &&
                                                          'border-error'
                                                    : 'border-border')
                                            }`}
                                            {...register('artist')}
                                            autoComplete="off"
                                        />
                                    </Form.Label>
                                )}
                                {config.artist && isGuessed && correctAnswers.artist === false && (
                                    <span
                                        className="min-w-0 truncate overflow-hidden text-left text-nowrap text-ellipsis text-terra-dark font-bold px-1"
                                        title={currentAlbum.album.artists
                                            .map((a) => a.artist.normalizedName)
                                            .join(', ')}
                                    >
                                        {currentAlbum.album.artists.map((a, i, arr) =>
                                            i !== arr.length - 1
                                                ? a.artist.normalizedName + ', '
                                                : a.artist.normalizedName
                                        )}
                                    </span>
                                )}

                                <div className="flex justify-between gap-2">
                                    <div className="flex flex-col flex-1 min-w-0 max-w-49 lg:max-w-30">
                                        {config.genre && (
                                            <Form.Label>
                                                <Form.Input
                                                    disabled={
                                                        currentAlbum.album.genres.length <= 0 ||
                                                        isGuessed
                                                    }
                                                    placeholder="Any tag"
                                                    className={`disabled:opacity-40 flex-1 ${
                                                        config.genre &&
                                                        currentAlbum.album.genres.length > 0 &&
                                                        (isGuessed
                                                            ? correctAnswers.genre
                                                                ? 'border-success'
                                                                : correctAnswers.genre === false &&
                                                                  'border-error'
                                                            : 'border-border')
                                                    }`}
                                                    {...register('genre')}
                                                    autoComplete="off"
                                                />
                                            </Form.Label>
                                        )}
                                        {config.genre && isGuessed && (
                                            <div
                                                title={currentAlbum.album.genres
                                                    .map((g) => g.genre.name)
                                                    .join(', ')}
                                                className="flex-1 min-w-0 truncate overflow-x-scroll scroll-smooth pb-2 text-left text-nowrap text-terra-dark font-bold px-1"
                                                onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
                                                    if (e.deltaY !== 0) {
                                                        e.preventDefault();
                                                        e.currentTarget.scrollLeft += e.deltaY;
                                                    }
                                                }}
                                            >
                                                {(correctAnswers.genre === true ||
                                                    correctAnswers.genre === false) &&
                                                    currentAlbum.album.genres.map((g, i, arr) =>
                                                        i !== arr.length - 1
                                                            ? g.genre.name + ', '
                                                            : g.genre.name
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        {config.year && (
                                            <Form.Label className="w-21">
                                                <Form.Input
                                                    disabled={!currentAlbum.album.year || isGuessed}
                                                    placeholder="Year"
                                                    type="number"
                                                    className={`w-full disabled:opacity-40 ${
                                                        config.year &&
                                                        currentAlbum.album.year &&
                                                        (isGuessed
                                                            ? correctAnswers.year
                                                                ? 'border-success'
                                                                : correctAnswers.year === false &&
                                                                  'border-error'
                                                            : 'border-border')
                                                    }`}
                                                    {...register('year')}
                                                    autoComplete="off"
                                                />
                                            </Form.Label>
                                        )}
                                        {currentAlbum.album.year &&
                                            config.year &&
                                            isGuessed &&
                                            correctAnswers.year === false && (
                                                <span className="text-terra-dark font-bold px-1">
                                                    {currentAlbum.album.year}
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>

                            <Form.Input
                                {...register('buttonSubmit')}
                                type="submit"
                                disabled={isPending || !isImageLoaded}
                                value={!isGuessed ? 'Guess' : 'Next'}
                                className={`${!isGuessed ? 'sage-component' : 'amber-component'} w-full disabled:opacity-50 rounded-lg text-xs h-sm:text-sm`}
                            />
                        </Form>
                    </section>
                </div>

                {config.tracklist ? (
                    <div className="hidden lg:flex flex-col items-center w-[355.5px] h-full text-center order-3">
                        <TracklistSection
                            answers={answers}
                            index={index}
                            onTrackIndexChange={setIndex}
                            focus={false}
                        />
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-col items-center w-[355.5px] order-3" />
                )}

                <div className="hidden lg:block h-fit min-w-[355.5px] order-1">
                    <Friends isPending={isPending} />
                </div>
            </div>

            <BottomSheet
                open={activeSheet === 'config'}
                onClose={() => setActiveSheet(null)}
                title="Options"
            >
                <ConfigComponent inSheet />
            </BottomSheet>

            <BottomSheet
                open={activeSheet === 'friends'}
                onClose={() => setActiveSheet(null)}
                title="Also guessed"
            >
                <Friends isPending={isPending} />
            </BottomSheet>

            {config.tracklist && (
                <BottomSheet
                    open={activeSheet === 'tracklist'}
                    onClose={() => setActiveSheet(null)}
                    title="Tracklist"
                >
                    <TracklistSection
                        answers={answers}
                        index={index}
                        onTrackIndexChange={setIndex}
                        focus={activeSheet === 'tracklist'}
                    />
                </BottomSheet>
            )}

            <BottomNav
                activeSheet={activeSheet}
                onToggle={toggleSheet}
                hasTracklist={config.tracklist}
            />

            <LogErrorModal currentAlbum={currentAlbum}/>

            <ToastContainer position="top-center" limit={1} autoClose={300} />
        </>
    );
};

export default Guess;
