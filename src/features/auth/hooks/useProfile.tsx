import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

interface IQueryResponse {
    status: string;
    message: string;
    user: {
        username: string;
        bio: string;
        avatar_url: string;
        user: {
            lastfmIntegration: {
                lastfmUsername: string;
            };
            createdAt: Date;
        };
    };
}

const useProfile = () => {
    const { username } = useParams();

    const { data, isPending, error, isSuccess } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => axios.get<IQueryResponse>(`/profile/${username}`).then((res) => res.data),
        enabled: !!username,
    });

    return { data: data ?? null, isPending, error, isSuccess };
};

export default useProfile;
