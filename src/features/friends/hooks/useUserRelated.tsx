import useProfile, { type IProfile } from '@/features/auth/hooks/useProfile';
import useUser from '@/features/auth/hooks/useUser';
import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

interface IFriendStatus {
    sentRequestsId: string;
    receivedRequestsId: string;
    stat: 'FRIEND' | 'PENDING' | 'DENIED';
    timesRequested: number;
    timesRejected: number;
    lastRequestedAt: Date;
    receivedRequests: {
        profile: {
            username: string;
        };
    };
    sentRequests: {
        profile: {
            username: string;
        };
    };
}

export interface IFriendsResponse {
    status: string;
    message: string;
    friendStatus: IFriendStatus;
}

const useUserRelated = () => {
    const { data: profile } = useProfile();

    return useRelations(profile);
};

const useUserRelatedContent = (username: string | null | undefined) => {
    const { data: friend, error } = useQuery<IFriendStatus>({
        queryKey: ['friend', username],
        queryFn: () =>
            axios
                .get<IFriendsResponse>(`/friend/${username}/status`)
                .then((res) => res.data.friendStatus),
        enabled: !!username,
    });

    return { friend, error };
};

const useRelations = (profile: IProfile | undefined) => {
    const { data: user } = useUser();
    const { friend } = useUserRelatedContent(profile?.username);

    const isOwnProfile = user?.id === profile?.user.id;

    if (!friend)
        return {
            isOwnProfile,
            isFriend: false,
            isPending: false,
            isRequested: false,
            isDenied: false,
            isNotRelated: true,
        };

    const isFriend = friend?.stat === 'FRIEND';

    const isPending = friend?.stat === 'PENDING' && friend.sentRequestsId === user?.id;

    const isRequested = friend?.stat === 'PENDING' && friend.sentRequestsId === profile?.user.id;

    const isDenied = friend.stat === 'DENIED';
    console.log(isOwnProfile, isPending, isRequested)
    console.log('user: ' + user?.id, 'profile: ' + profile?.user.id, 'sent: ' + friend.sentRequestsId, 'received: ' + friend.receivedRequestsId)

    return {
        isOwnProfile,
        isFriend,
        isPending,
        isRequested,
        isDenied,
        isNotRelated: false,
    };
};

export default useUserRelated;
