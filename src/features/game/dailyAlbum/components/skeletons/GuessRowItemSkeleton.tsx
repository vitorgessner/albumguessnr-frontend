import { COL_WIDTHS } from "../../utils/colWidths";

function Cell({width}: {width: string}) {
    return (
        <div
            className={`${width} h-[70px] bg-border shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 px-2 py-2 min-h-[56px] text-center transition-all`}
        >
            <span className="text-xs font-bold leading-tight number line-clamp-3 break-words hover:line-clamp-6"></span>
        </div>
    );
}

export const GuessRowItemSkeleton = () => {
    return (
        <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 animate-pulse">
            <div className="number font-heading text-navy font-black"></div>
            <div className="shrink-0 w-14 h-14 rounded-lg border-2 border-border overflow-hidden bg-border">
                <div></div>
            </div>

            <div className="flex gap-2">
                <div
                    className={`${COL_WIDTHS.album} bg-border not-first-of-type:not-only:shrink-0 flex flex-col items-center justify-center min-h-[56px] rounded-lg border-2 border-border px-2 py-2 text-center`}
                >
                    <span className="text-xs font-bold text-navy leading-tight line-clamp-3 break-words w-full"></span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 w-full"></span>
                </div>

                <Cell width={COL_WIDTHS.numeric}></Cell>
                <Cell width={COL_WIDTHS.numeric}></Cell>
                <Cell width={COL_WIDTHS.numeric}></Cell>
                <Cell width={COL_WIDTHS.artist}></Cell>
                <Cell width={COL_WIDTHS.genre}></Cell>
                <Cell width={COL_WIDTHS.text}></Cell>
            </div>
        </div>
    );
};
