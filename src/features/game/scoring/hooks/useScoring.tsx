import type { ErrorResponse } from '@/features/auth/types/response';
import axios from '@/shared/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import useCompare from '../../guess/hooks/useCompare';
import useScoringStore from '../stores/useScoringStore';

interface IScoringResponse {
    status: string;
    message: string;
    totalScore: number;
    isNewBestScore: boolean;
}

const useScoring = (timeSpent: number) => {
    const { currentAlbum } = useCompare();
    const { setIsNewBestScore } = useScoringStore();

    const [answers, setAnswers] = useState<{
        album: boolean | undefined;
        artist?: boolean | undefined;
        genre?: boolean | undefined;
        year?: boolean | undefined;
        tracklist?: number | undefined;
    }>({ album: undefined });


    const finalAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== undefined)
    )

    // const queryClient = useQueryClient();
    // const { data: user } = useUser();

    const { mutateAsync, isPending } = useMutation<IScoringResponse, ErrorResponse>({
        mutationKey: ['scoring'],
        mutationFn: () =>
            axios.post('/scoring', { albumId: currentAlbum.albumId, timeSpent, guessedCategories: finalAnswers }).then((res) => res.data),
        onSuccess: (data) => setIsNewBestScore(data.isNewBestScore),
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    return { setScore: mutateAsync, setAnswers, isPending };
};

export default useScoring;
