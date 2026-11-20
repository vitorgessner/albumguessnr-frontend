import useProfile, { type IProfile } from '@/features/auth/hooks/useProfile';
import useUser from '@/features/auth/hooks/useUser';
import axios from '@/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';

interface IFriendStatus {
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
    profile: IProfile;
}

const useUserRelated = () => {
    const { data: profile, isLoading: isProfileLoading } = useProfile();

    return useRelations(profile, isProfileLoading);
};

const useUserRelatedContent = (username: string | null | undefined) => {
    const { data: friend, error, isPending, isLoading } = useQuery({
        queryKey: ['friend', username],
        queryFn: async () => {
            const response = await axios.get<IFriendsResponse>(`/friend/${username}/status`);
            return {
                friendStatus: response.data.friendStatus,
                profile: response.data.profile,
            }
        },
        enabled: !!username,
    });

    return { friend, error, isPending, isLoading };
};

const useRelations = (profile: IProfile | undefined, isProfileLoading: boolean) => {
    const { data: user, isLoading: isUserLoading } = useUser();
    const { friend, isLoading: isFriendLoading } = useUserRelatedContent(profile?.username);

    const isOwnProfile = user?.profile.username === profile?.username;

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

    const isFriend = friend?.friendStatus?.stat === 'FRIEND';

    const isRequested = friend?.friendStatus?.stat === 'PENDING' && friend.friendStatus?.receivedRequests.profile.username === user?.profile.username;

    const isPending = friend?.friendStatus?.stat === 'PENDING' &&  profile?.username === friend.friendStatus?.receivedRequests.profile.username

    const isDenied = friend.friendStatus?.stat === 'DENIED';

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
