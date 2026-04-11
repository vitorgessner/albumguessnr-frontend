import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "../../../shared/utils/axios";
import { useNavigate } from "react-router";
import Form from "../components/form/Form";
import { AxiosError } from "axios";
import useUser from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../stores/useAuthStore";
import type { ErrorResponse } from "../types/response";
import type { AllowedData } from "../types/editProfileResponse";
import appendToFormData from "../utils/appendToFormData";

const EditProfile = () => {
    const { user, isPending: isUserPending, error } = useUser();
    const { register, handleSubmit, formState: { errors } } = useForm<AllowedData>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setIsModalOpen } = useAuthStore();

    const { mutate, isPending } = useMutation<FormData, AxiosError<ErrorResponse>, FormData>({
        mutationFn: async (data) => {
            await axios.patch(`/profile/${user?.profile.username}/edit`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            await axios.put(`/integration`, { lastfmUsername: data.get('lastfmUsername') });

            return data;
        },
        onSuccess: async (data) => {
                navigate(`/profile/${data.get('username')}`)
                queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                console.log(err.response?.data.message);
            }
            console.log(err);
        }
    })

    const onProfileSubmit: SubmitHandler<AllowedData> = async (data) => {
        setIsModalOpen(false);
        const formData = new FormData();
        appendToFormData(formData, 'username', data.username);
        appendToFormData(formData, 'lastfmUsername', data.lastfmUsername);
        appendToFormData(formData, 'bio', data.bio);
        appendToFormData(formData, 'pfp', data.pfp[0]);
        console.log(formData);

        mutate(formData);
    }

    if (isUserPending) return <span className="loading">Loading...</span>

    if (error) return <span className="loading text-(--error-text)">{error.message}</span>

    return (<main className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
        <article className={"border-2 border-(--border) p-5 bg-(--primary-color) text-center"}
            aria-label="login-form"
            data-testid="login-section">
            <h1 className="text-xl text-left mb-2">Edit your profile</h1>
            <Form className="flex flex-col gap-2" encType='multipart/form-data' onSubmit={handleSubmit(onProfileSubmit)}>
                <Form.Label>
                    Username*: <Form.Input type="text" defaultValue={user?.profile.username} {...register('username',
                        {
                            required: "Username is required",
                        }
                    )} />
                </Form.Label>

                <Form.Label>
                    LastFm Username: <Form.Input defaultValue={user?.lastfmIntegration && user?.lastfmIntegration.lastfmUsername} type="text" {...register('lastfmUsername')} />
                </Form.Label>

                {errors.username &&
                    <span className="text-(--error-text) text-right text-sm">{errors.username.message}</span>}

                <Form.Label>
                    Bio: <Form.Textfield defaultValue={user?.profile.bio} {...register('bio')} rows={5} cols={20} />
                </Form.Label>

                {errors.bio &&
                    <span className="text-(--error-text) text-right text-sm">{errors.bio.message}</span>}

                <Form.Label>
                    Profile Picture: <Form.Input type="file" {...register('pfp', {
                        required: false,
                        validate: {
                            lessThan3MB: (files) => {
                                if (files.length === 0) return true
                                return files[0]?.size < 3 * 1024 * 1024 || 'File size must be less than 3MB';
                            },
                            acceptedFormats: (files) => {
                                if (files.length === 0) return true;
                                return ["image/jpeg", "image/png", "image/svg"].includes(files[0]?.type) || "File format must be JPEG or PNG"
                            }
                        }
                    })} />
                </Form.Label>

                {errors.pfp &&
                    <span className="text-(--error-text) text-right text-sm">{errors.pfp.message}</span>}

                <Form.Input type="submit" value="Save Profile" className="cursor-pointer" />
                {isPending && <span className="text-center text-(--loading-text)">Loading...</span>}
            </Form>
            <button className="text-(--error-text) mx-auto" onClick={() => navigate(`/profile/${user?.profile.username}`)}>Cancel</button>
        </article>
    </main>)
}

export default EditProfile