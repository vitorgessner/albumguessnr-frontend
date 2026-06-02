import useUser from '@/features/auth/hooks/useUser';
import type { Category } from '../constants/categories';
import type { Period } from '../constants/periods';
import useLeaderboards from '../hooks/useLeaderboards';
import EmptyFriends from './EmptyFriends';
import PodiumCard from './PodiumCard';
import RankRow from './RankRow';
import SkeletonRow from './SkeletonRow';
import { MONTHS } from '../constants/months';
import { getEndOfWeek, getStartOfWeek } from '../utils/dateUtils';

const LeaderboardContent = ({
    friends,
    period,
    category,
    accuracy
}: {
    friends: boolean;
    period: Period;
    category: Category;
    accuracy: boolean;
}) => {
    const { data, isPending, error } = useLeaderboards({ friends, period, category, accuracy });
    const { data: loggedUser } = useUser();

    console.log(category, period, data);

    if (isPending) {
        return (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
                <span className="text-4xl">⚠️</span>
                <p className="font-heading font-bold text-terra-dark">Error loading ranking</p>
                <p className="text-sm text-muted-foreground">Try again later.</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        if (friends) return <EmptyFriends />;
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <span className="text-4xl">🎵</span>
                <p className="text-sm text-muted-foreground">No data available.</p>
            </div>
        );
    }

    const top3 = data.slice(0, 3);
    const rest = data.slice(3);
    const unique = top3.length === 1;

    return (
        <div className="flex flex-col gap-4">
            <h2 className='text-2xl w-fit px-5 py-0.5 mx-auto text-center text-navy tracking-wide font-black font-heading bg-sidebar-border rounded-md border-border border shadow-[2px_2px_0_var(--border)]'>
                {!period && 'All time'}
                {period === 'daily' && new Date().toLocaleDateString().slice(0, -5)}
                {period === 'monthly' && MONTHS[new Date().getMonth()]}
                {period === 'weekly' && getStartOfWeek().toLocaleDateString().slice(0, -5) + ' - ' + getEndOfWeek().toLocaleDateString().slice(0, -5)}
            </h2>

            {top3.length > 0 && (
                <div className="px-2 pt-4">
                    <div className={`${!unique ? 'grid grid-cols-3 gap-1 items-end' : 'flex justify-center'}`}>
                        {top3.map((user, i) => (
                            <PodiumCard key={user.userId} user={user} idx={i} unique={unique}/>
                        ))}
                    </div>
                </div>
            )}

            {rest.length > 0 && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    {rest.map((user, i) => (
                        <RankRow key={user.userId} user={user} idx={i + 3} isMe={loggedUser?.id === user.userId}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaderboardContent;
