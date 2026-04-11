import { Timer } from "lucide-react";
import Form from "../../../auth/components/form/Form";
import Label from "../../../auth/components/form/Label";
import Input from "../../../auth/components/form/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useRef } from "react";
import axios from "../../../../shared/utils/axios";
import type { GuessType } from "../types/guessTypes";
import type { FetchResponse } from "../types/albumTypes";
import useGuessStore from "../stores/useGuessStore";
import useCompare from "../hooks/useCompare";
import shuffle from "../utils/shuffle";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";
import type { IUser } from "../../../../shared/types/user";

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
    const { currentAlbum, compareAlbum, compareArtist, reset } = useCompare(resetField, setFocus);

    const {
        isTitleCorrect,
        isArtistCorrect,
        isGuessed,
        setIsGuessed,
    } = useGuessStore();

    const onGuess: SubmitHandler<GuessType> = (data) => {
        if (!isGuessed) {
            setIsGuessed(true);
            compareAlbum(data.album);
            compareArtist(data.artist);
            setFocus('buttonSubmit');
        } else if (isGuessed) {
            reset();
        }
    }

    useEffect(() => {
        setFocus('album');
    }, [setFocus])

    return (
        <main className="flex flex-col items-center h-full lg:h-dvh pt-20 text-center">
            <article>
                <div className="border-2 border-(--border) overflow-hidden rounded-sm w-67">
                    <img src={currentAlbum.album.cover_url} alt="" className={!isGuessed ? "blur-md" : ''} />
                </div>
            </article>
            <section>
                <p className="flex justify-end items-center py-2"><Timer /> 00</p>
                <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onGuess)}>
                    <Label>
                        <Input placeholder="Album" className={isGuessed ? (isTitleCorrect ? "w-67 border-(--success-text)" : "w-67 border-(--error-text)") : "w-67"} {...register('album')} autoComplete="off" />
                    </Label>
                    {isGuessed && (!isTitleCorrect && <span className="text-left max-w-67">{currentAlbum.album.normalizedName}</span>)}
                    <Label>
                        <Input placeholder="Artist" className={isGuessed ? (isArtistCorrect ? "w-67 border-(--success-text)" : "w-67 border-(--error-text)") : "w-67"} {...register('artist')} autoComplete="off" />
                    </Label>
                    {isGuessed && (!isArtistCorrect && <span className="text-left max-w-67">{currentAlbum.album.normalizedArtist}</span>)}
                    <Input {...register('buttonSubmit')} type="submit" value={!isGuessed ? 'Guess' : 'Next'} className="w-full" />
                </Form>
            </section>
        </main>
    )
}

export default Guess;