import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

interface IUseFriendsResponse {
    status: string;
    message: string;
    friends: Array<IFriends>;
}

interface IFriends {
    sentRequestsId: string;
    receivedRequestsId: string;
    stat: 'FRIEND' | 'PENDING' | 'DENIED' | 'CANCELLED_REQUEST';
    timesRequested: number;
    timesRejected: number;
    lastRequestedAt: Date;
    receivedRequests: {
        id: string;
        createdAt: Date;
        profile: {
            username: string;
            avatar_url: string;
        };
    };
}

const useFriends = (username: string | undefined) => {
    const {
        data: friends,
        isPending,
        error,
    } = useQuery({
        queryKey: ['friends', username],
        queryFn: () => axios.get<IUseFriendsResponse>(`/friend/${username}`).then(res => res.data.friends),
        enabled: !!username,
    });

    return { friends, isPending, error };
};

export default useFriends;
