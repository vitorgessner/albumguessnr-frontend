import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUserRelated from '../hooks/useUserRelated';
import axios from '@/shared/utils/axios';
import useProfile from '@/features/auth/hooks/useProfile';
import type { ErrorResponse, FormResponse } from '@/features/auth/types/response';
import { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import useFriends from '../hooks/useFriends';

interface IFriendRequest {
    sentRequestsId: string;
    receivedRequestsId: string;
    stat: string;
    timesRequested: number;
    timesRejected: number;
    lastRequestedAt: Date;
}

interface IFriendRequestResponse {
    status: string;
    message: string;
    request: IFriendRequest | Array<IFriendRequest>;
}

const RequestButton = () => {
    const { isOwnProfile, isPending, isRequested, isFriend, isLoading } = useUserRelated();
    const { data: profile } = useProfile();
    const { isPending: statePending } = useFriends(profile?.username);

    const queryClient = useQueryClient();

    const { mutate: request } = useMutation<IFriendRequestResponse, ErrorResponse, void>({
        mutationFn: () => axios.post(`/friend/${profile?.user.id}`).then((res) => res.data),
        onSuccess: () => {
            console.log(profile?.username);
            return queryClient.invalidateQueries({ queryKey: ['friend', profile?.username] });
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
                toast.error(err.response.data.message);
            }
        },
    });

    const { mutate: unfriend } = useMutation<FormResponse, ErrorResponse, void>({
        mutationFn: () => axios.delete(`/friend/${profile?.user.id}`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friend', profile?.username] });
            queryClient.invalidateQueries({ queryKey: ['friends', profile?.username] });
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    const { mutate: accept } = useMutation<FormResponse, ErrorResponse, void>({
        mutationFn: () => axios.post(`/friend/accept/${profile?.user.id}`).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friend', profile?.username] });
            queryClient.invalidateQueries({ queryKey: ['friends', profile?.username] });
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    const { mutate: dismiss } = useMutation<FormResponse, ErrorResponse, void>({
        mutationFn: () => axios.post(`/friend/deny/${profile?.user.id}`).then((res) => res.data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend', profile?.username] }),
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    const { mutate: cancel } = useMutation<FormResponse, ErrorResponse, void>({
        mutationFn: () => axios.patch(`/friend/${profile?.user.id}`).then((res) => res.data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend', profile?.username] }),
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    const showSkeleton = statePending || isLoading || !profile;

    return (
        <>
            {!isOwnProfile &&
                (showSkeleton ? (
                    <div> 
                        <Skeleton height={48}  borderRadius={8} />
                    </div>
                ) : (
                    <>
                        {!isPending && !isRequested && !isFriend && (
                            <button className="addFriendButton" onClick={() => request()}>
                                Friend Request
                            </button>
                        )}

                        {isFriend && (
                            <button className="removeFriendButton" onClick={() => unfriend()}>
                                Unfriend
                            </button>
                        )}

                        {isRequested && !isFriend && (
                            <div className="flex gap-4">
                                <button
                                    className="addFriendButton w-fit px-3"
                                    onClick={() => accept()}
                                >
                                    Accept request
                                </button>

                                <button
                                    className="removeFriendButton w-fit px-3 grow"
                                    onClick={() => dismiss()}
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {isPending && (
                            <>
                                <p className="text-(--loading-text) mt-2">Friend request pending</p>

                                <p
                                    className="text-(--error-text) cursor-pointer"
                                    onClick={() => cancel()}
                                >
                                    Cancel
                                </p>
                            </>
                        )}
                    </>
                ))}

            <ToastContainer className="mt-12 text-sm text-left" />
        </>
    );
};

export default RequestButton;
