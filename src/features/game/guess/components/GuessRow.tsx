import type { RecentPlayers } from '../types/playersTypes';
import Avatar from '@/features/leaderboards/components/Avatar';
import { Link } from 'react-router';
import formatScore from '@/features/leaderboards/utils/formatScore';

export const GuessRow = ({
    player,
    idx,
    isMe,
}: {
    player: RecentPlayers;
    idx: number;
    isMe?: boolean;
}) => {
    const rank = idx + 1;
    const date = new Date(player.date);
    const score = Number(formatScore(player.totalScore));
    return (
        <div
            className={`flex items-center justify-between px-4 py-3 border-b border-border last:border-0 transition-colors ${
                isMe ? 'bg-secondary/40' : 'hover:bg-card'
            }`}
        >
            <div className='flex gap-3 items-center'>
                <span className="w-5 text-center text-base font-bold text-muted-foreground number shrink-0">
                    {rank}
                </span>
                <Link to={`/profile/${player.user.profile.username}`}>
                    <Avatar user={player.user.profile} idx={idx} size="md" />
                </Link>
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-navy truncate">
                        {player.user.profile.username}
                        {isMe && (
                            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-terra bg-terra/10 px-1.5 py-0.5 rounded-sm">
                                you
                            </span>
                        )}
                    </p>
                </div>
            </div>
            <div className='flex gap-5 items-center'>
                <span className="text-base font-bold text-sage-dark number shrink-0">
                    {score < 10 ? 0 + score : score}
                </span>
                <span className="text-base font-bold text-navy number shrink-0">
                    {date.toLocaleDateString().substring(0, 5) +
                        ' - ' +
                        date.toLocaleTimeString().substring(0, 5)}
                </span>
            </div>
        </div>
    );
};
