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

const Guess = () => {
    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();
    const { compareAlbum, compareArtist, reset } = useCompare(resetField, setFocus);

    const { 
        albums, 
        setAlbums, 
        index, 
        isTitleCorrect, 
        isArtistCorrect,  
        isGuessed, 
        setIsGuessed 
    } = useGuessStore();

    const currentAlbum = albums[index]

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
        const syncAlbums = async () => {
            try {
                await axios.get('/game');
            } catch (err) {
                console.log(err.response);
            }
        }

        syncAlbums();
    }, [])

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get<FetchResponse>('/integration/albums');

                shuffle(response.data.albums);

                setAlbums(response.data.albums);
            } catch (err) {
                console.log(err);
            }
        }

        if (albums.length === 0) {
            fetchAlbums();
        }
    }, [albums, setAlbums])

    console.log(currentAlbum);

    if (!albums || albums.length === 0) return <span>Loading...</span>

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