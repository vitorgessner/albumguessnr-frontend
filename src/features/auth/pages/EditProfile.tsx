import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from '../../../shared/utils/axios';
import { useNavigate } from 'react-router';
import Form from '../components/form/Form';
import { AxiosError } from 'axios';
import useUser from '../hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/useAuthStore';
import type { ErrorResponse } from '../types/response';
import type { AllowedData } from '../types/editProfileResponse';
import appendToFormData from '../utils/appendToFormData';
import { useState } from 'react';

const EditProfile = () => {
    const { data: user, isPending: isUserPending, error } = useUser();

    const [, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<AllowedData>({ mode: 'onChange' });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setIsModalOpen } = useAuthStore();

    const { mutate, isPending } = useMutation<FormData, AxiosError<ErrorResponse>, FormData>({
        mutationFn: async (data) => {
            await axios.put(`/integration`, { lastfmUsername: data.get('lastfmUsername') });
            
            await axios.patch(`/profile/${user?.profile.username}/edit`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return data;
        },
        onSuccess: async (data) => {
            navigate(`/profile/${data.get('username')}`);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['profile', user?.profile.username] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response) {
                err.message = err.response.data.message;
                setError('lastfmUsername', err)
                return console.log(err.response);
            }
            console.log(err);
        },
    });

    const onProfileSubmit: SubmitHandler<AllowedData> = async (data) => {
        setIsModalOpen(false);
        const formData = new FormData();
        appendToFormData(formData, 'username', data.username);
        appendToFormData(formData, 'lastfmUsername', data.lastfmUsername);
        appendToFormData(formData, 'bio', data.bio);
        appendToFormData(formData, 'pfp', data.pfp[0]);

        mutate(formData);
        if (preview) URL.revokeObjectURL(preview);
    };

    if (isUserPending) return <span className="loading">Loading...</span>;

    if (error) return <span className="loading text-(--error-text)">{error.message}</span>;

    return (
        <main className="flex flex-col justify-center lg:justify-start items-center pt-3 main-height gap-2">
            <article
                className={
                    'border-2 border-primary p-5 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary'
                }
                aria-label="login-form"
                data-testid="login-section"
            >
                <h1 className="text-2xl text-center mb-2">Edit your profile</h1>
                <Form
                    className="flex flex-col gap-2"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit(onProfileSubmit)}
                >
                    <Form.Label
                        className="relative bg-(--card-light) size-26 h-lg:size-32 rounded-full mx-auto z-2 cursor-pointer"
                        htmlFor="file-upload"
                    >
                        <img
                            src={preview ?? user?.profile.avatar_url}
                            className="size-26 h-lg:size-32 rounded-full mx-auto absolute object-cover object-center"
                            alt=""
                        />
                        <Form.Input
                            type="file"
                            id="file-upload"
                            className="rounded-full mx-auto z-1 hidden"
                            {...register('pfp', {
                                required: false,
                                validate: {
                                    lessThan3MB: (files) => {
                                        if (files.length === 0) return true;
                                        return (
                                            files[0]?.size < 3 * 1024 * 1024 ||
                                            'File size must be less than 3MB'
                                        );
                                    },
                                    acceptedFormats: (files) => {
                                        if (files.length === 0) return true;
                                        return (
                                            ['image/jpeg', 'image/png', 'image/svg', 'image/gif'].includes(
                                                files[0]?.type
                                            ) || 'File format must be JPEG or PNG'
                                        );
                                    },
                                },
                                onChange: (e) => {
                                    if (!e.target.files || e.target.files.length === 0) {
                                        setSelectedFile(null);
                                        return;
                                    }
                                    setSelectedFile(e.target.files[0]);
                                    const objectUrl = URL.createObjectURL(e.target.files[0]);
                                    setPreview(objectUrl);
                                },
                            })}
                        />
                    </Form.Label>

                    {errors.pfp && (
                        <span className="text-(--error-text) text-center text-sm">
                            {errors.pfp.message}
                        </span>
                    )}

                    <Form.Label>
                        Username:{' '}
                        <Form.Input
                            type="text"
                            defaultValue={user?.profile.username}
                            {...register('username', {
                                required: 'Username is required',
                            })}
                        />
                    </Form.Label>

                    {errors.username && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.username.message}
                        </span>
                    )}

                    <Form.Label>
                        LastFm Username:{' '}
                        <Form.Input
                            defaultValue={
                                user?.lastfmIntegration && user?.lastfmIntegration.lastfmUsername
                            }
                            type="text"
                            {...register('lastfmUsername')}
                        />
                    </Form.Label>

                    {errors.lastfmUsername && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.lastfmUsername.message}
                        </span>
                    )}

                    <Form.Label>
                        Bio:{' '}
                        <Form.Textfield
                            defaultValue={user?.profile.bio}
                            {...register('bio')}
                            rows={4}
                            cols={20}
                        />
                    </Form.Label>

                    {errors.bio && (
                        <span className="text-(--error-text) text-right text-sm">
                            {errors.bio.message}
                        </span>
                    )}

                    <Form.Input
                        type="submit"
                        value="Save Profile"
                        className="text-white cursor-pointer primary-component"
                    />
                    {isPending && (
                        <span className="text-center text-(--loading-text)">Loading...</span>
                    )}
                </Form>
                <button
                    className="text-(--error-text) mx-auto mt-2"
                    onClick={() => navigate(`/profile/${user?.profile.username}`)}
                >
                    Cancel
                </button>
            </article>
        </main>
    );
};

export default EditProfile;
