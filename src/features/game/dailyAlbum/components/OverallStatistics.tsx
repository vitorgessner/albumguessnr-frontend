import useUser from '@/features/auth/hooks/useUser';
import { useUserOverallStatistics } from '../hooks/useUserOverallStatistics';
import { BarChart2, ChevronRight, Flame, Target, Trophy } from 'lucide-react';
import { Link } from 'react-router';

function StatItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex flex-col items-center gap-1 bg-secondary/40 border border-border rounded-lg py-3 px-2">
            <div className="text-terra">{icon}</div>
            <span className="text-base font-black number text-navy">{value}</span>
            <span className="text-[10px] text-muted-foreground leading-tight text-center">
                {label}
            </span>
        </div>
    );
}

export const OverallStatistics = () => {
    const { data: user } = useUser();
    const { userDailyAlbumOverallStatistics, isPending } = useUserOverallStatistics(
        user?.id
    );

    if (isPending) {
        return (
            <div className="flex items-center justify-center">
                <div>Loading stats...</div>
            </div>
        );
    }

    const shouldShowMessageToRegister = !user || user.isGuest && (userDailyAlbumOverallStatistics?.maxStreak ?? 0) > 1;
    
    return (
        <>
            {userDailyAlbumOverallStatistics && (
                <div>
                    <h3 className="font-heading font-black text-2xl text-center pb-3 text-navy tracking-tight">Your statistics</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        <StatItem
                            icon={<Target size={14} />}
                            label="Guessed"
                            value={userDailyAlbumOverallStatistics.totalGuessed}
                        />
                        <StatItem
                            icon={<Trophy size={14} />}
                            label="Guessed right"
                            value={userDailyAlbumOverallStatistics.correctlyGuessed}
                        />
                        <StatItem
                            icon={<BarChart2 size={14} />}
                            label="Mean"
                            value={userDailyAlbumOverallStatistics.meanToGuess?.toFixed(1) ?? '—'}
                        />
                        <StatItem
                            icon={<ChevronRight size={14} />}
                            label="First try"
                            value={userDailyAlbumOverallStatistics.numberOfFirstGuesses}
                        />
                        <StatItem
                            icon={<Flame size={14} />}
                            label="Streak"
                            value={userDailyAlbumOverallStatistics.currentStreak}
                        />
                        <StatItem
                            icon={<Flame size={14} />}
                            label="Max streak"
                            value={userDailyAlbumOverallStatistics.maxStreak}
                        />
                    </div>
                    {shouldShowMessageToRegister && <p className='font-heading font-bold text-navy text-center text-sm'>Don't wanna lose all this data? <Link to={'/auth/register'} className='text-primary'>Create an account</Link></p>}
                </div>
            )}
        </>
    );
};
