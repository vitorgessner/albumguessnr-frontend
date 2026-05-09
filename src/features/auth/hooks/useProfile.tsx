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
    bio: string;
    avatar_url: string;
    user: {
        lastfmIntegration: {
            lastfmUsername: string;
        };
        createdAt: Date;
        id: string;
    };
};

const useProfile = () => {
    const { username } = useParams();

    const { data, isPending, error, isSuccess } = useQuery<IProfile>({
        queryKey: ['profile', username],
        queryFn: () => axios.get<IProfileResponse>(`/profile/${username}`).then((res) => res.data.profile),
        enabled: !!username,
    });

    return { data, isPending, error, isSuccess };
};

export default useProfile;
