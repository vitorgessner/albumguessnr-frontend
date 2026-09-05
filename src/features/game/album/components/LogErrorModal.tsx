import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import useGuessStore from '../../guess/stores/useGuessStore';
import type { Album } from '../../guess/types/albumTypes';
import Form from '@/features/auth/components/form/Form';
import { NotebookPen } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import useUser from '@/features/auth/hooks/useUser';
import axios from '@/shared/utils/axios';
import { useEffect, useState } from 'react';

interface LogErrorData {
    title: boolean;
    artist: boolean;
    tags: boolean;
    year: boolean;
    tracks: boolean;
    cover: boolean;
    description: string;
}

export const LogErrorModal = ({ currentAlbum }: { currentAlbum: Album }) => {
    const [response, setResponse] = useState<string | null>(null);

    const { data: user } = useUser();
    const { isGuessed } = useGuessStore();
    const { register, handleSubmit, reset: resetForm } = useForm<LogErrorData>();

    const onFormSubmit: SubmitHandler<LogErrorData> = async (data) => {
        const fieldsWithErrors = [];

        for (const [key, value] of Object.entries(data)) {
            if (value === true) fieldsWithErrors.push(key);
        }

        const albumDataErrorLog = {
            album: currentAlbum.album,
            fieldsWithErrors: fieldsWithErrors.join(', '),
            description: data.description,
        };

        const response = await axios.post(`/userLog/${user?.id}`, albumDataErrorLog);
        setResponse(response.data.message);
    };

    useEffect(() => {
        const reset = () => {
            resetForm();
            setResponse(null);
        }

        reset();
    }, [resetForm, setResponse, currentAlbum])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="absolute h-13 w-13 right-5 bottom-18 lg:bottom-5 dark-terra-component rounded-full p-2 disabled:opacity-40 disabled:cursor-auto disabled:hover:translate-0 disabled:hover:shadow-[3px_3px_0_var(--terra-dark)]"
                    disabled={!isGuessed}
                >
                    <NotebookPen stroke="white" width={35} height={35}/>
                </button>
            </DialogTrigger>
            <DialogContent className="rounded-lg p-4 bg-white border-primary border-2">
                <DialogHeader>
                    <DialogTitle>
                        <h3 className="text-xl">Report error or inconsistency of data</h3>
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <p className="text-sm mb-5 -mt-2">
                        Reporting album{' '}
                        <span className={`text-primary ${!isGuessed && 'blur-xs'}`}>
                            '{isGuessed ? currentAlbum.album.name : 'Not Guessed'}'
                        </span>{' '}
                        by{' '}
                        <span className={`text-primary ${!isGuessed && 'blur-xs'}`}>
                            '
                            {isGuessed
                                ? currentAlbum.album.artists.map((a) => a.artist.name).join(', ')
                                : 'Not Guessed'}
                            '
                        </span>
                    </p>
                    <p>Fields with errors or inconsistencies:</p>
                    <span className="text-xs">Mark 0 or more items</span>
                    <Form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="flex justify-evenly bg-cream p-1 rounded-lg border-2 border-border">
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('title')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Title
                            </Form.Label>
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('artist')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Artist
                            </Form.Label>
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('tags')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Tags
                            </Form.Label>
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('year')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Year
                            </Form.Label>
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('tracks')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Tracks
                            </Form.Label>
                            <Form.Label className="flex-row items-center! gap-1!">
                                <Form.Input
                                    type="checkbox"
                                    {...register('cover')}
                                    className="inline w-fit p-0 m-0 accent-primary"
                                />{' '}
                                Cover
                            </Form.Label>
                        </div>
                        <Form.Label>
                            Description:{' '}
                            <Form.Textfield
                                rows={4}
                                {...register('description')}
                                placeholder="Give us more info about what's wrong"
                            />
                        </Form.Label>
                        <p className="text-sage">{response}</p>
                        {!response && (
                            <button className="addFriendButton mt-1 text-white">Send</button>
                        )}
                        {response && (
                            <DialogClose asChild>
                                <button className="removeFriendButton mt-1 text-white">Close</button>
                            </DialogClose>
                        )}
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
