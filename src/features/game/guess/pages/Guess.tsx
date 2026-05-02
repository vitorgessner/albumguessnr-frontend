import { Timer } from 'lucide-react';
import Form from '../../../auth/components/form/Form';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import axios from '../../../../shared/utils/axios';
import type { GuessType, TrackType } from '../types/guessTypes';
import type { FetchResponse } from '../types/albumTypes';
import useGuessStore from '../stores/useGuessStore';
import useCompare from '../hooks/useCompare';
import shuffle from '../utils/shuffle';
import { useMutation, useQuery } from '@tanstack/react-query';
import useUser from '../../../auth/hooks/useUser';
import type { IUser } from '../../../../shared/types/user';
import useTrackStore from '../stores/useTrackStore';
import useTimer from '../hooks/useTimer';
import ConfigComponent from '../../config/components/Config';

const Guess = () => {
    const { user, isPending, error } = useUser();

    if (isPending) return <div className="loading">Loading...</div>;

    if (error) return <div className="loading text-(--error-text)">{error.message}</div>;

    return <GuessSync user={user!} />;
};

const GuessSync = ({ user }: { user: IUser }) => {
    const { albums, setAlbums, resetIndex } = useGuessStore();

    const {
        isPending,
        error,
        isSuccess: isSynced,
    } = useQuery({
        queryKey: ['sync', user?.lastfmIntegration.lastfmUsername],
        queryFn: async () => {
            const res = await axios.get('/game');
            return res;
        },
    });

    const {
        isLoading: isAlbumsLoading,
        error: albumsErrors,
        isRefetching,
        dataUpdatedAt,
    } = useQuery({
        queryKey: ['albums', user?.lastfmIntegration.lastfmUsername],
        queryFn: async () =>
            await axios.get<FetchResponse>('/integration/albums').then((res) => {
                shuffle(res.data.albums);
                setAlbums(res.data.albums);
                return res.data.albums;
            }),
        enabled: isSynced,
        refetchInterval: albums.length <= 0 ? 20000 : false,
    });

    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        resetIndex();
    }, [dataUpdatedAt, resetIndex]);

    if (isPending) return <span className="loading">Fetching user albums...</span>;

    if (isAlbumsLoading) return <span className="loading">Loading albums...</span>;

    if (error || albumsErrors)
        return <span className="loading text-(--error-text)">{error?.message}</span>;

    if (albums.length <= 0)
        return <div className="loading">Preparing your albums, this may take a few minutes...</div>;

    if (isRefetching) return <div className="loading">Loading more albums...</div>;

    return <GuessContent />;
};

const GuessContent = () => {
    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();
    const {
        register: trackRegister,
        handleSubmit: trackHandleSubmit,
        resetField: resetTrack,
    } = useForm<TrackType>();
    const { currentAlbum, guess, reset, compareTrack } = useCompare(resetField, setFocus);
    const formRef = useRef<HTMLFormElement>(null);
    const tracksRef = useRef<HTMLUListElement>(null);
    const { startTimer, pauseTimer, clearTimer, seconds, minutes } = useTimer();
    const [index, setIndex] = useState<number | undefined>();

    const { correctAnswers, isGuessed, setIsGuessed, config } = useGuessStore();

    const { guessed, setIsFinished, isFinished, rightAnswersCount } = useTrackStore();

    const { data: timesGuessed, isSuccess } = useQuery({
        queryKey: ['stats', currentAlbum?.albumId],
        queryFn: async () => {
            const res = await axios.get<{ timesGuessed: number }>(
                `/guess/${currentAlbum?.albumId}`
            );
            return res.data.timesGuessed;
        },
    });

    const mutation = useMutation({
        mutationFn: (albumId: string) => {
            return axios.put('/guess', { albumId });
        },
    });

    const onGuess: SubmitHandler<GuessType> = (data) => {
        if (!isGuessed) {
            setIsGuessed(true);
            setIsFinished(true);
            const guessObj: {
                album: string;
                artist?: string;
                tag?: string;
                year?: string;
            } = { album: data.album };
            if (config.artist) guessObj.artist = data.artist ?? '';
            if (config.genre) guessObj.tag = data.genre ?? '';
            if (config.year) guessObj.year = data.year ?? '';
            guess(guessObj);

            setFocus('buttonSubmit');

            mutation.mutate(currentAlbum.albumId);
        } else if (isGuessed) {
            reset();

            resetTrack('track');
        }
    };

    // useEffect(() => {
    //     if (tracksRef.current) {
    //         const tracks = tracksRef.current?.querySelector('ul')?.querySelectorAll('li');
    //         if (!tracks) return;
    //         if (index && index >= 0) {
    //             const track = tracks.item(index);
    //             if (!track) return;
    //             track.scrollIntoView({
    //                 behavior: 'smooth',
    //                 block: 'start',
    //             });
    //         }
    //     }
    // }, [tracksRef, index]);

    const onTrackTry: SubmitHandler<TrackType> = (data) => {
        if (data.track === '' || !data.track) {
            setIsFinished(true);
        }
        resetTrack('track');
        // setIndex(compareTrack(data.track));
        const idx = compareTrack(data.track);
        if (!idx) return;
        if (tracksRef.current) {
            const tracks = tracksRef.current.querySelector('ul')?.querySelectorAll('li');
            if (!tracks) return;
            const track = tracks.item(idx);
            if (!track) return;
            track.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }
    };

    useEffect(() => {
        setFocus('album');
    }, [setFocus, correctAnswers]);

    useEffect(() => {
        clearTimer();
        startTimer();
    }, [startTimer, clearTimer, currentAlbum.album.cover_url]);

    useEffect(() => {
        if (isFinished) {
            formRef.current?.requestSubmit();
            pauseTimer();
        }
    }, [isFinished, pauseTimer]);

    const guessedTracks = guessed.map((g) => g.name);

    return (
        <main className="flex flex-col lg:flex-row items-center lg:items-start main-height justify-center gap-5 py-2 pb-16 lg:pb-2">
            <ConfigComponent />
            <div className="h-fit lg:w-75.25"></div>
            <div className="h-fit flex-col items-center text-center min-w-62 max-w-62">
                <article className='flex justify-center w-full'>
                    <div className={`flex overflow-hidden w-full min-w-62 max-w-62 rounded-sm border-2 border-border`}>
                        <img
                            src={currentAlbum.album.cover_url}
                            alt=""
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                            className={`size-full w-full min-w-62 max-w-62 ${!isGuessed ? 'blur-md' : ''}`}
                        />
                    </div>
                </article>
                <section className="mt-1">
                    <p
                        className={`flex ${timesGuessed && timesGuessed >= 1 ? 'justify-between' : 'justify-end'} items-center text-center`}
                    >
                        {isSuccess && timesGuessed >= 1 && (
                            <div className="text-left text-xs opacity-90">
                                You've guessed this album
                                {timesGuessed === 1 ? ' 1 time' : ` ${timesGuessed} times`}!
                            </div>
                        )}
                        <span className="border-border w-17 rounded-full border-2 bg-(--card-light) px-2 py-1 text-center">
                            {minutes < 10 ? 0 + '' + minutes : minutes}:
                            {seconds < 10 ? 0 + '' + seconds : seconds}
                        </span>
                    </p>
                    <Form
                        ref={formRef}
                        className="flex flex-col gap-2"
                        onSubmit={handleSubmit(onGuess)}
                    >
                        <div className={`mt-1 flex w-full flex-col gap-1 rounded-sm border-2 bg-(--card-light) p-3 ${isGuessed && 'pb-1'}`}>
                            {config.album && (
                                <Form.Label>
                                    <Form.Input
                                        placeholder="Album"
                                        disabled={!currentAlbum.album.normalizedName || isGuessed}
                                        className={`disabled:opacity-90 ${config.album && currentAlbum.album.normalizedName && (isGuessed ? (correctAnswers.album ? 'border-success' : 'border-error') : 'border-border')}`}
                                        {...register('album')}
                                        autoComplete="off"
                                    />
                                </Form.Label>
                            )}
                            {config.album && isGuessed && !correctAnswers.album && (
                                <span
                                    className="overflow-hidden text-left text-nowrap text-ellipsis whitespace-nowrap"
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
                                        className={`disabled:opacity-90 ${config.artist && currentAlbum.album.artists && (isGuessed ? (correctAnswers.artist ? 'border-success' : correctAnswers.artist === false && 'border-error') : 'border-border')}`}
                                        {...register('artist')}
                                        autoComplete="off"
                                    />
                                </Form.Label>
                            )}
                            {config.artist && isGuessed && correctAnswers.artist === false && (
                                <span
                                    className="overflow-hidden text-left text-nowrap text-ellipsis whitespace-nowrap"
                                    title={currentAlbum.album.artists.join(', ')}
                                >
                                    {currentAlbum.album.artists.map((a, i, arr) =>
                                        i !== arr.length - 1
                                            ? a.artist.normalizedName + ', '
                                            : a.artist.normalizedName
                                    )}
                                </span>
                            )}

                            <div className="flex justify-between h-lg:-max-w-38">
                                <div className="flex flex-col">
                                    {config.genre && (
                                        <Form.Label>
                                            <Form.Input
                                                disabled={
                                                    currentAlbum.album.genres.length <= 0 ||
                                                    isGuessed
                                                }
                                                placeholder="Any tag"
                                                className={`w-32 disabled:opacity-90 ${config.genre && currentAlbum.album.genres.length > 0 && (isGuessed ? (correctAnswers.genre ? 'border-success' : correctAnswers.genre === false && 'border-error') : 'border-border)')}`}
                                                {...register('genre')}
                                                autoComplete="off"
                                            />
                                        </Form.Label>
                                    )}
                                    {config.genre && isGuessed && (
                                        <div
                                            className="max-w-32 h-lg:max-w-45 overflow-x-scroll scroll-smooth pb-3 text-left text-nowrap"
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
                                                className={`w-full disabled:opacity-90 ${config.year && currentAlbum.album.year && (isGuessed ? (correctAnswers.year ? 'border-success' : correctAnswers.year === false && 'border-error') : 'border-border)')}`}
                                                {...register('year')}
                                                autoComplete="off"
                                            />
                                        </Form.Label>
                                    )}
                                    {currentAlbum.album.year &&
                                        config.year &&
                                        isGuessed &&
                                        correctAnswers.year === false && (
                                            <span className="max-w-67 pl-1 text-left">
                                                {currentAlbum.album.year}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                        <Form.Input
                            {...register('buttonSubmit')}
                            type="submit"
                            value={!isGuessed ? 'Guess' : 'Next'}
                            className={`sage-component w-full`}
                        />
                    </Form>
                </section>
            </div>
            <div className="flex flex-col items-center w-75.25 text-center aria-disabled:opacity-90">
                {config.tracklist && (
                    <section
                        ref={tracksRef}
                        className={`border-border relative lg:max-h-139 h-lg:max-h-159.5 w-full overflow-scroll rounded-sm border-2 bg-(--card-light) ${currentAlbum.album.tracks.length === 0 && 'pb-3'}`}
                    >
                        <div className="border-border sticky top-0 flex items-center justify-between bg-(--card-light) p-3 px-3 pt-3 text-xl">
                            <div className="opacity-0">0/{currentAlbum.album.tracks.length}</div>
                            <h3>Tracklist</h3>
                            <span>
                                {guessed.length}/{currentAlbum.album.tracks.length}
                            </span>
                        </div>
                        <ul className="my-1 flex flex-col gap-2 overflow-hidden scroll-smooth px-3">
                            {currentAlbum.album.tracks.map((t) => {
                                return (
                                    <li
                                        key={t.id}
                                        id={t.id}
                                        className={`rounded-sm border-2 bg-sidebar-border p-1 ${!isFinished ? (guessedTracks.includes(t.normalizedName) ? 'border-success' : 'border-border)') : typeof rightAnswersCount === 'number' ? (guessedTracks.includes(t.normalizedName) ? 'border-success' : 'border-error') : 'border-border'}`}
                                    >
                                        {typeof rightAnswersCount === 'number'
                                            ? guessedTracks.includes(t.normalizedName) || isFinished
                                                ? t.normalizedName
                                                : '...'
                                            : '...'}
                                    </li>
                                );
                            })}
                        </ul>
                        {currentAlbum.album.tracks.length > 0 ? (
                            <Form
                                onSubmit={trackHandleSubmit(onTrackTry)}
                                className="sticky bottom-0 w-full bg-(--card-light) p-4 text-center"
                            >
                                <Form.Label>
                                    <Form.Input
                                        disabled={isFinished}
                                        placeholder="Track"
                                        className={'border-border w-full disabled:opacity-90'}
                                        {...trackRegister('track')}
                                        autoComplete="off"
                                    />
                                </Form.Label>
                            </Form>
                        ) : (
                            <span>It wasn't possible to fetch the tracklist</span>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};

export default Guess;
