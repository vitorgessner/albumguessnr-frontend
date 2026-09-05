import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CellStatus } from '../types/CellStatus';
import type { Direction } from '../types/Direction';
import type { GuessRow } from '../types/GuessRow';
import { COL_WIDTHS } from '../utils/colWidths';

const statusBg: Record<CellStatus, string> = {
    correct: 'bg-sage/20 border-success text-sage-dark',
    partial: 'bg-secondary/60 border-amber-dark text-amber-dark',
    wrong: 'bg-terra/10 border-error text-terra-dark',
};

function Cell({
    status,
    direction,
    width,
    children,
}: {
    status: CellStatus;
    direction?: Direction;
    width: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${width} relative shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 px-2 py-2 min-h-[56px] text-center transition-all ${statusBg[status]}`}
        >
            <span
                className="text-xs font-bold leading-tight number line-clamp-3 break-words hover:line-clamp-6"
                title={children?.toString()}
            >
                {children}
            </span>
            {direction && (
                <span className="text-[10px] shrink-0">
                    {direction === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                </span>
            )}
        </div>
    );
}

export const GuessRowItem = ({
    row,
    index,
    totalRows,
}: {
    row: GuessRow;
    index: number;
    totalRows: number;
}) => {
    const { album } = row;
    return (
        <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="number font-heading text-navy font-black">
                #{totalRows - 1 - index + 1}
            </div>
            <div className="shrink-0 w-14 h-14 rounded-lg border-2 border-border overflow-hidden bg-muted">
                <img
                    src={album.cover_url}
                    alt={album.normalizedName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex gap-2">
                <div
                    className={`${COL_WIDTHS.album} shrink-0 flex flex-col items-center justify-center min-h-[56px] rounded-lg border-2 border-border bg-sidebar-border px-2 py-2 text-center`}
                >
                    <span className="text-xs font-bold text-navy leading-tight line-clamp-3 break-words w-full">
                        {album.normalizedName}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 w-full">
                        {album.normalizedArtist}
                    </span>
                </div>

                <Cell
                    status={row.year.status}
                    direction={row.year.direction}
                    width={COL_WIDTHS.numeric}
                >
                    {album.year ?? '—'}
                </Cell>

                <Cell
                    status={row.rymRating.status}
                    direction={row.rymRating.direction}
                    width={COL_WIDTHS.numeric}
                >
                    {album.rymRating != null ? Number(album.rymRating).toFixed(2) : '—'}
                </Cell>

                <Cell
                    status={row.rymRanking.status}
                    direction={row.rymRanking.direction}
                    width={COL_WIDTHS.numeric}
                >
                    {album.rymRanking != null ? `#${album.rymRanking}` : '—'}
                </Cell>

                <Cell status={row.artists.status} width={COL_WIDTHS.artist}>
                    {album.artists
                        .filter((_, i) => i < 3)
                        .map((a) => a.artist.normalizedName)
                        .join(', ') || '—'}
                </Cell>

                <Cell status={row.genres.status} width={COL_WIDTHS.genre}>
                    {album.genres
                        .filter((_, i) => i < 3)
                        .map((g) => g.genre.name)
                        .join(', ') || '—'}
                </Cell>

                <Cell status={row.descriptors.status} width={COL_WIDTHS.text}>
                    {album.descriptors.filter((_, i) => i < 3).join(', ') || '—'}
                </Cell>
            </div>
        </div>
    );
};
