import { useForm, type SubmitHandler } from 'react-hook-form';
import Form from '../components/form/Form';
import { useMutation } from '@tanstack/react-query';
import axios from '@/shared/utils/axios';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import type { ErrorResponse, FormResponse } from '../types/response';
import * as z from 'zod';
import { forgotPasswordSchema } from '../schemas/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const Forgot = () => {
    const [response, setResponse] = useState<FormResponse | null>();
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        document.title = "Forgot password";
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate, isPending } = useMutation<
        FormResponse,
        AxiosError<ErrorResponse>,
        ForgotPasswordData
    >({
        mutationFn: (data) => axios.post(`/forgot`, data).then((res) => res.data),
        onSuccess: (data) => {
            setResponse(data);
            setErrorMessage('');
            resetField('email');
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                const errorMsg =
                    err.response?.data?.message ||
                    err.message ||
                    'An error occurred. Please try again.';
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
            setResponse(null);
            resetField('email');
        },
    });

    const onSubmit: SubmitHandler<{ email: string }> = (data) => {
        setErrorMessage('');
        setResponse(null);
        mutate(data);
    };

    return (
        <div className="flex flex-col justify-center items-center max-w-90 h-full grow pt-8 mx-auto gap-2">
            <article
                className={'border-2 border-primary p-5 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary'}
                aria-label="login-form"
                data-testid="login-section"
            >
                <h1 className="text-xl mb-2">Forgot your password</h1>
                <p className="opacity-80 pb-10">
                    We'll send a link that will allow you to change your password
                </p>
                <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Label>
                        Email:{' '}
                        <Form.Input data-testid="inputEmail" type="email" {...register('email')} />
                    </Form.Label>

                    {errors.email && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.email.message}
                        </span>
                    )}

                    <Form.Input
                        type="submit"
                        value={isPending ? 'Sending...' : 'Send'}
                        className="cursor-pointer primary-component"
                        disabled={isPending}
                    />
                    {isPending && <div>Loading...</div>}
                    {errorMessage && (
                        <span className="text-(--error-text) text-center text-sm">
                            {errorMessage}
                        </span>
                    )}
                    {response && (
                        <span className="text-(--success-text) text-center text-sm">
                            {response.message}
                        </span>
                    )}
                </Form>
            </article>
        </div>
    );
};

export default Forgot;
