interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
} 

const Input = ({className, ...props}: IInputProps) => {
    return <input className={className} {...props} />;
}

export default Input;