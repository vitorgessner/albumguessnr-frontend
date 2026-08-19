import { useForm, type SubmitHandler } from 'react-hook-form';
import Form from '../components/form/Form';
import * as z from 'zod';
import { registerSchema } from '../schemas/formSchema';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormResponse, ErrorResponse } from '../types/response';
import { AxiosError } from 'axios';
import axios from '@/shared/utils/axios';
import { Link, useSearchParams } from 'react-router';
import { LoginGoogle } from '../components/LoginGoogle';

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const [response, setResponse] = useState<{
        status: string;
        message: string;
    } | null>();
    const [searchParams] = useSearchParams();

    const message = searchParams.get('message');

    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate, isPending, error } = useMutation<
        FormResponse,
        AxiosError<ErrorResponse>,
        RegisterFormData
    >({
        mutationFn: (data) => axios.post('/register', data).then((res) => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setResponse(data);
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
                resetField('password');
                resetField('confirm');
            }
        },
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        mutate(data);
    };

    return (
        <div className="flex justify-center items-center max-w-90 h-full grow pt-8 mx-auto gap-2">
            <article
                className="min-w-72 max-w-78 border-2 border-primary p-5 bg-(--card-light) text-center rounded-lg three-dimension-primary"
                aria-label="register-form"
                data-testid="register-section"
            >
                <h1 className="text-2xl">Create an account</h1>
                <p className="mb-2 text-sm">Join the most fun album guessing community</p>
                <Form
                    className="flex flex-col gap-2 mb-1 text-wrap"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Form.Label>
                        Email: <Form.Input type="email" {...register('email')} />
                    </Form.Label>

                    {errors.email && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.email.message}
                        </span>
                    )}

                    <Form.Label>
                        Password:
                        <Form.Input type="password" {...register('password')} />
                    </Form.Label>
                    {errors.password && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.password.message}
                        </span>
                    )}

                    <Form.Label>
                        Confirm Password:
                        <Form.Input type="password" {...register('confirm')} />
                    </Form.Label>
                    {errors.confirm && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.confirm.message}
                        </span>
                    )}

                    <Form.Input
                        type="submit"
                        value="Create account"
                        className="text-white cursor-pointer primary-component"
                    />

                    {isPending && <span>Loading...</span>}
                    {error && (
                        <span className="text-(--error-text) text-center">
                            {error.response?.data.message}
                        </span>
                    )}
                    {response && (
                        <span className="text-center text-(--success-text)">
                            {response.status + ': ' + response.message}
                        </span>
                    )}
                </Form>
                <div className="flex gap-2 justify-center mt-4">
                    <LoginGoogle />
                </div>
                <p className="text-red-600 py-2">{message}</p>
                <Link to={'/auth/login'} className="text-(--loading-text) text-sm">
                    Already registered? Try logging in
                </Link>
            </article>
        </div>
    );
};

export default Register;
