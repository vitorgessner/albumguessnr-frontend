import { Timer } from "lucide-react";
import Form from "../../../auth/components/form/Form";
import Label from "../../../auth/components/form/Label";
import Input from "../../../auth/components/form/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../../../../shared/utils/axios";

type GuessType = {
    album: string;
    artist: string;
}

type FetchResponse = {
    status: string,
    albums: [
        {
            album: {
                cover_url: string,
                id: string,
                mbid: string | null,
                name: string,
                normalizedArtist: string,
                normalizedName: string,
                year: Date
            },
            albumId: string,
            lastfmIntegrationId: string,
            lastTimeListened: Date,
            timesListened: number,
            tracksListened: number,
        }
    ]
}

type AlbumsState = {
    album: {
        cover_url: string,
        id: string,
        mbid: string | null,
        name: string,
        normalizedArtist: string,
        normalizedName: string,
        year: Date
    },
    albumId: string,
    lastfmIntegrationId: string,
    lastTimeListened: Date,
    timesListened: number,
    tracksListened: number,
}

const Guess = () => {
    const { register, handleSubmit, resetField, setFocus } = useForm<GuessType>();

    const [albums, setAlbums] = useState<Array<AlbumsState>>([]);
    const [index, setIndex] = useState<number>(48);

    const onGuess: SubmitHandler<GuessType> = (data) => {
        console.log(data.album + ' | ' + albums[index].album.normalizedName);
        console.log(data.artist + ' | ' + albums[index].album.normalizedArtist);

        resetField('album');
        resetField('artist');

        setFocus('album')
        if (index < 49) {
            return setIndex(prev => prev + 1)
        } 
        setIndex(0);
    }

    const shuffle = (arr) => {
        let currentIndex = arr.length;

        while (currentIndex !== 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
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
    }, [albums])

    if (!albums || albums.length === 0) return <span>Loading...</span>

    return (
        <main className="flex flex-col items-center h-full lg:h-dvh pt-20 text-center">
            <article>
                <div className="border-2 border-(--border) overflow-hidden rounded-sm w-67">
                    <img src={albums[index].album.cover_url} alt="" className="blur-sm" />
                </div>
            </article>
            <section>
                <p className="flex justify-end items-center py-2"><Timer /> 00</p>
                <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onGuess)}>
                    <Label>
                        <Input placeholder="Album" className="w-67" {...register('album')} autoComplete="off"/>
                    </Label>
                    <Label>
                        <Input placeholder="Artist" className="w-67" {...register('artist')} autoComplete="off"/>
                    </Label>
                    <Input type="submit" value="Guess" className="w-full" />
                </Form>
            </section>
        </main>
    )
}

export default Guess;