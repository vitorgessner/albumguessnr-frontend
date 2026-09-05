import type { DailyAlbum } from '../types/DailyAlbum';
import { useTimerToMidnightUtc } from '../hooks/useTimerToMidnightUtc';
import { AwardIcon } from 'lucide-react';

export const ResultBanner = ({
    tries,
    album,
    nthPlayer,
}: {
    tries: number;
    album: DailyAlbum;
    nthPlayer: number | null;
}) => {
    const string = nthPlayer?.toString();
    const ordinal =
        string?.endsWith('1') && string !== '11'
            ? 'st'
            : string?.endsWith('2') && string !== '12'
              ? 'nd'
              : string?.endsWith('3') && string !== '13'
                ? 'rd'
                : 'th';

    const timeLeft = useTimerToMidnightUtc();
    return (
        <div
            className={`max-w-md w-full mx-auto rounded-xl border-2 p-4 flex flex-col items-center gap-3 text-center shadow-[3px_3px_0_var(--sage-dark)] bg-sage/20 border-success`}
        >
            <span className="text-4xl"><AwardIcon size={46} stroke='#5d8f7a'/></span>
            <div>
                <p className="font-black font-heading text-lg text-navy">
                    You guessed in <span className="text-primary font-black">{tries}</span> tr
                    {tries !== 1 ? 'ies' : 'y'}!
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">The album was</p>
            </div>
            <div className="flex flex-col gap-1 items-start bg-sidebar-border border-2 border-border rounded-xl p-3 w-full max-w-sm">
                <div className='flex items-center gap-3'>
                    <img
                        src={album.album.cover_url}
                        alt={album.album.name}
                        className="size-16 rounded-lg border-2 border-border object-cover shrink-0"
                    />
                    <div className="text-left min-w-0">
                        <p className="font-black font-heading text-navy truncate">
                            {album.album.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {album.album.artists.map((artist) => artist.artist.name).join(', ')}
                        </p>
                        {album.album.year && (
                            <p className="text-xs text-muted-foreground">{album.album.year}</p>
                        )}
                    </div>
                </div>
                <a href={`https://rateyourmusic.com/release/album/${album.album.normalizedArtist}/${album.album.normalizedName.split(' ').join('-')}`} className="text-xs text-muted-foreground underline">
                    https://rateyourmusic.com/release/album/{album.album.normalizedArtist}/{album.album.normalizedName.split(' ').join('-')}
                </a>
            </div>
            <p className="font-black font-heading text-sm text-navy">
                You were the <span className="text-primary font-black">{nthPlayer + ordinal}</span>{' '}
                user to guess today's daily album
            </p>
            <p className="font-black font-heading text-lg text-navy">Next album in</p>
            <div>
                <time className="font-black font-heading text-3xl number text-navy">
                    {timeLeft}
                </time>
                <p className="text-sm text-muted-foreground">Midnight at UTC-0</p>
            </div>
        </div>
    );
};
