import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ErrorResponse, FormResponse } from '../types/response';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import axios from '@/shared/utils/axios';
import Form from '../components/form/Form';
import { useParams } from 'react-router';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../schemas/formSchema';

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const PasswordChange = () => {
    const [response, setResponse] = useState<FormResponse | null>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { passwordResetToken } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm<ChangePasswordData>({
        mode: 'onChange',
        resolver: zodResolver(changePasswordSchema),
    });

    const { mutate, isPending } = useMutation<
        FormResponse,
        AxiosError<ErrorResponse>,
        ChangePasswordData
    >({
        mutationFn: (data) =>
            axios.put(`/passwordChange/${passwordResetToken}`, data).then((res) => res.data),
        onSuccess: (data) => {
            setResponse(data);
            setErrorMessage('');
            resetField('password');
            resetField('confirm');
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
            resetField('password');
            resetField('confirm');
        },
    });

    const onSubmit: SubmitHandler<ChangePasswordData> = (data) => {
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
                <h1 className="text-xl mb-10">Change your password</h1>
                <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Label>
                        Password:
                        <Form.Input
                            data-testid="inputPassword"
                            type="password"
                            className={`${errors.password && 'border-(--error-text)'}`}
                            {...register('password')}
                        />
                    </Form.Label>

                    {errors.password && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.password.message}
                        </span>
                    )}

                    <Form.Label>
                        Confirm password:
                        <Form.Input
                            data-testid="inputConfirm"
                            type="password"
                            className={`${errors.confirm && 'border-(--error-text)'}`}
                            {...register('confirm')}
                        />
                    </Form.Label>

                    {errors.confirm && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.confirm.message}
                        </span>
                    )}

                    <Form.Input
                        type="submit"
                        value={isPending ? 'Changing...' : 'Change Password'}
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
                        <span className="text-(--success-text) text-center">
                            {response.message}
                        </span>
                    )}
                </Form>
            </article>
        </div>
    );
};

export default PasswordChange;
