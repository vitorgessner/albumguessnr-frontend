import type { Leaderboard } from '../hooks/useLeaderboards';
import getAvatarColor from '../utils/getAvatarColor';
import getInitials from '../utils/getInitials';

const Avatar = ({
    user,
    idx,
    size = 'md',
}: {
    user: Leaderboard;
    idx: number;
    size?: 'sm' | 'md' | 'lg';
}) => {
    const sizeClass =
        size === 'lg'
            ? 'w-14 h-14 text-base'
            : size === 'md'
              ? 'w-14 h-14 text-sm'
              : 'w-8 h-8 text-xs';
    return (
        <div
            className={`${sizeClass} rounded-full border-2 flex items-center justify-center font-bold font-heading shrink-0 ${getAvatarColor(idx)}`}
        >
            {user.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt={getInitials(user.username)}
                    className="w-full h-full rounded-full object-cover"
                />
            ) : (
                getInitials(user.username)
            )}
        </div>
    );
};

export default Avatar;
