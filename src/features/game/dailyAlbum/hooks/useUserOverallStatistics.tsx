import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

export interface UserDailyAlbumOverallStatistics {
    userId: string;
    totalGuessed: number;
    correctlyGuessed: number;
    meanToGuess: number;
    numberOfFirstGuesses: number;
    currentStreak: number;
    maxStreak: number;
}

export const useUserOverallStatistics = (userId: string | undefined) => {
    const { data: userDailyAlbumOverallStatistics, isPending, error } = useQuery<UserDailyAlbumOverallStatistics>({
        queryKey: ['overall', userId],
        queryFn: async () => {
            const response = await axios.get(`/daily/album/overall/statistics`);
            return await response.data.statistics
        },
    });

    return { userDailyAlbumOverallStatistics, isPending, error };
};
