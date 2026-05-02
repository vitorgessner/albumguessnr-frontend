interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode
    className?: string;
}

const Label = ({children, className, ...props}: ILabelProps) => {
    return <label {...props} className={`flex flex-col items-start justify-start gap-2 ${className}`}>{children}</label>;
}

export default Label;