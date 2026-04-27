import { useMutation } from '@tanstack/react-query';
import type { ErrorResponse, FormResponse } from '../types/response';
import { AxiosError } from 'axios';
import * as z from 'zod';
import { forgotPasswordSchema } from '../schemas/formSchema';
import axios from '@/shared/utils/axios';
import type { UseFormGetValues, UseFormResetField } from 'react-hook-form';
import { useState } from 'react';

interface IResendComponentProps {
    getValues: UseFormGetValues<{
        email: string;
        password: string;
    }>;
    resetField: UseFormResetField<{
        email: string;
        password: string;
    }>;
}

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ResendEmailButton = ({ getValues, resetField }: IResendComponentProps) => {
    const [response, setResponse] = useState<{
        status: string;
        message: string;
    } | null>();

    const { mutate, isPending, error } = useMutation<
        FormResponse,
        AxiosError<ErrorResponse>,
        ForgotPasswordData
    >({
        mutationFn: (data) => axios.post(`/resendVerification/`, data).then((res) => res.data),
        onSuccess: (data) => {
            setResponse(data);
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err.response.data);
                resetField('password');
            }
        },
    });

    const onResendVerification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        mutate({ email: getValues('email') });
    };

    return (
        <div>
            {isPending && <span>Loading...</span>}
            <button
                className="text-(--loading-text) max-w-fit mx-auto"
                onClick={(e) => onResendVerification(e)}
            >
                Resend email
            </button>
            {error && <span className="text-(--error-text) text-center">{error.message}</span>}
            {response && (
                <span className="text-center text-(--success-text)">
                    {response.status + ': ' + response.message}
                </span>
            )}
        </div>
    );
};

export default ResendEmailButton;
