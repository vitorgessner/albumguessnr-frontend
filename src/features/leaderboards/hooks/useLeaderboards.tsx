import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

interface LeaderboardsProps {
    friends?: boolean;
    period?: 'daily' | 'weekly' | 'monthly';
    category?: 'album' | 'artist' | 'genre' | 'year' | 'tracklist';
    accuracy?: boolean;
}

export interface Leaderboard {
    userId: string;
    username: string;
    avatar_url: string;
    totalScore: number;
    accuracy: number;
}

interface LeaderboardResponse {
    status: string;
    message: string;
    leaderboard: Leaderboard[];
}

const useLeaderboards = ({ friends, period, category, accuracy }: LeaderboardsProps) => {
  const buildUrl = (): string => {
    const url = ['/leaderboards'];
    if (friends) url.push('/friends');
    if (accuracy) url.push('/accuracy');
    if (category) url.push(`/category/${category.toLowerCase()}`);
    if (period) url.push(`/${period.toLowerCase()}`)

    console.log(url.join(''))
    return url.join('');
  }

    const { data, isPending, error } = useQuery<Leaderboard[]>({
        queryKey: ['leaderboards', friends, period, category, accuracy],
        queryFn: async () =>
            axios.get<LeaderboardResponse>(buildUrl()).then(res => res.data.leaderboard),
    });

    return { data, isPending, error };
};

export default useLeaderboards;
