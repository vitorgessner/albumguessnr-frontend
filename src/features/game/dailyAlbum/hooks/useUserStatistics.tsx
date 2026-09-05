import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

type UserDailyAlbumStatus = 'FINISHED' | 'UNFINISHED'

export interface UserDailyAlbumStatistics {
    userId: string;
    id: string;
    dailyAlbumId: string;
    status: UserDailyAlbumStatus;
    nthPlayerToGuess: number | null;
    userTries: {
        id: string;
        nthTry: number;
        userDailyAlbumId: string;
        albumGuessId: string;
        timestamp: Date;
    }[];
}

export const useUserStatistics = (userId: string | undefined, albumId: string) => {
    const { data, isPending, error } = useQuery<{ userDailyAlbumStatistics: UserDailyAlbumStatistics, totalGuesses: number }>({
        queryKey: ['daily', userId],
        queryFn: async () => {
            const response = await axios.get(`/daily/album/statistics?albumId=${albumId}`);
            return response.data
        },
    });

    return { userDailyAlbumStatistics: data?.userDailyAlbumStatistics, totalGuesses: data?.totalGuesses, isPending, error };
};
