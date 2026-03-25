import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "../../../shared/utils/axios";
import Form from "../components/form/Form";
import { useState } from "react";
import { clearCookie, setCookie } from "../../../shared/utils/cookie";
import { AxiosError } from "axios";

type FormData = {
    email: string;
    password: string;
}

type FormResponse = {
    status: string;
    id: string;
    email: string;
    token: string;
}

type ErrorResponse = {
    status: string;
    name: string;
    message: string;
    statusCode: number;
}

const Index = () => {
    const [loginErrors, setloginErrors] = useState<ErrorResponse | null>();
    const [registerErrors, setregisterErrors] = useState<ErrorResponse | null>();

    const loginFormMethods = useForm<FormData>();
    const registerFormMethods = useForm<FormData>();

    const onLoginSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.post<FormResponse>('/login', data);
            const responseData = response.data;

            setCookie('token', responseData.token, 1);
            setloginErrors(null);
        } catch (err) {
            if (err instanceof AxiosError){
                const errorResponse = err.response?.data;
                setloginErrors({ ...errorResponse });
                console.error(errorResponse);
            }
        }

    }

    const onRegisterSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.post<FormResponse>('/register', data);
            const responseData = response.data;

            clearCookie('token');
            setCookie('token', responseData.token, 1);
            
            setregisterErrors(null);
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorResponse = err.response?.data;
                setregisterErrors({ ...errorResponse });
                console.error(errorResponse);
            }
        }
    }

    return (
        <div className="flex justify-center items-center h-dvh gap-2">
            <article className="border-2 border-black p-5">
                <h1>Login</h1>
                <Form className="flex flex-col gap-2" onSubmit={loginFormMethods.handleSubmit(onLoginSubmit)}>
                    <Form.Label>
                        Email: <Form.Input type="email" {...loginFormMethods.register('email',
                            {
                                required: "Email is required",
                            }
                        )} />
                    </Form.Label>
                    {loginFormMethods.formState.errors.email && 
                    <span className="text-red-600 text-right text-sm">{loginFormMethods.formState.errors.email.message}</span>}
                    <Form.Label>
                        Password: <Form.Input type="password" {...loginFormMethods.register('password',
                            {
                                required: "Password is required",
                            }
                        )} />
                    </Form.Label>
                    {loginFormMethods.formState.errors.password && 
                    <span className="text-red-600 text-right text-sm">{loginFormMethods.formState.errors.password.message}</span>}
                    <Form.Input type="submit" value="login" className="cursor-pointer" />
                    {loginErrors && 
                    <span className="text-red-600 text-center">{loginErrors.message}</span>}
                </Form>
            </article>
            <article className="border-2 border-black p-5">
                <h1>Create an account</h1>
                <Form className="flex flex-col gap-2" onSubmit={registerFormMethods.handleSubmit(onRegisterSubmit)}>
                    <Form.Label>
                        Email: <Form.Input type="email" {...registerFormMethods.register('email', {
                            required: "Email is required",
                        })}/>
                    </Form.Label>
                    {registerFormMethods.formState.errors.email && 
                    <span className="text-red-600 text-right text-sm">{registerFormMethods.formState.errors.email.message}</span>}
                    <Form.Label>
                        Password: <Form.Input type="password" {...registerFormMethods.register('password', {
                            required: "Password is required",
                        })}/>
                    </Form.Label>
                    {registerFormMethods.formState.errors.password && 
                    <span className="text-red-600 text-right text-sm">{registerFormMethods.formState.errors.password.message}</span>}
                    <Form.Input type="submit" value="Create account" className="cursor-pointer" />
                    {registerErrors && <span className="text-red-600 text-center">{registerErrors.message}</span>}
                </Form>
            </article>
            <button className="cursor-pointer border-2 p-1"
                onClick={ async () => { 
                    try {
                        const response = await axios.get('/auth')
                        console.log(response.data);
                    } catch (err) {
                        if (err instanceof AxiosError){
                            console.error(err.response?.data);
                        }
                    }
                } }
            >CLICA</button>
            <button className="cursor-pointer border-2 p-1"
                    onClick={
                        () => {
                            clearCookie('token');
                        }
                    }>DESLOGA</button>
        </div>
    )
}

export default Index;