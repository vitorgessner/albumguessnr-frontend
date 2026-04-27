import { useForm, type SubmitHandler } from 'react-hook-form';
import Form from './form/Form';
import * as z from 'zod';
import { formSchema } from '../schemas/formSchema';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormResponse, ErrorResponse } from '../types/response';
import { AxiosError } from 'axios';
import axios from '@/shared/utils/axios';
import useUser from '../hooks/useUser';
import ResendEmailButton from './ResendEmailButton';

type LoginFormData = z.infer<typeof formSchema>;

const LoginForm = () => {
    const [response, setResponse] = useState<{
        status: string;
        message: string;
    } | null>();

    const { user } = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
        getValues,
    } = useForm<LoginFormData>({
        resolver: zodResolver(formSchema),
    });

    const { mutate, isPending, error } = useMutation<
        FormResponse,
        AxiosError<ErrorResponse>,
        LoginFormData
    >({
        mutationFn: (data: LoginFormData) => axios.post('/login', data).then((res) => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setResponse(data);
            return navigate(`/profile/${user?.profile.username}`);
        },
        onError: (err) => {
            console.log(err.response);
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err.response.data);
                resetField('password');
            }
        },
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        mutate(data);
    };

    return (
        <article
            className={'border-2 border-border p-5 bg-(--primary-color)'}
            aria-label="login-form"
            data-testid="login-section"
        >
            <h1 className="text-xl mb-2">Login</h1>
            <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Form.Label>
                    Email*:{' '}
                    <Form.Input data-testid="inputEmail" type="email" {...register('email')} />
                </Form.Label>

                {errors.email && (
                    <span className="text-(--error-text) text-right text-sm">
                        {errors.email.message}
                    </span>
                )}

                <Form.Label>
                    Password*: <Form.Input type="password" {...register('password')} />
                </Form.Label>

                {errors.password && (
                    <span className="text-(--error-text) text-right text-sm">
                        {errors.password.message}
                    </span>
                )}

                <Link to="/auth/forgot" className="text-(--loading-text)">
                    Forgot your password?
                </Link>
                <Form.Input type="submit" value="Login" className="cursor-pointer" />

                {isPending && <span>Loading...</span>}
                {error && (
                    <span className="text-(--error-text) text-center">
                        {error.response?.data.message}
                    </span>
                )}
                {error && error.response?.data.message === 'Email not verified' && (
                    <ResendEmailButton getValues={getValues} resetField={resetField} />
                )}
                {response && (
                    <span className="text-center text-(--success-text)">
                        {response.status + ': ' + response.message}
                    </span>
                )}
            </Form>
        </article>
    );
};

export default LoginForm;
