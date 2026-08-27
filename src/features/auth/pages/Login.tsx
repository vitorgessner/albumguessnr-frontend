import { useForm, type SubmitHandler } from 'react-hook-form';
import Form from '../components/form/Form';
import * as z from 'zod';
import { formSchema } from '../schemas/formSchema';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ErrorResponse, FormResponseWithUsername } from '../types/response';
import { AxiosError } from 'axios';
import axios from '@/shared/utils/axios';
import ResendEmailButton from '../components/ResendEmailButton';
import useAuthStore from '../stores/useAuthStore';
import { ToastContainer } from 'react-toastify';
import { LoginGoogle } from '../components/LoginGoogle';

type LoginFormData = z.infer<typeof formSchema>;

const Login = () => {
    const [searchParams] = useSearchParams();
    const { setIsLoggingOut } = useAuthStore();

    useEffect(() => {
        document.title = "Login";
    }, [])

    const message = searchParams.get('message');

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const [response, setResponse] = useState<{
        status: string;
        message: string;
    } | null>();

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
        FormResponseWithUsername,
        AxiosError<ErrorResponse>,
        LoginFormData
    >({
        mutationFn: (data: LoginFormData) => axios.post('/login', data).then((res) => res.data),
        onSuccess: async (data) => {
            setResponse(data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            return navigate(`/profile/${data.username.toLocaleLowerCase()}`);
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
        <div className="flex justify-center items-center max-w-90 h-full grow pt-8 mx-auto gap-2">
            <article
                className={
                    'min-w-72 border-2 border-primary p-5 bg-(--card-light) text-center rounded-lg three-dimension-primary'
                }
                aria-label="login-form"
                data-testid="login-section"
            >
                <h1 className="text-2xl">Login</h1>
                <p className="text-sm mb-2">Welcome back!</p>
                <Form className="flex flex-col gap-2 mb-1" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Label>
                        Email:
                        <Form.Input data-testid="inputEmail" type="email" {...register('email')} />
                    </Form.Label>

                    {errors.email && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.email.message}
                        </span>
                    )}

                    <Form.Label>
                        Password: <Form.Input type="password" {...register('password')} />
                    </Form.Label>

                    {errors.password && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.password.message}
                        </span>
                    )}

                    <Link to="/auth/forgot" className="text-(--loading-text) text-left mt-2">
                        Forgot your password?
                    </Link>
                    <Form.Input
                        type="submit"
                        value="Login"
                        className="text-white cursor-pointer border-2 primary-component"
                    />

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
                <div className="flex gap-2 justify-center mt-4">
                    <LoginGoogle />
                </div>
                <p className="text-red-600 py-2">{message}</p>
                <Link to={'/auth/register'} className="text-(--loading-text) text-sm">
                    Do not have an account? Create one here
                </Link>
                <ToastContainer />
            </article>
        </div>
    );
};

export default Login;
