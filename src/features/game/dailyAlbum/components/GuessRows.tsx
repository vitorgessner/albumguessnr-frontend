import { useRef } from 'react';
import type { GuessRow } from '../types/GuessRow';
import { GuessRowItem } from './GuessRowItem';
import { COL_WIDTHS } from '../utils/colWidths';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

function ColHeader({ children, width }: { children: React.ReactNode; width: string }) {
    return (
        <div
            className={`${width} shrink-0 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1`}
        >
            {children}
            <hr />
        </div>
    );
}

export const GuessRows = ({ guessRows }: { guessRows: GuessRow[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (guessRows.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <div ref={scrollRef} className="overflow-x-auto scrollbar-none pb-1">
                <div className="flex flex-col gap-2" style={{ minWidth: 'max-content' }}>
                    <div className="flex justify-center items-center gap-2 pl-[92px] lg:pl-[101px]">
                        <ColHeader width={COL_WIDTHS.album}>Album</ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>Year</ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>
                            <div className="flex gap-1">
                                Rating
                                <HoverCard openDelay={0} closeDelay={0}>
                                    <HoverCardTrigger>
                                        <Info width={16} fill="lightGray" stroke="black" />
                                    </HoverCardTrigger>
                                    <HoverCardContent side="top" className="w-fit bg-white ml-60">
                                        Based on RateYourMusic (2022)
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </ColHeader>
                        <ColHeader width={COL_WIDTHS.numeric}>
                            <div className="flex gap-1">
                                Ranking
                                <HoverCard openDelay={0} closeDelay={0}>
                                    <HoverCardTrigger>
                                        <Info width={16} fill="lightGray" stroke="black" />
                                    </HoverCardTrigger>
                                    <HoverCardContent side="top" className="w-fit bg-white ml-60">
                                        <p>Based on RateYourMusic's popularity ranking (2022)</p>
                                        <p>Higher or lower <span className='text-primary'>number</span> NOT ranking</p>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </ColHeader>
                        <ColHeader width={COL_WIDTHS.artist}>Artists</ColHeader>
                        <ColHeader width={COL_WIDTHS.genre}>Genres</ColHeader>
                        <ColHeader width={COL_WIDTHS.text}>Descriptors</ColHeader>
                    </div>

                    {guessRows.map((row, i) => (
                        <GuessRowItem
                            key={row.album.id + i}
                            row={row}
                            index={i}
                            totalRows={guessRows.length}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
