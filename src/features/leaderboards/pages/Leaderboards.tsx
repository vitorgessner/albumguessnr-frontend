import { useState } from 'react';
import { PERIODS, type Period } from '../constants/periods';
import { CATEGORIES, type Category } from '../constants/categories';
import LeaderboardContent from '../components/LeaderboardContent';
import { MODE, type Mode } from '../constants/mode';

type Tab = 'global' | 'friends';

const Leaderboards = () => {
    const [activeTab, setActiveTab] = useState<Tab>('global');
    const [activePeriod, setActivePeriod] = useState<Period>(undefined);
    const [activeCategory, setActiveCategory] = useState<Category>(undefined);
    const [activeMode, setActiveMode] = useState<Mode>(undefined);

    return (
        <div className="min-h-dvh bg-background">
            <div className="max-w-lg mx-auto px-4 pb-10">
                <div className="pt-6 pb-4">
                    <h1 className="font-heading font-black text-2xl text-navy tracking-tight">
                        Leaderboards
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">See who's on top</p>
                </div>

                <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border mb-4">
                    {(['global', 'friends'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-150 ${
                                activeTab === tab
                                    ? 'bg-sidebar-border text-navy shadow-[2px_2px_0_var(--border)] border border-border'
                                    : 'text-muted-foreground hover:text-navy'
                            }`}
                        >
                            {tab === 'global' ? '🌍 Global' : '👥 Friends'}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                    {PERIODS.map((p) => (
                        <button
                            key={String(p.value)}
                            onClick={() => setActivePeriod(p.value)}
                            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 ${
                                activePeriod === p.value
                                    ? 'bg-primary border-terra-dark text-white shadow-[2px_2px_0_var(--terra-dark)]'
                                    : 'bg-card border-border text-muted-foreground hover:border-terra/50 hover:text-navy'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((c) => (
                        <button
                            key={String(c.value)}
                            onClick={() => setActiveCategory(c.value)}
                            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 ${
                                activeCategory === c.value
                                    ? 'bg-secondary border-amber-dark text-navy shadow-[2px_2px_0_var(--amber-dark)]'
                                    : 'bg-card border-border text-muted-foreground hover:border-amber/50 hover:text-navy'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-none">
                    {MODE.map((m) => (
                        <button
                            key={String(m.value)}
                            onClick={() => setActiveMode(m.value)}
                            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 ${
                                activeMode === m.value
                                    ? 'bg-sage border-sage-dark text-white shadow-[2px_2px_0_var(--sage-dark)]'
                                    : 'bg-card border-border text-muted-foreground hover:border-amber/50 hover:text-navy'
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <LeaderboardContent
                    friends={activeTab === 'friends'}
                    period={activePeriod}
                    category={activeCategory}
                    accuracy={activeMode === 'accuracy'}
                />
            </div>
        </div>
    );
};

export default Leaderboards;
