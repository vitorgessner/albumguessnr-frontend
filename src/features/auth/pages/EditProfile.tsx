import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from '../../../shared/utils/axios';
import { useNavigate, useSearchParams } from 'react-router';
import Form from '../components/form/Form';
import { AxiosError } from 'axios';
import useUser from '../hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/useAuthStore';
import type { ErrorResponse } from '../types/response';
import type { AllowedData } from '../types/editProfileResponse';
import appendToFormData from '../utils/appendToFormData';
import { useEffect, useRef, useState } from 'react';
import { ConnectLastfm } from '../components/ConnectLastfm';
import { getDaysUntilNextSync } from '../utils/getDaysUntilNextSync';

const EditProfile = () => {
    const { data: user, isPending: isUserPending, error } = useUser();
    const [searchParams] = useSearchParams();
    const [, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [providerError, setProviderError] = useState<string | null>(null);
    const [mainProvider, setMainProvider] = useState(user?.mainAccountId);

    useEffect(() => {
        document.title = 'Edit profile | ' + user?.profile.username;
    }, [user?.profile.username]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
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
        onError(error) {
            if (error instanceof AxiosError && error.response?.data.message === 'Username already taken') {
                setError('username', { message: 'Username already taken' })
            }
        }
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

    useEffect(() => {
        const setProvider = () => {
            if (user?.mainAccountId) {
                setMainProvider(user.mainAccountId);
            }
        }

        setProvider();
    }, [user]);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        const syncAlbums = async () => {
            if (searchParams.get('sync') === 'true') {
                hasRun.current = true;
                await axios.get('/sync');
            }
        }

        syncAlbums();
    }, [searchParams])

    const lastSyncedAt = user?.accounts.filter((account) => account.lastSyncedAt).sort((a, b) => {
        if (a.lastSyncedAt && b.lastSyncedAt) {
            return new Date(b.lastSyncedAt).getTime() - new Date(a.lastSyncedAt).getTime()
        }

        return 1
    }).at(0)?.lastSyncedAt;

    const days = getDaysUntilNextSync(lastSyncedAt);

    useEffect(() => {
        const printError = () => {
            if (searchParams.get('error')) {
                setProviderError(searchParams.get('error'));
            }
        }

        printError();
    }, [searchParams])

    if (isUserPending) return <span className="loading">Loading...</span>;

    if (error instanceof AxiosError) return <span className="loading text-(--error-text)">{error.response?.data.message}</span>;
    if (error) return <span className="loading text-(--error-text)">{error.message}</span>;

    return (
        <main className="flex flex-col md:flex-row justify-center items-center pt-2 h-lg:pt-12 gap-4">
            <article
                className={
                    'border-2 border-primary text-navy p-4 pb-2.5 h-sm:pb-4 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary text-sm h-sm:text-base h-lg:text-lg'
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
                                                'image/svg+xml',
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
                    'flex flex-col text-navy gap-8 h-full border-2 border-primary p-4 h-sm:pb-4 bg-(--card-light) min-w-90 text-center rounded-lg three-dimension-primary text-sm h-sm:text-base h-lg:text-lg'
                }
            >
                <div>
                    <h1 className="title text-xl">Providers</h1>
                    <p className="w-xs">
                        Connect to at least one of these providers to be able to play
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <ConnectLastfm mainAccountId={mainProvider} />
                    <a href="https://www.last.fm" target='_blank' className="text-sm text-navy underline">Powered by AudioScrobbler</a>
                    <p className="text-right text-sm text-red-600">{providerError}</p>
                </div>
                <div className='text-sm'>
                    {lastSyncedAt && <p>Last synced at: {new Date(lastSyncedAt).toLocaleDateString('en-US')}</p>}
                    {days && <p>Next sync in: {days} days</p>}
                </div>
            </article>
        </main>
    );
};

export default EditProfile;
