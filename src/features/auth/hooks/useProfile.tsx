import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

interface IProfileResponse {
    status: string;
    message: string;
    profile: IProfile;
}

export interface IProfile {
    id: string;
    username: string;
    displayUsername: string;
    bio: string;
    avatar_url: string;
    user: {
        userStats: {
            id: string,
            userId: string,
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
        lastfmIntegration: {
            lastfmUsername: string;
            lastfmDisplayUsername: string;
        };
        createdAt: Date;
        id: string;
        totalScore: number;
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
