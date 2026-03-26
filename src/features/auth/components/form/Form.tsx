import Label from "./Label";
import Input from "./Input";
import Textfield from "./Textfield";

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    className?: string;
    children: React.ReactNode
}

type FormComponent = React.FC<IFormProps> & {
    Label: typeof Label;
    Input: typeof Input;
    Textfield: typeof Textfield;
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
Form.Textfield = Textfield;

export default Form;