import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "../../../shared/utils/axios";
import Form from "../components/form/Form";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import useMe from "../hooks/useMe";
import { ToastContainer, toast } from 'react-toastify';

type FormData = {
    email: string;
    password: string;
}

type FormResponse = {
    status: string;
    message: string;
}

type ErrorResponse = {
    status: string;
    name: string;
    message: string;
    statusCode: number;
}

const Index = () => {
    const fetchUser = useMe();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state?.message);
        }
    }, [location]);

    const [loginErrors, setloginErrors] = useState<ErrorResponse | null>();
    const [registerErrors, setregisterErrors] = useState<ErrorResponse | null>();
    const [response, setResponse] = useState<{ status: string, message: string }>();

    const loginFormMethods = useForm<FormData>();
    const registerFormMethods = useForm<FormData>();

    const onLoginSubmit: SubmitHandler<FormData> = async (data) => {
        setloginErrors(null);
        try {
            await axios.post<FormResponse>('/login', data);
            const user = await fetchUser()
            if (!user) return null;
            navigate(`/${user?.profile.username}/profile/edit`);
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data) {
                setloginErrors({ ...err.response.data });
                console.error(err.response.data);
                loginFormMethods.resetField('password')
            }
        }
    }

    const onRegisterSubmit: SubmitHandler<FormData> = async (data) => {
        setregisterErrors(null);
        try {
            const response = await axios.post<FormResponse>('/register', data);
            const responseData = response.data;
            setResponse(responseData);
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data) {
                setregisterErrors({ ...err.response.data });
                console.error(err.response.data);
                registerFormMethods.resetField('password');
            }
        }
    }

    const loginFormErrors = loginFormMethods.formState.errors;
    const registerFormErrors = registerFormMethods.formState.errors;

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
            <article className={"border-2 border-(--border) p-5 bg-(--primary-color)"}
                aria-label="login-form"
                data-testid="login-section">
                <h1 className="text-xl mb-2">Login</h1>
                <Form className="flex flex-col gap-2" onSubmit={loginFormMethods.handleSubmit(onLoginSubmit)}>
                    <Form.Label>
                        Email: <Form.Input data-testid="inputEmail" type="email" {...loginFormMethods.register('email',
                            {
                                required: "Email is required",
                            }
                        )} />
                    </Form.Label>

                    {loginFormErrors.email &&
                        <span className="text-(--error-text) text-right text-sm">{loginFormErrors.email.message}</span>}

                    <Form.Label>
                        Password: <Form.Input type="password" {...loginFormMethods.register('password',
                            {
                                required: "Password is required",
                            }
                        )} />
                    </Form.Label>

                    {loginFormErrors.password &&
                        <span className="text-(--error-text) text-right text-sm">{loginFormErrors.password.message}</span>}

                    <Form.Input type="submit" value="Login" className="cursor-pointer" />

                    {loginErrors &&
                        <span className="text-(--error-text) text-center">{loginErrors.message}</span>}
                    {loginFormMethods.formState.isSubmitting && <span className="text-center text-(--loading-text)">Loading...</span>}

                </Form>
            </article>
            <article className="border-2 border-(--border) p-5 bg-(--primary-color)"
                aria-label="register-form"
                data-testid="register-section">
                <h1 className="text-xl mb-2">Create an account</h1>
                <Form className="flex flex-col gap-2" onSubmit={registerFormMethods.handleSubmit(onRegisterSubmit)}>
                    <Form.Label>
                        Email: <Form.Input type="email" {...registerFormMethods.register('email', {
                            required: "Email is required",
                        })} />
                    </Form.Label>

                    {registerFormErrors.email &&
                        <span className="text-(--error-text) text-right text-sm">{registerFormErrors.email.message}</span>}

                    <Form.Label>
                        Password: <Form.Input type="password" {...registerFormMethods.register('password', {
                            required: "Password is required",
                        })} />
                    </Form.Label>

                    {registerFormErrors.password &&
                        <span className="text-(--error-text) text-right text-sm">{registerFormErrors.password.message}</span>}

                    <Form.Input type="submit" value="Create account" className="cursor-pointer" />

                    {registerErrors && <span className="text-(--error-text) text-center">{registerErrors.message}</span>}
                    {registerFormMethods.formState.isSubmitting && <span className="text-center text-(--loading-text)">Loading...</span>}
                    {response && <span className="text-center text-(--success-text)">{response.status + ': ' + response.message}</span>}

                </Form>
            </article>
            <ToastContainer />
        </div>
    )
}

export default Index;