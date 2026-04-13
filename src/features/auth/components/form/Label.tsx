interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode
    className?: string;
}

const Label = ({children, className, ...props}: ILabelProps) => {
    return <label {...props} className={`flex justify-between items-center gap-2 ${className}`}>{children}</label>;
}

export default Label;