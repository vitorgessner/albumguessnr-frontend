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
        totalScore: number;
        profile: {
            username: string;
            avatar_url: string;
        };
    };
}

interface IUseFriendsAlbumsResponse {
    status: string;
    message: string;
    friends: Array<IFriendsAlbums>
}

interface IFriendsAlbums {
    id: string;
    profile: {
        avatar_url: string;
        username: string
    },
    bestScore: number;
}

const useFriends = (username: string | undefined) => {
    const {
        data: related,
        isPending,
        error,
    } = useQuery({
        queryKey: ['friends', username],
        queryFn: () => axios.get<IUseFriendsResponse>(`/friend/${username}`).then(res => res.data.friends),
        enabled: !!username,
    });

    const friends = related?.filter(r => r.stat === 'FRIEND');

    return { friends, isPending, error };
};

export const useFriendsAlbums = (albumId: string | undefined) => {
    const {
        data: friendsGuessed,
        isPending,
        error,
    } = useQuery({
        queryKey: ['friends', albumId],
        queryFn: () => axios.get<IUseFriendsAlbumsResponse>(`/friend/album/${albumId}`).then(res => res.data.friends),
        enabled: !!albumId,
    });

    return { friendsGuessed, isPending, error };
}

export default useFriends;
