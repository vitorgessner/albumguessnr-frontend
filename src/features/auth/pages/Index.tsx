import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "../../../shared/utils/axios";
import Form from "../components/form/Form";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";
import { ToastContainer } from 'react-toastify';
import useAuthStore from "../stores/useAuthStore";
import useUser from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponse, FormResponse } from "../types/response";

type FormData = {
    email: string;
    password: string;
}

const Index = () => {
    const { user, isPending } = useUser();
    const { setIsLoggingOut } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggingOut(false);
    }, [setIsLoggingOut]);

    const [registerResponse, setRegisterResponse] = useState<{ status: string, message: string } | null>();
    const [loginResponse, setLoginResponse] = useState<{ status: string, message: string } | null>();

    const loginFormMethods = useForm<FormData>();
    const registerFormMethods = useForm<FormData>();

    const { mutate: mutateLogin, isPending: isLoginPending, error: loginError } = useMutation<FormResponse, AxiosError<ErrorResponse>, FormData>({
        mutationFn: (data: FormData) => axios.post('/login', data).then(res => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setLoginResponse(data)
            return navigate(`/profile/${user?.profile.username}`);
        },
        onError: (err) => {
            console.log(err.response);
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err.response.data);
                loginFormMethods.resetField('password')
            }
        }
    })

    const onLoginSubmit: SubmitHandler<FormData> = async (data) => {
        mutateLogin(data);
    }

    const { mutate: mutateRegister, isPending: isRegisterPending, error: registerError } = useMutation<FormResponse, AxiosError<ErrorResponse>, FormData>({
        mutationFn: (data) => axios.post('/register', data).then(res => res.data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setRegisterResponse(data)
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err);
                loginFormMethods.resetField('password')
            }
        }
    })

    const onRegisterSubmit: SubmitHandler<FormData> = async (data) => {
        mutateRegister(data);
    }

    const { mutate: mutateResend, isPending: isResendPending, error: resendError } = useMutation<FormResponse, AxiosError<ErrorResponse>, {email: string}>({
        mutationFn: (data: Omit<FormData, 'password'>) => axios.post(`/resendVerification/`, data).then(res => res.data),
        onSuccess: (data) => {
            setLoginResponse(data);
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response?.data) {
                console.error(err.response.data);
                loginFormMethods.resetField('password')
            }
        }
    });

    const onResendVerification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        mutateResend({ email: loginFormMethods.getValues('email') })
    }

    const loginFormErrors = loginFormMethods.formState.errors;
    const registerFormErrors = registerFormMethods.formState.errors;

    if (isPending) return <div className="loading">Loading...</div>

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
            <article className={"border-2 border-(--border) p-5 bg-(--primary-color)"}
                aria-label="login-form"
                data-testid="login-section">
                <h1 className="text-xl mb-2">Login</h1>
                <Form className="flex flex-col gap-2" onSubmit={loginFormMethods.handleSubmit(onLoginSubmit)}>
                    <Form.Label>
                        Email*: <Form.Input data-testid="inputEmail" type="email" {...loginFormMethods.register('email',
                            {
                                required: "Email is required",
                            }
                        )} />
                    </Form.Label>

                    {loginFormErrors.email &&
                        <span className="text-(--error-text) text-right text-sm">{loginFormErrors.email.message}</span>}

                    <Form.Label>
                        Password*: <Form.Input type="password" {...loginFormMethods.register('password',
                            {
                                required: "Password is required",
                            }
                        )} />
                    </Form.Label>

                    {loginFormErrors.password &&
                        <span className="text-(--error-text) text-right text-sm">{loginFormErrors.password.message}</span>}

                    <Link to='/auth/forgot' className="text-(--loading-text)">Forgot your password?</Link>
                    <Form.Input type="submit" value="Login" className="cursor-pointer" />

                    {isLoginPending && <span>Loading...</span>}
                    {isResendPending && <span>Loading...</span>}
                    {loginError &&
                        <span className="text-(--error-text) text-center">{loginError.response?.data.message}</span>}
                    {loginError && loginError.response?.data.message === 'Email not verified' && <button className="text-(--loading-text) max-w-fit mx-auto" onClick={(e) => onResendVerification(e)}>Resend email</button>}
                    {resendError &&
                        <span className="text-(--error-text) text-center">{resendError.message}</span>}
                    {loginResponse && <span className="text-center text-(--success-text)">{loginResponse.status + ': ' + loginResponse.message}</span>}

                </Form>
            </article>
            <article className="border-2 border-(--border) p-5 bg-(--primary-color)"
                aria-label="register-form"
                data-testid="register-section">
                <h1 className="text-xl mb-2">Create an account</h1>
                <Form className="flex flex-col gap-2" onSubmit={registerFormMethods.handleSubmit(onRegisterSubmit)}>
                    <Form.Label>
                        Email*: <Form.Input type="email" {...registerFormMethods.register('email', {
                            required: "Email is required",
                        })} />
                    </Form.Label>

                    {registerFormErrors.email &&
                        <span className="text-(--error-text) text-right text-sm">{registerFormErrors.email.message}</span>}

                    <Form.Label>
                        Password*: <Form.Input type="password" {...registerFormMethods.register('password', {
                            required: "Password is required",
                        })} />
                    </Form.Label>

                    {registerFormErrors.password &&
                        <span className="text-(--error-text) text-right text-sm">{registerFormErrors.password.message}</span>}

                    <Form.Input type="submit" value="Create account" className="cursor-pointer" />

                    {isRegisterPending && <span>Loading...</span>}
                    {registerError && <span className="text-(--error-text) text-center">{registerError.response?.data.message}</span>}
                    {registerResponse && <span className="text-center text-(--success-text)">{registerResponse.status + ': ' + registerResponse.message}</span>}

                </Form>
            </article>
            <ToastContainer />
        </div>
    )
}

export default Index;