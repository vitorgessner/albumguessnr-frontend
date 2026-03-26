import { useForm, type SubmitHandler } from "react-hook-form"
import Form from "../components/form/Form"

type FormData = {
    username: string,
    bio: string,
    pfp: FileList
}

const Profile = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

    const onProfileSubmit: SubmitHandler<FormData> = async (data) => {
        console.log(data);
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-dvh gap-2">
            <article className={"border-2 border-(--border) p-5 bg-(--primary-color)"}
                aria-label="login-form"
                data-testid="login-section">
                <h1 className="text-xl mb-2">Profile</h1>
                <Form className="flex flex-col gap-2" encType='multipart/form-data' onSubmit={handleSubmit(onProfileSubmit)}>
                    <Form.Label>
                        Username: <Form.Input type="text" {...register('username',
                            {
                                required: "Username is required",
                            }
                        )} />
                    </Form.Label>

                    {errors.username &&
                        <span className="text-(--error-text) text-right text-sm">{errors.username.message}</span>}

                    <Form.Label>
                        Bio: <Form.Textfield {...register('bio')} rows={5} cols={20}/>
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
                                    return ["image/jpeg", "image/png"].includes(files[0]?.type) || "File format must be JPEG or PNG"
                                }
                            }
                        })} />
                    </Form.Label>

                    {errors.pfp &&
                        <span className="text-(--error-text) text-right text-sm">{errors.pfp.message}</span>}

                    <Form.Input type="submit" value="Save Profile" className="cursor-pointer" />
                    {isSubmitting && <span className="text-center text-(--loading-text)">Loading...</span>}
                </Form>
            </article>
        </div>
    )
}

export default Profile;