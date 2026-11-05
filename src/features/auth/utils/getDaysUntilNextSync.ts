export const getDaysUntilNextSync = (lastSyncedAt?: string | null) => {
    if (lastSyncedAt) {
        return (
            Math.ceil(28 - (new Date().getTime() / (1000 * 60 * 60 * 24) -
            (new Date(lastSyncedAt).getTime() ?? 0) / (1000 * 60 * 60 * 24)))
        );
    }

    return null;
};