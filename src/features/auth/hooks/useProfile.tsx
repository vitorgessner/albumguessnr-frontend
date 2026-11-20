import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

interface IProfileResponse {
    status: string;
    message: string;
    profile: IProfile;
}

export interface IProfile {
    username: string;
    displayUsername: string;
    bio: string;
    avatar_url: string;
    user: {
        userStats: {
            totalScore: number,
            guessedAlbums: number,
            guessedDistinctAlbums: number,
            rightGuessedAlbums: number,
            guessedArtists: number,
            rightGuessedArtist: number,
            guessedGenres: number,
            rightGuessedGenres: number,
            guessedYears: number,
            rightGuessedYears: number,
            guessedTracks: number,
            rightGuessedTracks: number
        }
        createdAt: Date;
    };
};

const useProfile = () => {
    const { username } = useParams();

    const { data, isPending, error, isSuccess, isLoading } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => axios.get<IProfileResponse>(`/profile/${username}`).then((res) => res.data.profile),
        enabled: !!username,
    });

    return { data, isPending, error, isSuccess, isLoading };
};

export default useProfile;
