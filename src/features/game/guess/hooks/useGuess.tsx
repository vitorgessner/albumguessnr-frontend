import type { ErrorResponse } from '@/features/auth/types/response';
import axios from '@/shared/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import useCompare from './useCompare';
import useScoringStore from '../../scoring/stores/useScoringStore';

interface IGuessResponse {
    status: string;
    message: string;
    totalScore: number;
    isNewBestScore: boolean;
}

export type Answers = {
    album: boolean | undefined;
    artist?: boolean | undefined;
    genre?: boolean | undefined;
    year?: boolean | undefined;
    tracklist?: {
        trackId: string;
        isCorrect: boolean;
    }[] | undefined;
}

const useGuess = (timeSpent: number) => {
    const { currentAlbum } = useCompare();
    const { setIsNewBestScore } = useScoringStore();

    const [answers, setAnswers] = useState<Answers>({ album: undefined });


    const finalAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== undefined)
    )

    const { mutateAsync, isPending } = useMutation<IGuessResponse, ErrorResponse>({
        mutationKey: ['guess'],
        mutationFn: () =>
            axios.post('/guess', { albumId: currentAlbum.albumId, timeSpent, guessedCategories: finalAnswers }).then((res) => res.data),
        onSuccess: (data) => setIsNewBestScore(data.isNewBestScore),
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
            }
        },
    });

    return { setGuess: mutateAsync, answers, setAnswers, isPending };
};

export default useGuess;
