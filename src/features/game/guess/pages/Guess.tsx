import { Timer } from "lucide-react";
import Form from "../../../auth/components/form/Form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useRef } from "react";
import axios from "../../../../shared/utils/axios";
import type { GuessType, TrackType } from "../types/guessTypes";
import type { FetchResponse } from "../types/albumTypes";
import useGuessStore from "../stores/useGuessStore";
import useCompare from "../hooks/useCompare";
import shuffle from "../utils/shuffle";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";
import type { IUser } from "../../../../shared/types/user";
import useTrackStore from "../stores/useTrackStore";

const Guess = () => {
    const { user, isPending, error } = useUser();

    if (isPending) return <div className="loading">Loading...</div>;

    if (error) return <div className="loading text-(--error-text)">{error.message}</div>;

    return <GuessSync user={user!} />
}

const GuessSync = ({ user }: { user: IUser }) => {
    const { albums, setAlbums, resetIndex } = useGuessStore();

    const { isPending, error, isSuccess: isSynced } = useQuery({
        queryKey: ['sync', user?.lastfmIntegration.lastfmUsername],
        queryFn: async () => {
            const res = await axios.get('/game');
            return res;
        },
    })


    const { isLoading: isAlbumsLoading, error: albumsErrors, isRefetching, dataUpdatedAt } = useQuery({
        queryKey: ['albums', user?.lastfmIntegration.lastfmUsername],
        queryFn: async () => await axios.get<FetchResponse>('/integration/albums').then((res) => {
            shuffle(res.data.albums)
            setAlbums(res.data.albums);
            return res.data.albums;
        }
        ),
        enabled: isSynced,
        refetchInterval: albums.length <= 0 ? 20000 : false,
    })

    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        resetIndex();
    }, [dataUpdatedAt, resetIndex])

    if (isPending) return <span className="loading">Fetching user albums...</span>

    if (isAlbumsLoading) return <span className="loading">Loading albums...</span>

    if (error || albumsErrors) return <span className="loading text-(--error-text)">{error?.message}</span>

    if (albums.length <= 0) return <div className="loading">Preparing your albums, this may take a few minutes...</div>

    if (isRefetching) return <div className="loading">Loading more albums...</div>

    return <GuessContent />
}

const GuessContent = () => {
    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();
    const { register: trackRegister, handleSubmit: trackHandleSubmit, resetField: resetTrack } = useForm<TrackType>();
    const { currentAlbum, guess, reset, compareTrack } = useCompare(resetField, setFocus);
    const formRef = useRef<HTMLFormElement>(null);

    const {
        correctAnswers,
        isGuessed,
        setIsGuessed,
        config,
    } = useGuessStore();

    const { guessed, setRemainig, setIsFinished, isFinished } = useTrackStore();

    const onGuess: SubmitHandler<GuessType> = (data) => {
        if (!isGuessed) {
            setIsGuessed(true);
            setIsFinished(true);
            guess(data.album, data.artist, data.genre, data.year);
            setRemainig(0);

            setFocus('buttonSubmit');
        } else if (isGuessed) {
            reset();
            resetTrack('track');
        }
    }

    const onTrackTry: SubmitHandler<TrackType> = (data) => {
        compareTrack(data.track);
        resetTrack('track');
    }

    useEffect(() => {
        setFocus('album');
        setRemainig(currentAlbum.album.tracks.length);
    }, [setFocus, setRemainig, currentAlbum.album.tracks.length])

    useEffect(() => {
        if (isFinished) {
            formRef.current?.requestSubmit();
        }
    }, [isFinished])

    const guessedTracks = guessed.map(g => g.name);

    return (
        <main className="flex justify-center gap-5 h-full lg:h-dvh py-20">
            <div className="w-[301px] p-3 h-fit"></div>
            <div className="flex flex-col items-center text-center h-fit">
                <article>
                    <div className="border-2 border-(--border) overflow-hidden rounded-sm w-67">
                        <img src={currentAlbum.album.cover_url} alt="" className={!isGuessed ? "blur-md" : ''} />
                    </div>
                </article>
                <section>
                    <Form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit(onGuess)}>
                        <p className="flex justify-end items-center py-2"><Timer /> 00</p>
                        {config.album && <Form.Label>
                            <Form.Input placeholder="Album" className={`w-67 disabled:opacity-40 ${config.album && currentAlbum.album.normalizedName && (isGuessed ? correctAnswers.album ? 'border-(--success-text)' : 'border-(--error-text)' : 'border-(--border)')}`} {...register('album')} autoComplete="off" />
                        </Form.Label>}
                        {config.album && isGuessed && (!correctAnswers.album && <span className="text-left max-w-67">{currentAlbum.album.normalizedName}</span>)}
                        {config.artist && <Form.Label>
                            <Form.Input placeholder="Artist" className={`w-67 disabled:opacity-40 ${config.artist && currentAlbum.album.normalizedArtist && (isGuessed ? correctAnswers.artist ? 'border-(--success-text)' : 'border-(--error-text)' : 'border-(--border)')}`} {...register('artist')} autoComplete="off" />
                        </Form.Label>}
                        {config.artist && isGuessed && (!correctAnswers.artist && <span className="text-left max-w-67">{currentAlbum.album.normalizedArtist}</span>)}
                        <div className="flex justify-between max-w-67 w-67 gap-2">
                            <div className="flex flex-col">
                                {config.genre && <Form.Label>
                                    <Form.Input disabled={currentAlbum.album.genres.length <= 0} placeholder="Any tags" className={`w-full disabled:opacity-40 ${config.genre && currentAlbum.album.genres.length > 0 && (isGuessed ? correctAnswers.genre ? 'border-(--success-text)' : 'border-(--error-text)' : 'border-(--border)')}`} {...register('genre')} autoComplete="off" />
                                </Form.Label>}
                                {config.genre && isGuessed && (<span className="text-left max-w-67">{currentAlbum.album.genres.map(genre => genre.genre.name + ', ')}</span>)}
                            </div>
                            <div className="flex flex-col">
                                {config.year && <Form.Label className="w-21">
                                    <Form.Input disabled={!currentAlbum.album.year} placeholder="Year" type="number" className={`w-full disabled:opacity-40 ${config.year && currentAlbum.album.year && (isGuessed ? correctAnswers.year ? 'border-(--success-text)' : 'border-(--error-text)' : 'border-(--border)')}`} {...register('year')} autoComplete="off" />
                                </Form.Label>}
                                {currentAlbum.album.year && config.year && isGuessed && (!correctAnswers.year && <span className="text-left max-w-67">{currentAlbum.album.year}</span>)}
                            </div>
                        </div>
                        <Form.Input {...register('buttonSubmit')} type="submit" value={!isGuessed ? 'Guess' : 'Next'} className="w-full" />
                    </Form>
                </section>
            </div>
            <div className='flex flex-col items-center text-center w-[301px] aria-disabled:opacity-40 h-fit'>
                {config.tracklist && <section className={`w-full border-2 border-(--border) bg-(--primary-color) max-h-[538px] overflow-scroll relative ${currentAlbum.album.tracks.length === 0 && 'pb-3'}`}>
                    <div className="flex items-center text-xl pt-3 px-3 justify-between sticky top-0 bg-(--primary-color) p-3 border-b-2 border-(--border)">
                        <div className="opacity-0">0/{currentAlbum.album.tracks.length}</div>
                        <h3>Tracklist</h3>
                        <span>{guessed.length}/{currentAlbum.album.tracks.length}</span>
                    </div>
                    <ul className="flex flex-col gap-2 my-2 px-3 overflow-hidden">
                        {currentAlbum.album.tracks.map((t) => {
                            return <li key={t.id} 
                            className={`bg-(--secondary-color) p-1 border-2 ${!isFinished ? (guessedTracks.includes(t.normalizedName) ? 'border-(--success-text)' : 'border-(--border)') : guessedTracks.includes(t.normalizedName) ? 'border-(--success-text)' : 'border-(--error-text)'}`}
                            >{(guessedTracks.includes(t.normalizedName) || isFinished) && t.normalizedName}</li>
                        })}
                    </ul>
                    {currentAlbum.album.tracks.length > 0 ?
                        <Form onSubmit={trackHandleSubmit(onTrackTry)} className="text-center sticky bottom-0 bg-(--primary-color) w-full p-3">
                            <Form.Label>
                                <Form.Input disabled={isFinished} placeholder="Track" className={"w-full disabled:opacity-40"} {...trackRegister('track')} autoComplete="off" />
                            </Form.Label>
                        </Form> :
                        <span>It wasn't possible to fetch the tracklist</span>}
                </section>}
            </div>
        </main>
    )
}

export default Guess;