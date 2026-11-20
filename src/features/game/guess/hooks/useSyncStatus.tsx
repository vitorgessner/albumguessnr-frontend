import axiosInstance from "@/shared/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useSyncStatusStore, type ISyncStatusStore } from "../stores/useSyncStatusStore";
import { useEffect } from "react";
import useAuthStore from "@/features/auth/stores/useAuthStore";

const TERMINAL_STATUSES = ['SUCCESS', 'SUCCEEDWITHFAILURE'] as const;

export const useSyncStatus = () => {
    const { isAuthenticated } = useAuthStore()
    const { setAlbumsCount, setCursor, setMaxPages, setStatus } = useSyncStatusStore();

    const { data } = useQuery<ISyncStatusStore>({
        queryKey: ['sync-status'],
        queryFn: () => axiosInstance.get('/integration/sync/status').then((r) => r.data),
        refetchInterval: (query) => {
            const currentStatus = query.state.data?.status;

            if (currentStatus && TERMINAL_STATUSES.includes(currentStatus as (typeof TERMINAL_STATUSES)[number])) {
                return false;
            }

            if (currentStatus === 'SYNCING') {
                return 4000;
            }

            const watchUntil = Number(sessionStorage.getItem('syncWatchUntil') ?? 0);
            return Date.now() < watchUntil ? 4000 : false;
        },
        refetchIntervalInBackground: false,
        enabled: isAuthenticated
    });

    useEffect(() => {
        if (!data) {
            return ;
        }
        setAlbumsCount(data.albumsCount);
        setCursor(data.cursor);
        setMaxPages(data.maxPages);
        setStatus(data.status);

        if (data.status === 'SYNCING' || TERMINAL_STATUSES.includes(data.status as (typeof TERMINAL_STATUSES)[number])) sessionStorage.removeItem('syncWatchUntil');
    }, [data, setAlbumsCount, setCursor, setMaxPages, setStatus]);

    return { data };
}
