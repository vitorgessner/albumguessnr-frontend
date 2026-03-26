interface ITextField extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

const Textfield = ({className, ...props}: ITextField) => {
    return (
        <textarea className={className} {...props}></textarea>
    )
}

export default Textfield;