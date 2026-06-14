import { Link } from 'react-router';
import { MEDAL_COLORS } from '../constants/medal_colors';
import type { Leaderboard } from '../hooks/useLeaderboards';
import formatScore from '../utils/formatScore';
import Avatar from './Avatar';

const PodiumCard = ({
    user,
    idx,
    unique,
}: {
    user: Leaderboard;
    idx: number;
    unique?: boolean;
}) => {
    const rank = idx + 1;
    const medal = MEDAL_COLORS[rank - 1];
    const isFirst = idx === 0;

    return (
        <div
            className={`flex flex-col items-center gap-1.5 ${unique && 'max-w-35 grow'} ${isFirst ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}
        >
            <span className="text-2xl">{medal.medal}</span>
            <div className={`relative ${isFirst ? 'scale-120' : ''} transition-transform`}>
                <Link to={`/profile/${user.username}`}>
                    <Avatar user={user} idx={idx} size={isFirst ? 'lg' : 'md'} />
                </Link>
            </div>
            <span className="text-base font-bold text-navy truncate max-w-18 text-center leading-tight">
                {user.displayUsername}
            </span>
            <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${medal.bg} ${medal.text} ${medal.shadow} number`}
            >
                {formatScore(user.totalScore ?? user.accuracy)} {user.accuracy && '%'}
            </span>
            <div
                className={`w-full rounded-t-lg border-t-2 border-x-2 border-border bg-card ${
                    isFirst ? 'h-12' : rank === 2 ? 'h-8' : 'h-5'
                }`}
            />
        </div>
    );
};

export default PodiumCard;
