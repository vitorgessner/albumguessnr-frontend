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
    const { data: profile, isLoading: isProfileLoading } = useProfile();

    return useRelations(profile, isProfileLoading);
};

const useUserRelatedContent = (username: string | null | undefined) => {
    const { data: friend, error, isPending, isLoading } = useQuery<IFriendStatus>({
        queryKey: ['friend', username],
        queryFn: () =>
            axios
                .get<IFriendsResponse>(`/friend/${username}/status`)
                .then((res) => res.data.friendStatus),
        enabled: !!username,
    });

    return { friend, error, isPending, isLoading };
};

const useRelations = (profile: IProfile | undefined, isProfileLoading: boolean) => {
    const { data: user, isLoading: isUserLoading } = useUser();
    const { friend, isLoading: isFriendLoading } = useUserRelatedContent(profile?.username);

    const isOwnProfile = user?.id === profile?.user.id;

    const isLoading = isProfileLoading || isUserLoading || isFriendLoading

    if (isLoading || !friend)
        return {
            isOwnProfile,
            isFriend: false,
            isPending: false,
            isRequested: false,
            isDenied: false,
            isNotRelated: !isLoading,
            isLoading: Boolean(isLoading)
        };

    const isFriend = friend?.stat === 'FRIEND';

    const isPending = friend?.stat === 'PENDING' && friend.sentRequestsId === user?.id;

    const isRequested = friend?.stat === 'PENDING' && friend.sentRequestsId === profile?.user.id;

    const isDenied = friend.stat === 'DENIED';

    return {
        isOwnProfile,
        isFriend,
        isPending,
        isRequested,
        isDenied,
        isNotRelated: false,
        isLoading
    };
};

export default useUserRelated;
