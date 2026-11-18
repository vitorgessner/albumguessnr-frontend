import { create } from "zustand";

type StatusType = 'IDLE' | 'SYNCING' | 'SUCCESS' | 'SUCCEEDWITHFAILURE' | 'FAILURE';


export interface ISyncStatusStore {
    status: StatusType;
    cursor: number;
    maxPages: number;
    albumsCount: number;

    setStatus: (status: StatusType) => void;
    setCursor: (cursor: number) => void;
    setMaxPages: (maxPages: number) => void;
    setAlbumsCount: (albumsCount: number) => void;
}

export const useSyncStatusStore = create<ISyncStatusStore>()((set) => ({
    status: 'IDLE',
    cursor: 1,
    maxPages: 3,
    albumsCount: 0,

    setStatus: (status) => set(() => ({
        status,
    })),

    setCursor: (cursor) => set(() => ({
        cursor,
    })),

    setMaxPages: (maxPages) => set(() => ({
        maxPages,
    })),

    setAlbumsCount: (albumsCount) => set(() => ({
        albumsCount,
    })),
}))