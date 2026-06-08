import axios from '@/shared/utils/axios';
import queryClient from '@/shared/utils/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

interface ResponseData {
    status: number;
    message: string;
    username: string;
}

const VerifyToken = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { data, isSuccess, error, isPending } = useQuery({
        queryKey: ['token'],
        queryFn: async () =>
            await axios
                .get<ResponseData>(`/verify/${token}`)
                .then((res) => res.data),
    });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ['user'] }).then(() => {
                navigate(`/profile/${data.username}/edit`);
            });
        }
    }, [isSuccess, navigate, data]);

    if (isPending) return <div>Loading...</div>;

    if (error) return <div>{error.message}</div>;

    return <></>;
};

export default VerifyToken;
