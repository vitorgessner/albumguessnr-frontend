const StatBar = ({
    label,
    value,
    max,
    color,
}: {
    label: string;
    value: number;
    max: number;
    color: string;
}) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-navy">{label}</span>
                <span className="text-xs font-black number text-muted-foreground">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs font-bold number text-muted-foreground">
                {percentage.toFixed(2)} %
            </span>
        </div>
    );
};

export default StatBar;
