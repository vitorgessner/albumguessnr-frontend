import { ArrowDown, ArrowUp } from 'lucide-react';

export const Legend = () => {
    return (
        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-sage/20 border border-success inline-block" />
                Correct
            </span>
            <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-secondary/60 border border-amber-dark inline-block" />
                Partial
            </span>
            <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-terra/10 border border-error inline-block" />
                Incorrect
            </span>
            <span className="flex items-center gap-1.5">
                <ArrowUp size={10} /> Higher
            </span>
            <span className="flex items-center gap-1.5">
                <ArrowDown size={10} /> Lower
            </span>
        </div>
    );
};
