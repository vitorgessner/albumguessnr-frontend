import { COL_WIDTHS } from '../../utils/colWidths';
import { GuessRowItemSkeleton } from './GuessRowItemSkeleton';

function ColHeader({ children, width }: { children: React.ReactNode; width: string }) {
    return (
        <div className={`${width} shrink-0 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1`}>
            {children}
            <hr />
        </div>
    );
}

export const GuessRowsSkeleton = ({ guessRows }: { guessRows: number }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="overflow-x-auto scrollbar-none pb-1">
                <div className="flex flex-col gap-2" style={{ minWidth: 'max-content' }}>

                    <div className="flex justify-center items-center gap-2 pl-[92px] lg:pl-[80px]">
                        <ColHeader width={COL_WIDTHS.album}>Album</ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>Year</ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>Rating</ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>Ranking</ColHeader>
                        <ColHeader width={COL_WIDTHS.artist}>Artists</ColHeader>
                        <ColHeader width={COL_WIDTHS.genre}>Genres</ColHeader>
                        <ColHeader width={COL_WIDTHS.text}>Descriptors</ColHeader>
                    </div>

                    {Array.from({ length: guessRows }).map(() => (
                        <GuessRowItemSkeleton />
                    ))}

                </div>
            </div>
        </div>
    );
};
