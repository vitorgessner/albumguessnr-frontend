import type { Leaderboard } from '../hooks/useLeaderboards';
import formatScore from '../utils/formatScore';
import Avatar from './Avatar';

const RankRow = ({
    user,
    idx,
    isMe,
}: {
    user: Leaderboard;
    idx: number;
    isMe?: boolean;
}) => {
    const rank = idx + 1;
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${
                isMe ? 'bg-secondary/40' : 'hover:bg-card'
            }`}
        >
            <span className="w-5 text-center text-sm font-bold text-muted-foreground number shrink-0">
                {rank}
            </span>
            <Avatar user={user} idx={idx} size="sm" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy truncate">
                    {user.username}
                    {isMe && (
                        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-terra bg-terra/10 px-1.5 py-0.5 rounded-sm">
                            you
                        </span>
                    )}
                </p>
            </div>
            <span className="text-sm font-bold text-terra-dark number shrink-0">
                {formatScore(user.totalScore)}
            </span>
        </div>
    );
};

export default RankRow;
