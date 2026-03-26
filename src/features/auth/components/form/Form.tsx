import Label from "./Label";
import Input from "./Input";

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    className?: string;
    children: React.ReactNode
}

type FormComponent = React.FC<IFormProps> & {
    Label: typeof Label;
    Input: typeof Input;
}

const Form: FormComponent = ({className, children, ...props}: IFormProps) => {
    return (
        <>
            <form method="post" className={className} {...props}>
                {children}
            </form>
        </>
    )
};

Form.Label = Label;
Form.Input = Input;

export default Form;