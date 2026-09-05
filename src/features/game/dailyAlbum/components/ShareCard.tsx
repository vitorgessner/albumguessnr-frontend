import { ClipboardCopyIcon } from 'lucide-react';
import type { CellShareStatus } from '../types/CellStatus';
import type { GuessRow } from '../types/GuessRow';
import { useState } from 'react';

const statusBg: Record<CellShareStatus, string> = {
    correct: '🟩',
    partial: '🟨',
    wrong: '🟥',
    up: '⬆️',
    down: '⬇️',
};

const tryEmojis: Record<number, string> = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
};

const Row = ({ guessRow }: { guessRow: GuessRow }) => {
    return (
        <div>
            <span>{statusBg[guessRow.year.direction || guessRow.year.status]}</span>
            <span>{statusBg[guessRow.rymRating.direction || guessRow.rymRating.status]}</span>
            <span>{statusBg[guessRow.rymRanking.direction || guessRow.rymRanking.status]}</span>
            <span>{statusBg[guessRow.artists.status]}</span>
            <span>{statusBg[guessRow.genres.status]}</span>
            <span>{statusBg[guessRow.descriptors.status]}</span>
        </div>
    );
};

export const ShareCard = ({
    dailyAlbumNumber,
    guessRows,
}: {
    dailyAlbumNumber: number;
    guessRows: GuessRow[];
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const aditionalTries = guessRows.length - 5 > 0 ? guessRows.length - 5 : null;

    const onCopy = () => {
        let string = '';
        guessRows.map((row, i) => {
            if (i < 5) {
                string += statusBg[row.year.direction || row.year.status];
                string += statusBg[row.rymRating.direction || row.rymRating.status];
                string += statusBg[row.rymRanking.direction || row.rymRanking.status];
                string += statusBg[row.artists.status];
                string += statusBg[row.genres.status];
                string += statusBg[row.descriptors.status] + '\n';
            }
        });

        if (aditionalTries) {
            string += `➕${tryEmojis[aditionalTries]}`;
        }
        navigator.clipboard.writeText(
            `I guessed the #${dailyAlbumNumber} daily album in #AlbumGuessnr in ${guessRows.length} tries\n${string}\nhttps://albumguessnr.com/dailyAlbum`
        );
        setIsCopied(true);
    };

    return (
        <div
            className={`max-w-md w-full h-[452.75px] mx-auto rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-3 text-center shadow-[3px_3px_0_var(--amber-dark)] bg-amber/20 border-amber`}
        >
            <div>
                <p className="font-black font-heading text-lg text-navy">
                    Go on, share your accomplishment!
                </p>
                <p className="font-bold font-heading text-lg text-navy max-w-sm">
                    I guessed the <span className="text-sage-dark">#{dailyAlbumNumber}</span> daily
                    album in <span className="text-sage-dark">#AlbumGuessnr</span> in{' '}
                    <span className="text-sage-dark">{guessRows.length} tr{guessRows.length === 1 ? 'y' : 'ies'}</span>
                </p>
            </div>
            <div className="flex items-center gap-3 bg-sidebar-border border-2 border-border rounded-xl p-3 pb-2 w-fit max-w-xs">
                <div className="text-left min-w-0 w-full">
                    <div className="font-black font-heading w-full text-center text-navy truncate">
                        {guessRows.map((row, i) => i < 5 && <Row guessRow={row} key={i} />)}
                    </div>
                    {aditionalTries && (
                        <p className="text-md text-center text-muted-foreground">
                            ➕{tryEmojis[aditionalTries]}
                        </p>
                    )}
                </div>
            </div>
            <a
                href="https://albumguessnr.com/dailyAlbum"
                target="_blank"
                className="font-heading text-navy font-black underline"
            >
                https://albumguessnr.com/dailyAlbum
            </a>
            <button
                className={`flex gap-1 items-center primary-component hover:shadow-none transition hover:translate-x-0.5 hover:translate-y-0.5 p-1 px-2 rounded-sm text-white ${!isCopied && 'mb-7'}`}
                onClick={onCopy}
            >
                <ClipboardCopyIcon /> Copy
            </button>
            {isCopied && <p className="text-xs text-muted-foreground">Copied to the clipboard!</p>}
        </div>
    );
};
