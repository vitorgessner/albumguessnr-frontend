const EmptyFriends = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3 h-full">
            <span className="text-5xl">👥</span>
            <p className="font-heading font-bold text-navy text-base">Empty ranking</p>
            <p className="text-sm text-muted-foreground leading-snug">
                None of your friends played in the specified period (including you)
            </p>
        </div>
    );
};

export default EmptyFriends;