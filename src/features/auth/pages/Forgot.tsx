import { useForm, type SubmitHandler } from "react-hook-form";
import Form from "../components/form/Form";
import { useMutation } from "@tanstack/react-query";
import axios from "@/shared/utils/axios";
import { useState } from "react";
import { AxiosError } from "axios";
import type { ErrorResponse, FormResponse } from "../types/response";
import * as z from "zod";
import { forgotPasswordSchema } from "../schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const Forgot = () => {
  const [response, setResponse] = useState<FormResponse>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending, error } = useMutation<
    FormResponse,
    AxiosError<ErrorResponse>,
    ForgotPasswordData
  >({
    mutationFn: (data) => axios.post(`/forgot`, data).then((res) => res.data),
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data) {
        console.error(err.response.data);
        resetField("email");
      }
    },
  });

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
      <article
        className={"border-2 border-border p-5 bg-(--primary-color)"}
        aria-label="login-form"
        data-testid="login-section"
      >
        <h1 className="text-xl mb-2">Forgot your password</h1>
        <p className="opacity-80 pb-10">
          We'll send a link that will allow you to change your password
        </p>
        <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Form.Label>
            Email*:{" "}
            <Form.Input
              data-testid="inputEmail"
              type="email"
              {...register("email")}
            />
          </Form.Label>

          {errors.email && (
            <span className="text-(--error-text) text-right text-sm">
              {errors.email.message}
            </span>
          )}

          <Form.Input type="submit" value="Send" className="cursor-pointer" />
          {isPending && <div className="loading">Loading...</div>}
          {error && (
            <span className="text-(--error-text) text-center">
              {error.response?.data.message}
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

export default Forgot;
