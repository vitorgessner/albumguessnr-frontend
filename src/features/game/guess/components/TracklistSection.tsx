import { useForm, type SubmitHandler } from 'react-hook-form';
import useCompare from '../hooks/useCompare';
import useTrackStore from '../stores/useTrackStore';
import type { TrackType } from '../types/guessTypes';
import Form from '@/features/auth/components/form/Form';
import type { Answers } from '../../scoring/hooks/useScoring';
import { useEffect } from 'react';

const TracklistSection = ({
    tracksRef,
    answers,
    onTrackIndexChange,
}: {
    tracksRef: React.RefObject<HTMLUListElement | null>;
    answers: Answers;
    onTrackIndexChange: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
    const { register, handleSubmit, resetField } = useForm<TrackType>();
    const { currentAlbum, compareTrack, tries, setTries } = useCompare();
    const { isFinished, setIsFinished, guessed } = useTrackStore();
    const guessedTracks = guessed.map((g) => g.name);

    const onTrackTry: SubmitHandler<TrackType> = (data) => {
        setTries((prev) => prev + 1);
        if (data.track === '' || !data.track) setIsFinished(true);
        resetField('track');
        onTrackIndexChange(compareTrack(data.track));
    };

    useEffect(() => {
        setTries(0);
    }, [setTries, currentAlbum])

    return (
        <section
            ref={tracksRef}
            className={`relative w-full overflow-scroll lg:border-2 lg:border-border rounded-sm bg-(--card-light) lg:max-h-139 h-lg:max-h-159.5 ${currentAlbum.album.tracks.length === 0 && 'pb-3'}`}
        >
            <div className="border-border fixed lg:sticky top-13 left-0 right-0 lg:top-0 flex items-center justify-between bg-(--card-light) p-3 px-3 pt-3 text-xl">
                <div className="opacity-0">0/{currentAlbum.album.tracks.length}</div>
                <h3>Tracklist</h3>
                <span>{tries}/{currentAlbum.album.tracks.length}</span>
            </div>
            <ul className="my-1 flex flex-col gap-2 overflow-hidden scroll-smooth px-3 py-17 lg:py-0">
                {currentAlbum.album.tracks.map((t) => (
                    <li
                        key={t.id}
                        id={t.id}
                        className={`rounded-sm border-2 bg-sidebar-border p-1 text-center
                            ${!isFinished
                                ? guessedTracks.includes(t.normalizedName) ? 'border-success' : 'border-border'
                                : answers.tracklist
                                    ? guessedTracks.includes(t.normalizedName) ? 'border-success' : 'border-error'
                                    : 'border-border'
                            }`}
                    >
                        {!isFinished
                            ? guessedTracks.includes(t.normalizedName) ? t.normalizedName : '...'
                            : isFinished && answers.tracklist ? t.normalizedName : '...'}
                    </li>
                ))}
            </ul>
            {currentAlbum.album.tracks.length > 0 ? (
                <Form
                    onSubmit={handleSubmit(onTrackTry)}
                    className="fixed lg:sticky bottom-0 w-full bg-(--card-light) p-4 text-center"
                >
                    <Form.Label>
                        <Form.Input
                            disabled={isFinished}
                            placeholder="Track"
                            className="border-border w-full disabled:opacity-90"
                            {...register('track')}
                            autoComplete="off"
                        />
                    </Form.Label>
                </Form>
            ) : (
                <span>It wasn't possible to fetch the tracklist</span>
            )}
        </section>
    );
};

export default TracklistSection;