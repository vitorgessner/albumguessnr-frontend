import { Eye, EyeOff } from 'lucide-react';
import type { DailyAlbum } from '../types/DailyAlbum';
import { useState } from 'react';

export const LastfmHints = ({dailyAlbum}: {dailyAlbum: DailyAlbum}) => {
    const [showHints, setShowHints] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={() => setShowHints((v) => !v)}
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-navy transition-colors w-fit mx-auto"
            >
                {showHints ? <EyeOff size={14} /> : <Eye size={14} />}
                {showHints ? 'hide Last.Fm tips' : 'show Last.Fm tips'}
            </button>
            {showHints && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
                    <div className="flex flex-col items-center gap-0.5 bg-secondary/40 border border-border rounded-lg py-2 px-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Last.fm Listeners
                        </span>
                        <span className="text-sm font-black number text-navy">
                            {dailyAlbum.lastfmListeners
                                ? parseInt(dailyAlbum.lastfmListeners).toLocaleString('pt-BR')
                                : '—'}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 bg-secondary/40 border border-border rounded-lg py-2 px-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Last.fm Playcount
                        </span>
                        <span className="text-sm font-black number text-navy">
                            {dailyAlbum.lastfmPlaycount
                                ? parseInt(dailyAlbum.lastfmPlaycount).toLocaleString('pt-BR')
                                : '—'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
