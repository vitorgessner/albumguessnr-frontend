import { useForm, type SubmitHandler } from 'react-hook-form';
import useCompare from '../hooks/useCompare';
import useTrackStore from '../stores/useTrackStore';
import type { TrackType } from '../types/guessTypes';
import Form from '@/features/auth/components/form/Form';
import type { Answers } from '../../scoring/hooks/useScoring';
import { useEffect, useRef } from 'react';

const TracklistSection = ({
    answers,
    index,
    onTrackIndexChange,
}: {
    answers: Answers;
    index: number | undefined;
    onTrackIndexChange: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
    const tracksRef = useRef<HTMLUListElement>(null);
    const { register, handleSubmit, resetField } = useForm<TrackType>();
    const { currentAlbum, compareTrack, tries, incrementTries, resetTries } = useCompare();
    const { isFinished, setIsFinished, guessed } = useTrackStore();
    const guessedTracks = guessed.map((g) => g.name);

    const onTrackTry: SubmitHandler<TrackType> = (data) => {
        incrementTries();
        if (data.track === '' || !data.track) setIsFinished(true);
        resetField('track');
        const result = compareTrack(data.track);
        console.log(result);
        onTrackIndexChange(result);
    };

    useEffect(() => {
        if (!tracksRef.current || index === undefined) return;

        const ul = tracksRef.current;
        const items = ul.querySelectorAll('li');
        const target = items.item(index);
        if (!target) return;

        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, [index]);

    useEffect(() => {
        resetTries();
    }, [resetTries, currentAlbum]);

    return (
        <section
            className={`relative w-full flex flex-col overflow-hidden lg:border-2 lg:border-border lg:rounded-xl lg:shadow-[3px_3px_0_var(--border)] bg-(--card-light) lg:max-h-139 h-lg:max-h-159.5 ${
                currentAlbum.album.tracks.length === 0 && 'pb-3'
            }`}
        >
            <div className="fixed lg:sticky top-13 left-0 right-0 lg:top-0 z-10 flex items-center justify-between bg-(--card-light) border-b-2 border-border px-5 py-3">
                <div className="opacity-0 text-xs number">0/{currentAlbum.album.tracks.length}</div>
                <h3 className="text-xl font-black font-heading tracking-tight text-navy">
                    Tracklist
                </h3>
                <span className="text-xs font-black number text-muted-foreground">
                    {tries}/{currentAlbum.album.tracks.length}
                </span>
            </div>

            <ul
                ref={tracksRef}
                className="flex flex-col gap-1.5 overflow-y-auto scroll-smooth px-3 py-17 lg:py-3 flex-1"
            >
                {currentAlbum.album.tracks.map((t) => {
                    const isGuessedTrack = guessedTracks.includes(t.normalizedName);
                    const showName = !isFinished
                        ? isGuessedTrack
                        : answers.tracklist
                          ? true
                          : isGuessedTrack;
                    const borderColor = !isFinished
                        ? isGuessedTrack
                            ? 'border-success bg-sage/10'
                            : 'border-border'
                        : answers.tracklist
                          ? isGuessedTrack
                              ? 'border-success bg-sage/10'
                              : 'border-error bg-terra/5'
                          : 'border-border';

                    return (
                        <li
                            key={t.id}
                            id={t.id}
                            className={`rounded-lg border-2 bg-sidebar-border px-3 py-2 text-sm font-bold text-left transition-colors ${borderColor}`}
                        >
                            {showName ? (
                                <span className="text-navy">{t.normalizedName}</span>
                            ) : (
                                <span className="text-muted-foreground tracking-widest text-xs">
                                    • • •
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>

            {currentAlbum.album.tracks.length > 0 ? (
                <Form
                    onSubmit={handleSubmit(onTrackTry)}
                    className="fixed lg:sticky bottom-0 w-full bg-(--card-light) border-t-2 border-border p-3"
                >
                    <Form.Label>
                        <Form.Input
                            disabled={isFinished}
                            placeholder="Type a track name..."
                            className="border-border w-full disabled:opacity-60"
                            {...register('track')}
                            autoComplete="off"
                        />
                    </Form.Label>
                </Form>
            ) : (
                <p className="px-4 py-3 text-sm text-muted-foreground text-center">
                    Tracklist unavailable for this album.
                </p>
            )}
        </section>
    );
};

export default TracklistSection;
