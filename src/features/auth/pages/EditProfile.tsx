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
import { useEffect, useState } from 'react';
import { ConnectSpotify } from '../components/ConnectSpotify';
import { ConnectLastfm } from '../components/ConnectLastfm';

const EditProfile = () => {
    const { data: user, isPending: isUserPending, error } = useUser();

    const [, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Edit profile | " + user?.profile.username;
    }, [user?.profile.username])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AllowedData>({ mode: 'onChange' });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setIsModalOpen } = useAuthStore();

    const { mutate, isPending } = useMutation<FormData, AxiosError<ErrorResponse>, FormData>({
        mutationFn: async (data) => {
            await axios.patch(`/profile/${user?.profile.username.toLocaleLowerCase()}/edit`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return data;
        },
        onSuccess: async (data) => {
            navigate(`/profile/${data.get('username')?.toString().toLocaleLowerCase()}`);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['profile', user?.profile.username] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: (err) => {
            if (err instanceof AxiosError && err.response) {
                err.message = err.response.data.message;
                return console.log(err.response);
            }
            console.log(err);
        },
    });

    const onProfileSubmit: SubmitHandler<AllowedData> = async (data) => {
        setIsModalOpen(false);
        const formData = new FormData();
        appendToFormData(formData, 'username', data.username);
        appendToFormData(formData, 'bio', data.bio);
        appendToFormData(formData, 'pfp', data.pfp[0]);

        mutate(formData);
        if (preview) URL.revokeObjectURL(preview);
    };

    if (isUserPending) return <span className="loading">Loading...</span>;

    if (error) return <span className="loading text-(--error-text)">{error.message}</span>;

    return (
        <main className="flex justify-center items-center pt-2 h-lg:pt-12 gap-2">
            <article
                className={
                    'border-2 border-primary p-4 pb-2.5 h-sm:pb-4 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary text-sm h-sm:text-base h-lg:text-lg'
                }
                aria-label="login-form"
                data-testid="login-section"
            >
                <h1 className="text-xl h-sm:text-2xl h-lg:text-3xl text-center mb-2 title">
                    Edit your profile
                </h1>
                <Form
                    className="flex flex-col gap-2"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit(onProfileSubmit)}
                >
                    <Form.Label
                        className="relative bg-(--card-light) size-18 h-sm:size-22 h-lg:size-30 rounded-full mx-auto z-2 cursor-pointer"
                        htmlFor="file-upload"
                    >
                        <img
                            src={preview ?? user?.profile.avatar_url}
                            className="size-18 h-sm:size-22 h-lg:size-30 rounded-full mx-auto absolute object-cover object-center"
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
                                            [
                                                'image/jpeg',
                                                'image/png',
                                                'image/svg',
                                                'image/gif',
                                            ].includes(files[0]?.type) ||
                                            'File format must be JPEG or PNG'
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
                            defaultValue={user?.profile.displayUsername}
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
                        Bio:{' '}
                        <Form.Textfield
                            defaultValue={user?.profile.bio}
                            {...register('bio')}
                            rows={3}
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
            <article
                className={
                    'flex flex-col gap-8 border-2 border-primary p-4 h-sm:pb-4 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary text-sm h-sm:text-base h-lg:text-lg'
                }
            >
                <div>
                    <h1 className="title text-xl">Providers</h1>
                    <p className="w-xs">
                        Connect to at least one of these providers to be able to play
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <ConnectSpotify />
                    <ConnectLastfm />
                </div>
            </article>
        </main>
    );
};

export default EditProfile;
