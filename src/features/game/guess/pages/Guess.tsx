import { Timer } from "lucide-react";
import Form from "../../../auth/components/form/Form";
import Label from "../../../auth/components/form/Label";
import Input from "../../../auth/components/form/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import axios from "../../../../shared/utils/axios";
import type { GuessType } from "../types/guessTypes";
import type { FetchResponse } from "../types/albumTypes";
import useGuessStore from "../stores/useGuessStore";
import useCompare from "../hooks/useCompare";
import shuffle from "../utils/shuffle";
import useAuthStore from "../../../auth/stores/useAuthStore";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const Guess = () => {
    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();
    const { compareAlbum, compareArtist, reset } = useCompare(resetField, setFocus);
    const { user } = useAuthStore();

    const queryClient = useQueryClient();

    const {
        albums,
        setAlbums,
        index,
        isTitleCorrect,
        isArtistCorrect,
        isGuessed,
        setIsGuessed,
    } = useGuessStore();

    const onGuess: SubmitHandler<GuessType> = (data) => {
        if (!isGuessed) {
            setIsGuessed(true);
            compareAlbum(data.album.toLowerCase().trim());
            compareArtist(data.artist.toLowerCase().trim());
            setFocus('buttonSubmit');
        }

        if (isGuessed) {
            reset();
        }
    }

    useEffect(() => {
        if (index >= 49) queryClient.invalidateQueries({ queryKey: ['albums', user?.lastfmIntegration.lastfmUsername]});
    }, [queryClient, user?.lastfmIntegration.lastfmUsername, index])

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['albums', user?.lastfmIntegration.lastfmUsername]});
    }, [queryClient, user?.lastfmIntegration.lastfmUsername])

    useEffect(() => {
        const syncAlbums = async () => {
            try {
                await axios.get('/game');
            } catch (err) {
                console.log(err);
            }
        }

        syncAlbums();
    }, [])

    const { isPending, error } = useQuery({
        queryKey: ['albums', user?.lastfmIntegration.lastfmUsername],
        queryFn: () => axios.get<FetchResponse>('/integration/albums').then((res) => {
            shuffle(res.data.albums)
            setAlbums(res.data.albums);
            return res.data.albums;
        }
        ),
    })

    if (isPending) return <span className="flex justify-center items-center h-dvh text-xl">Loading...</span>

    if (error) return <span className="flex justify-center items-center h-dvh text-xl text-(--error-text)">{error.message}</span>

    const currentAlbum = albums[index]

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