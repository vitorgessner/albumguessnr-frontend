const Label = ({children}: {children: React.ReactNode}) => {
    return <label className="flex justify-between items-center gap-2">{children}</label>;
}

export default Label;