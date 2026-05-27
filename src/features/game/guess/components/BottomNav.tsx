import { Settings, Users, ListMusic } from 'lucide-react';
import type { Sheet } from '../pages/Guess';

const BottomNav = ({
    activeSheet,
    onToggle,
    hasTracklist,
}: {
    activeSheet: Sheet;
    onToggle: (sheet: Sheet) => void;
    hasTracklist: boolean;
}) => {
    const tabs = [
        { id: 'config' as Sheet, icon: Settings, label: 'Options' },
        { id: 'friends' as Sheet, icon: Users, label: 'Friends' },
        ...(hasTracklist ? [{ id: 'tracklist' as Sheet, icon: ListMusic, label: 'Tracklist' }] : []),
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t-2 border-border bg-(--card-light)"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            {tabs.map(({ id, icon: Icon, label }) => {
                const isActive = activeSheet === id;
                return (
                    <button
                        key={id}
                        onClick={() => onToggle(id)}
                        className={`flex flex-1 flex-col items-center gap-0.5 pt-2 transition-colors ${isActive ? 'text-(--sage)' : 'text-(--text-h) opacity-60'}`}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;