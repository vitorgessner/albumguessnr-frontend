const SkeletonRow = () => {
    return (
        <div className="flex items-center gap-3 px-4 py-3 h-[82px] border-b border-border last:border-0 animate-pulse">
            <div className="w-5 h-4 rounded bg-muted shrink-0" />
            <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3.5 rounded bg-muted w-28" />
                <div className="h-2.5 rounded bg-muted w-16" />
            </div>
            <div className="h-4 w-14 rounded bg-muted" />
        </div>
    );
};

export default SkeletonRow;
