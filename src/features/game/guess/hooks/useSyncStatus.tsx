import axiosInstance from "@/shared/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useSyncStatusStore, type ISyncStatusStore } from "../stores/useSyncStatusStore";
import { useEffect } from "react";
import useAuthStore from "@/features/auth/stores/useAuthStore";

export const useSyncStatus = () => {
    const { isAuthenticated } = useAuthStore()
    const { setAlbumsCount, setCursor, setMaxPages, setStatus, status } = useSyncStatusStore();

    const { data } = useQuery<ISyncStatusStore>({
        queryKey: ['sync-status'],
        queryFn: () => axiosInstance.get('/integration/sync/status').then((r) => r.data),
        refetchInterval: (query) => {
            const watchUntil = Number(sessionStorage.getItem('syncWatchUntil') ?? 0);
            const waiting = Date.now() < watchUntil;
            return query.state.data?.status === 'SYNCING' || waiting ? 4000 : false;
        },
        refetchIntervalInBackground: false,
        enabled: isAuthenticated && (status !== 'SUCCEEDWITHFAILURE' && status !== 'SUCCESS'),
    });

    useEffect(() => {
        if (!data) {
            return ;
        }
        setAlbumsCount(data.albumsCount);
        setCursor(data.cursor);
        setMaxPages(data.maxPages);
        setStatus(data.status);
        if (data.status === 'SYNCING') sessionStorage.removeItem('syncWatchUntil');
    }, [data, setAlbumsCount, setCursor, setMaxPages, setStatus]);

    return { data };
}
