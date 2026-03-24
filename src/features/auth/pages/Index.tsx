import Form from "../components/form/Form";

const Index = () => {
    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted')
    }
    return (
        <div className="flex justify-center items-center h-dvh gap-2">
        <article className="border-2 border-black p-5">
            <h1>Login</h1>
            <Form className="flex flex-col gap-2" onSubmit={onSubmit}>
                <Form.Label>
                    Email: <Form.Input type="email" />
                </Form.Label>
                <Form.Label>
                    Password: <Form.Input type="password" />
                </Form.Label>
                <Form.Input type="submit" value="login" className="cursor-pointer" />
            </Form>
        </article>
        <article className="border-2 border-black p-5">
            <h1>Create an account</h1>
            <Form className="flex flex-col gap-2">
                <Form.Label>
                    Email: <Form.Input type="email" />
                </Form.Label>
                <Form.Label>
                    Password: <Form.Input type="password" />
                </Form.Label>
                <Form.Input type="submit" value="Create account" className="cursor-pointer" />
            </Form>
        </article>
        </div>
    )
}

export default Index;