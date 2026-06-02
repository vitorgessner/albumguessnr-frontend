import useProfile from '@/features/auth/hooks/useProfile';
import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

interface Stats {
    guessedAlbums: number;
    guessedArtists: number;
    guessedDistinctAlbums: number;
    guessedGenres: number;
    guessedTracks: number;
    guessedYears: number;
    rightGuessedAlbums: number;
    rightGuessedArtist: number;
    rightGuessedGenres: number;
    rightGuessedTracks: number;
    rightGuessedYears: number;
}

const useStats = () => {
    const { data: profile } = useProfile();

    const { data, isPending, error } = useQuery<Stats>({
        queryKey: ['stats', profile?.username],
        queryFn: async () =>
            await axios
                .get<{
                    status: string;
                    message: string;
                    stats: Stats;
                }>(`/stats/${profile?.username}`)
                .then((res) => res.data.stats),
    });

    console.log(data);

    return { data, isPending, error };
};

export default useStats;
