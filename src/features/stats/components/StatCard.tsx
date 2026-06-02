const StatCard = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) => (
    <div className="flex flex-col items-center gap-1 bg-secondary/40 border border-border rounded-lg py-3 px-2">
        <div className="text-terra">{icon}</div>
        <span className="text-base font-black number text-navy">{value}</span>
        <span className="text-[10px] text-muted-foreground leading-tight text-center">{label}</span>
    </div>
);

export default StatCard;